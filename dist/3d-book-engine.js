import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// Configuration
const CONFIG = {
    pageWidth: 5.5,
    pageHeight: 8.5,
    pageThickness: 0.015,
    coverThickness: 0.04, // Subtly thicker hardcover
    segments: 100,
    pageCount: 16,
    animDuration: 1.4,
    maxBend: 1.8
};

// Global Data
let pageData = [];
let stackDepth = 0;

// State
let scene, camera, renderer, raycaster, mouse, controls;
let pages = [];
let spine;
let currentPageIndex = 0;
let isAnimating = false;
let areAssetsLoaded = false;
let isSceneReady = false;

// --------------------------------------------------------------------------------
// 1. ASSET MANAGEMENT - High Res
// --------------------------------------------------------------------------------

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// High Quality Filter
function setupTexture(tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
}

const photoArch = textureLoader.load('assets/photo_arch.png', setupTexture);
const photoNature = textureLoader.load('assets/photo_nature.png', setupTexture);
const photoPortrait = textureLoader.load('assets/photo_portrait.png', setupTexture);
const demoPhoto = textureLoader.load('assets/demo_photo.png', setupTexture);

const pageMaterials = [];
const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xF5F5F0, roughness: 0.9 });
const photos = [demoPhoto, photoArch, photoNature, photoPortrait];

// Procedural Text - Retina Quality
function createTextTexture(index) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 3200;
    const ctx = canvas.getContext('2d');

    // Paper Texture
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grain
    ctx.fillStyle = 'rgba(0,0,0,0.015)';
    for (let i = 0; i < 4000; i++) ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);

    // Text Content
    ctx.fillStyle = '#222';
    ctx.font = 'bold 80px "Inter", serif';
    ctx.fillText(`Chapter ${index + 1}`, 200, 400);

    const lineHeight = 70;
    ctx.fillStyle = '#555';
    for (let i = 0; i < 30; i++) {
        const width = 1600 * (0.9 + Math.random() * 0.1);
        ctx.fillRect(200, 600 + i * lineHeight, width, 30);
    }

    // Page Num
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${index * 2}`, canvas.width / 2, canvas.height - 100);

    const tex = new THREE.CanvasTexture(canvas);
    setupTexture(tex);
    return tex;
}

function createCoverTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; canvas.height = 3200;
    const ctx = canvas.getContext('2d');

    // Background: Use Photo Nature for Front, Arch for Back
    const imgTex = (type === 'front') ? photoNature : photoArch;

    if (imgTex && imgTex.image) {
        // Draw Image Full Bleed (Center Crop)
        const img = imgTex.image;
        if (img.width > 0) {
            const aspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;
            let drawW, drawH, drawX, drawY;
            if (aspect > canvasAspect) { // Wide Image
                drawH = canvas.height;
                drawW = drawH * aspect;
                drawX = (canvas.width - drawW) / 2;
                drawY = 0;
            } else { // Tall Image
                drawW = canvas.width;
                drawH = drawW / aspect;
                drawX = 0;
                drawY = (canvas.height - drawH) / 2;
            }
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }
    } else {
        // Fallback Elegant Gradient
        const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, '#2c3e50');
        grd.addColorStop(1, '#4ca1af');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Vignette / Shadow Overlay
    const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 500, canvas.width / 2, canvas.height / 2, 1800);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text & Typography
    if (type === 'front') {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 220px "Inter", serif';
        ctx.textAlign = 'center';
        ctx.fillText("MY JOURNEY", canvas.width / 2, 800);

        ctx.font = '300 100px "Inter", sans-serif';
        ctx.letterSpacing = "20px";
        ctx.fillText("2026 COLLECTION", canvas.width / 2, 1000);

        // Divider
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(canvas.width / 2 - 200, 1150, 400, 5);
    }

    const tex = new THREE.CanvasTexture(canvas);
    setupTexture(tex);
    return tex;
}

loadingManager.onLoad = () => {
    console.log('3D Engine: Assets Loaded');
    areAssetsLoaded = true;
    generateMaterials();
    checkAndStart();
};

function generateMaterials() {
    for (let i = 0; i < CONFIG.pageCount; i++) {
        let frontMap, backMap;
        const isFirst = (i === 0);
        const isLast = (i === CONFIG.pageCount - 1);

        if (isFirst) {
            // Front Cover (Outer)
            frontMap = createCoverTexture('front');
            // Front Cover (Inner) - Standard Paper
            backMap = createTextTexture(i);
        } else if (isLast) {
            // Back Cover (Inner) - Standard Paper
            frontMap = createTextTexture(i);
            // Back Cover (Outer)
            backMap = createCoverTexture('back');
        } else {
            // Internal Pages
            const usePhoto = (i % 2 === 0);
            const photoTex = photos[i % photos.length];
            if (usePhoto) setupTexture(photoTex);

            frontMap = usePhoto ? photoTex : createTextTexture(i);
            backMap = createTextTexture(i);
        }

        backMap.center.set(0.5, 0.5);
        backMap.rotation = 0;

        // Material differentiating
        const isCover = (isFirst || isLast);

        const matOptions = { map: frontMap };
        const backOptions = { map: backMap };

        let frontMat, backMat;

        if (isCover) {
            // Chromo / Glossy Cover
            const glossParams = {
                roughness: 0.2,
                metalness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            };
            frontMat = new THREE.MeshPhysicalMaterial({ ...matOptions, ...glossParams });
            backMat = new THREE.MeshPhysicalMaterial({ ...backOptions, ...glossParams });
        } else {
            // Matte Paper
            frontMat = new THREE.MeshStandardMaterial({ ...matOptions, roughness: 0.6 });
            backMat = new THREE.MeshStandardMaterial({ ...backOptions, roughness: 0.6 });
        }

        pageMaterials.push({ front: frontMat, back: backMat });
    }
}


function checkAndStart() {
    if (areAssetsLoaded && isSceneReady && pages.length === 0) {
        document.getElementById('loading-text').style.display = 'none';
        buildBook();
    }
}

// --------------------------------------------------------------------------------
// 2. SCENE
// --------------------------------------------------------------------------------

function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 18, 18);
    camera.lookAt(3, 0, 0);

    // Studio Lighting setup to match "Mockup" quality
    // 1. Soft Ambient (Global Illumination sim)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // 2. Key Light (Sun/Window) - Soft Shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.radius = 4; // Soften shadow edges
    scene.add(keyLight);

    // 3. Fill Light (Bounce)
    const fillLight = new THREE.DirectionalLight(0xebe5ce, 0.5);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    // 4. Rim Light (Backlight for separation)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(CONFIG.pageWidth * 0.5, 0, 0);

    // Floor Reflection (Contact Shadow Catcher)
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -CONFIG.pageHeight / 2 - 0.1;
    plane.receiveShadow = true;
    scene.add(plane);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener('mousedown', onClick);
    window.addEventListener('resize', onResize);

    isSceneReady = true;
    checkAndStart();
    animate();
}

// --------------------------------------------------------------------------------
// 3. BUILD - Single Flush Spine
// --------------------------------------------------------------------------------

function buildBook() {
    // 1. Calculate Offsets
    pageData = [];
    let currentZ = 0;
    for (let i = 0; i < CONFIG.pageCount; i++) {
        const isCover = (i === 0 || i === CONFIG.pageCount - 1);
        const thick = isCover ? CONFIG.coverThickness : CONFIG.pageThickness;
        // Place center of page
        // If stack starts at 0 and goes -Z.
        // Page occupies [currentZ, currentZ - thick]. Center: currentZ - thick/2
        const centerZ = currentZ - thick / 2;
        pageData.push({ index: i, z: centerZ, thickness: thick, isCover: isCover });
        currentZ -= thick;
    }
    stackDepth = Math.abs(currentZ);

    // Spine: Straight Box (as requested)
    // We keep the "Flexible" rotation logic.
    // Dimensions: Thin strip. Depth = stackDepth.
    const spineGeo = new THREE.BoxGeometry(0.06, CONFIG.pageHeight, stackDepth);
    const spineMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    spine = new THREE.Mesh(spineGeo, spineMat);

    // Position: Fixed at the "Back" of the closed stack (-stackDepth/2).
    spine.position.set(0, 0, -stackDepth / 2);
    scene.add(spine);

    const geometry = new THREE.BoxGeometry(
        CONFIG.pageWidth,
        CONFIG.pageHeight,
        1, // Base Thickness 1, scaled later
        CONFIG.segments, 1, 1
    );
    // Pivot at 0 (Left Edge)
    geometry.translate(CONFIG.pageWidth / 2, 0, 0);

    for (let i = 0; i < CONFIG.pageCount; i++) {
        const page = createPageMesh(geometry, i);
        pages.push(page);
        scene.add(page);
    }
}

function createPageMesh(geo, index) {
    const data = pageData[index];
    const mats = pageMaterials[index];

    // Covers have Texture on correct side?
    // Index 0 (Front): Face 4 (Front +Z).
    // Index N (Back): Face 5 (Back -Z)?
    // Standard Materials logic applies.

    const edge = edgeMaterial.clone();
    const front = mats.front.clone();
    const back = mats.back.clone();

    // 0:Right, 1:Left, 2:Top, 3:Bottom, 4:Front(+Z), 5:Back(-Z)
    const materials = [edge, edge, edge, edge, front, back];
    materials.forEach(mat => injectShaderLogic(mat, data.isCover));

    const mesh = new THREE.Mesh(geo, materials);

    // Scale Thickness
    mesh.scale.z = data.thickness;

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { index: index };

    mesh.position.z = data.z;
    return mesh;
}

// --------------------------------------------------------------------------------
// 4. SHADER
// --------------------------------------------------------------------------------

function injectShaderLogic(material, isCover) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uBend = { value: 0 };
        material.userData.shader = shader;

        shader.vertexShader = `
            uniform float uBend;
            ${shader.vertexShader}
        `;

        let transformCode = `
            #include <begin_vertex>
            float x = position.x;
            
            // 1. Dynamic Page Bend
            float factor = 0.15;
            float zConfig = pow(x * factor, 2.0) * uBend;
            transformed.z += zConfig;
        `;

        if (isCover) {
            // 2. Static Hinge/Groove near Spine
            // Gaussian dip at X ~ 0.5
            transformCode += `
            float hingeCenter = 0.5; 
            float hingeDepth = 0.06;
            float hingeWidth = 15.0;
            float hinge = -hingeDepth * exp(-pow((x - hingeCenter) * hingeWidth, 2.0));
            transformed.z += hinge;
            `;
        }

        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', transformCode);
    };
}

// --------------------------------------------------------------------------------
// 5. ANIMATION
// --------------------------------------------------------------------------------

let isDragging = false;
window.addEventListener('mousedown', () => isDragging = false);
window.addEventListener('mousemove', () => isDragging = true);

function onClick(event) {
    if (isAnimating || isDragging) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const candidates = [];
    if (currentPageIndex < pages.length) candidates.push(pages[currentPageIndex]);
    if (currentPageIndex > 0) candidates.push(pages[currentPageIndex - 1]);

    const intersects = raycaster.intersectObjects(candidates);
    if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const idx = mesh.userData.index;

        if (idx === currentPageIndex) flipForward(mesh);
        else if (idx === currentPageIndex - 1) flipBackward(mesh);
    }
}

function flipForward(mesh) {
    isAnimating = true;
    currentPageIndex++;
    mesh.renderOrder = 1000;

    const targetZ = -mesh.userData.index * CONFIG.pageThickness;
    const state = { t: 0 };

    const maxRot = Math.PI / 4;
    const progress = currentPageIndex / CONFIG.pageCount;
    const targetSpineRot = -Math.sin(progress * Math.PI * 2) * maxRot;

    gsap.to(spine.rotation, {
        y: targetSpineRot,
        duration: CONFIG.animDuration,
        ease: "power2.inOut",
        onUpdate: () => updatePageRoots(spine.rotation.y)
    });



    gsap.to(state, {
        t: 1, duration: CONFIG.animDuration, ease: "power2.inOut",
        onUpdate: () => {
            const angle = -Math.PI * state.t;
            mesh.rotation.y = angle;

            const bend = Math.sin(state.t * Math.PI) * CONFIG.maxBend;
            updateShader(mesh, bend);

            // Position X/Z handled by updatePageRoots

        },
        onComplete: () => {
            isAnimating = false;
            isAnimating = false;
            mesh.renderOrder = mesh.userData.index;
        }
    });
}

function flipBackward(mesh) {
    isAnimating = true;
    currentPageIndex--;
    mesh.renderOrder = 1000;

    const targetZ = -mesh.userData.index * CONFIG.pageThickness;
    const state = { t: 0 };

    const maxRot = Math.PI / 4;
    const progress = currentPageIndex / CONFIG.pageCount;
    const targetSpineRot = -Math.sin(progress * Math.PI * 2) * maxRot;

    gsap.to(spine.rotation, {
        y: targetSpineRot,
        duration: CONFIG.animDuration,
        ease: "power2.inOut",
        onUpdate: () => updatePageRoots(spine.rotation.y)
    });



    gsap.to(state, {
        t: 1, duration: CONFIG.animDuration, ease: "power2.inOut",
        onUpdate: () => {
            const angle = -Math.PI + (Math.PI * state.t);
            mesh.rotation.y = angle;

            const bend = Math.sin(state.t * Math.PI) * (-CONFIG.maxBend);
            updateShader(mesh, bend);

            // Position X/Z handled by updatePageRoots

        },
        onComplete: () => {
            isAnimating = false;
            isAnimating = false;
            mesh.renderOrder = (CONFIG.pageCount - mesh.userData.index);
        }
    });
}

function updateShader(mesh, val) {
    if (!mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => {
        if (m.userData.shader && m.userData.shader.uniforms) {
            m.userData.shader.uniforms.uBend.value = val;
        }
    });
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updatePageRoots(angle) {
    // Spine Center is half of stack depth
    const spineCenterZ = -stackDepth / 2;

    pages.forEach(page => {
        const index = page.userData.index;
        const data = pageData[index];

        // Original Local Z (Center of Page)
        const originalZ = data.z;

        // Relative to Spine Center
        const dz = originalZ - spineCenterZ;

        // Rotated 
        const dx = dz * Math.sin(angle);
        const newDz = dz * Math.cos(angle);

        page.position.x = dx;
        page.position.z = spineCenterZ + newDz;
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
}

init();
