// One-off migration: copy published Opinly-rendered posts into Firestore (collection "blogPosts")
// and their images into Firebase Storage. Reads only public pages; needs no Opinly key.
// Usage: node scripts/import-opinly-posts.mjs --source <blog base URL> --site <site origin> [--dry-run]
//   --source  base URL whose /blog and /blog/<slug> serve the posts (the SSR function URL)
//   --site    public origin used for canonical URLs (e.g. https://www.automationbymeir.com)
import { createRequire } from "module";
import crypto from "crypto";
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const SOURCE = (opt("source") || "").replace(/\/$/, "");
const SITE = (opt("site") || "").replace(/\/$/, "");
const DRY = args.includes("--dry-run");
if (!SOURCE || !SITE) { console.error("--source and --site are required"); process.exit(2); }

const get = async (u, bin = false) => {
  const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return bin ? Buffer.from(await r.arrayBuffer()) : r.text();
};
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const CDN = /https:\/\/cdn\.opinly\.ai\/[^"'\s)<]+/g;

function parse(slug, html) {
  const ld = JSON.parse((html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [, "{}"])[1].replace(/\\u003c/g, "<"));
  const art = (html.match(/<article[\s\S]*?<\/article>/) || [""])[0];
  if (!art) throw new Error(`no article for ${slug}`);
  const start = art.indexOf('<div class="content">');
  if (start < 0) throw new Error(`no content div for ${slug}`);
  const faqAt = art.indexOf('<section class="faq">');
  const end = faqAt > 0 ? art.lastIndexOf("</div>", faqAt) : art.lastIndexOf("</div>");
  const contentHtml = art.slice(start + '<div class="content">'.length, end);
  const faqs = [...art.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)]
    .map((m) => ({ question: unesc(m[1]), answer: unesc(m[2]) }));
  const hero = (art.match(/<img class="hero" src="([^"]+)" alt="([^"]*)"/) || []);
  const meta = (n) => (html.match(new RegExp(`<meta name="${n}" content="([^"]*)"`)) || [])[1];
  return {
    slug,
    title: unesc(ld.headline || (art.match(/<h1>([\s\S]*?)<\/h1>/) || [, slug])[1]),
    metaTitle: unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1]),
    metaDescription: unesc(meta("description") || ld.description || ""),
    description: unesc(ld.description || meta("description") || ""),
    firstPublishedAt: ld.datePublished,
    modifiedAt: ld.dateModified || ld.datePublished,
    author: ld.author && ld.author.name ? { name: ld.author.name } : null,
    heroSrc: hero[1] ? unesc(hero[1]) : null,
    heroAlt: hero[2] ? unesc(hero[2]) : "",
    contentHtml,
    faqs,
    status: "published",
    source: "opinly-export",
    canonical: `${SITE}/blog/${slug}`,
  };
}

let bucket, db;
if (!DRY) {
  const admin = require("../functions/node_modules/firebase-admin");
  admin.initializeApp();
  db = admin.firestore();
  const pid = process.env.GCLOUD_PROJECT || JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS ? (await import("fs")).readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8") : "{}").project_id;
  const cands = [process.env.STORAGE_BUCKET, `${pid}.firebasestorage.app`, `${pid}.appspot.com`].filter(Boolean);
  for (const c of cands) {
    try { const b = admin.storage().bucket(c); if ((await b.exists())[0]) { bucket = b; break; } } catch (e) { console.log(`bucket ${c}: ${e.message}`); }
  }
  if (!bucket) throw new Error(`no storage bucket found among ${cands.join(", ")}`);
  console.log(`project=${pid} bucket=${bucket.name}`);
}

async function mirror(slug, url, cache) {
  if (cache.has(url)) return cache.get(url);
  const file = url.split("/").pop().split("?")[0];
  const bytes = await get(url, true);
  let out = `DRY:blog-images/${slug}/${file}`;
  if (!DRY) {
    const token = crypto.randomUUID();
    const dest = `blog-images/${slug}/${file}`;
    await bucket.file(dest).save(bytes, { metadata: { contentType: file.endsWith(".webp") ? "image/webp" : undefined, cacheControl: "public, max-age=31536000", metadata: { firebaseStorageDownloadTokens: token } } });
    out = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`;
  }
  cache.set(url, out);
  return out;
}

const index = await get(`${SOURCE}/blog`);
const slugs = [...new Set([...index.matchAll(/href="\/blog\/([^"\/]+)"/g)].map((m) => m[1]))];
console.log(`found ${slugs.length} posts at ${SOURCE}/blog`);
let n = 0;
for (const slug of slugs) {
  const p = parse(slug, await get(`${SOURCE}/blog/${slug}`));
  const cache = new Map();
  const urls = new Set([...(p.contentHtml.match(CDN) || []), ...(p.heroSrc && CDN.test(p.heroSrc) ? [p.heroSrc] : [])]);
  CDN.lastIndex = 0;
  for (const u of urls) await mirror(slug, u, cache);
  let html = p.contentHtml;
  for (const [u, to] of cache) html = html.split(u).join(to);
  const doc = {
    slug: p.slug, title: p.title, metaTitle: p.metaTitle, metaDescription: p.metaDescription, description: p.description,
    firstPublishedAt: p.firstPublishedAt, modifiedAt: p.modifiedAt, author: p.author, category: null,
    titleFile: p.heroSrc ? { fileKey: cache.get(p.heroSrc) || p.heroSrc, altText: p.heroAlt } : null,
    contentHtml: html, faqs: p.faqs, status: "published", source: p.source,
  };
  if (!DRY && /opinly\.ai/.test(JSON.stringify(doc))) throw new Error(`opinly URL left in ${slug}`);
  if (!DRY) await db.collection("blogPosts").doc(slug).set(doc);
  n++;
  console.log(`${DRY ? "dry " : ""}ok ${slug} html=${html.length} images=${cache.size} faqs=${p.faqs.length}`);
}
console.log(`done: ${n}/${slugs.length}`);
