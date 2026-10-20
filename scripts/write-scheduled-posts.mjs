// One-off: write approved scheduled posts (from a repo secret, never committed) into Firestore.
// Prints only slugs and field counts to the log - never post content (repo is public).
// Usage: BUNDLE_FILE=<path> GOOGLE_APPLICATION_CREDENTIALS=<sa.json> node scripts/write-scheduled-posts.mjs
//        COLL=blogPosts (default) FORCE=1 to overwrite an existing slug.
import { readFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const COLL = process.env.COLL || "blogPosts";
const FORCE = process.env.FORCE === "1";
const bundle = JSON.parse(readFileSync(process.env.BUNDLE_FILE, "utf8"));
if (!Array.isArray(bundle) || !bundle.length) throw new Error("bundle must be a non-empty array");

const REQUIRED = ["slug", "title", "description", "metaTitle", "metaDescription", "firstPublishedAt", "contentHtml"];
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const now = Date.now();
for (const p of bundle) {
  for (const k of REQUIRED) if (!p[k]) throw new Error(`${p.slug || "?"}: missing ${k}`);
  if (!SLUG_RE.test(p.slug)) throw new Error(`bad slug: ${p.slug}`);
  if (p.status !== "published") throw new Error(`${p.slug}: status must be published`);
  if (!Number.isFinite(Date.parse(p.firstPublishedAt))) throw new Error(`${p.slug}: bad firstPublishedAt`);
  if (!Array.isArray(p.faqs)) throw new Error(`${p.slug}: faqs must be an array`);
}

const admin = require("../functions/node_modules/firebase-admin");
if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

for (const p of bundle) {
  const ref = db.collection(COLL).doc(p.slug);
  const existing = await ref.get();
  if (existing.exists && !FORCE) throw new Error(`${p.slug}: already exists in ${COLL}, refusing to overwrite`);
  await ref.set(p);
  const check = await ref.get();
  const d = check.data();
  const words = String(d.contentHtml || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const live = Date.parse(d.firstPublishedAt) <= now;
  console.log(JSON.stringify({
    slug: d.slug, status: d.status, firstPublishedAt: d.firstPublishedAt,
    words, faqs: d.faqs.length, title_ok: d.title === p.title,
    content_ok: d.contentHtml === p.contentHtml,
    served_now: live ? "YES (date already passed)" : "no (scheduled, hidden until date)",
  }));
}
console.log("DONE", COLL, bundle.length, "posts");
