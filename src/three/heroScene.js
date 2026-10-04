import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createRenderer, environment, blobTexture, disposeAll, easeOutCubic, renderScene, visibilityGate } from './helpers.js';

const BRAND = 0x31594b;
const COPPER = 0xb4764f;

function signTexture(name) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const draw = () => {
    const g = c.getContext('2d');
    g.fillStyle = '#fbf7ef';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#31594b';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '600 130px Fraunces, Georgia, serif';
    g.fillText(name, 512, 125);
    g.fillStyle = '#b4764f';
    g.fillRect(412, 205, 200, 5);
    g.font = '600 40px "Plus Jakarta Sans", system-ui, sans-serif';
    g.fillText('MANAGED PG HOMES', 512, 250);
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  return tex;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function createHeroScene(mount, { reduced = false, name = 'KERALA PG', onError } = {}) {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const renderer = createRenderer(mount, { coarse, onError });
  const scene = new THREE.Scene();
  const envTex = coarse ? null : environment(renderer, scene, RoomEnvironment, 0.55);

  const fov = 32;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

  /* ---------- lights ---------- */
  const key = new THREE.DirectionalLight(0xfff1dc, 2.3);
  key.position.set(6, 9, 5);
  key.castShadow = !coarse;
  key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 4;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xdfeaf2, 0xd9c7ab, 0.55));
  const rim = new THREE.DirectionalLight(0xe0a57a, 1.1);
  rim.position.set(-6, 3, -5);
  scene.add(rim);

  /* ---------- materials ---------- */
  const white = new THREE.MeshStandardMaterial({ color: 0xf4eee3, roughness: 0.85 });
  const green = new THREE.MeshStandardMaterial({ color: BRAND, roughness: 0.45, metalness: 0.15 });
  const copper = new THREE.MeshStandardMaterial({ color: COPPER, roughness: 0.32, metalness: 0.85 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x8fb6c4, roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.7
  });
  const lit = new THREE.MeshStandardMaterial({
    color: 0xffe2b0, emissive: 0xffc46b, emissiveIntensity: 0.9, roughness: 0.4
  });
  const slate = new THREE.MeshStandardMaterial({ color: 0x1f3a5a, roughness: 0.25, metalness: 0.6 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xe9ece9, roughness: 0.35, metalness: 0.6 });

  const box = (w, h, d, mat, x, y, z, parent) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  /* ---------- stage: plinth + lawn + building ---------- */
  const stage = new THREE.Group();
  scene.add(stage);

  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(4.6, 4.7, 0.3, 80),
    new THREE.MeshStandardMaterial({ color: 0xf1e9db, roughness: 0.55 })
  );
  plinth.position.y = -0.15;
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  stage.add(plinth);

  const ring = new THREE.Mesh(new THREE.CylinderGeometry(4.72, 4.72, 0.05, 80), copper);
  ring.position.y = -0.2;
  stage.add(ring);

  const lawn = new THREE.Mesh(
    new THREE.CylinderGeometry(4.35, 4.35, 0.06, 80),
    new THREE.MeshStandardMaterial({ color: 0x5a8868, roughness: 0.95 })
  );
  lawn.position.y = 0.03;
  lawn.receiveShadow = true;
  stage.add(lawn);

  const building = new THREE.Group();
  building.position.y = 0.06;
  stage.add(building);

  // main block + tower
  box(3.6, 3.5, 2.5, white, -0.4, 1.75, 0, building);
  box(1.2, 4.3, 1.7, green, 1.95, 2.15, 0.2, building);
  box(1.4, 0.1, 1.9, copper, 1.95, 4.35, 0.2, building);
  box(3.8, 0.12, 2.7, copper, -0.4, 3.56, 0, building);

  // tower slit windows
  [1.72, 2.18].forEach((x) => box(0.12, 3.2, 0.03, lit, x, 2.2, 1.065, building));

  // windows + balconies on the front face
  const cols = [-1.6, -0.4, 0.8];
  const rows = [0.65, 1.8, 2.95];
  rows.forEach((y, r) => {
    cols.forEach((x, c) => {
      if (r === 0 && c === 1) return; // entrance
      box(0.82, 0.82, 0.05, copper, x, y, 1.26, building);
      const isLit = (r * 3 + c) % 4 === 1 || (r + c) % 5 === 0;
      box(0.68, 0.68, 0.06, isLit ? lit : glass, x, y, 1.275, building);
      if (r > 0) {
        box(0.92, 0.06, 0.38, white, x, y - 0.46, 1.44, building);
        box(0.92, 0.3, 0.02, glass, x, y - 0.28, 1.62, building);
      }
    });
  });

  // entrance
  box(0.78, 1.0, 0.05, glass, -0.4, 0.5, 1.265, building);
  box(0.9, 0.06, 0.62, copper, -0.4, 1.14, 1.56, building);
  [-0.82, 0.02].forEach((x) => box(0.04, 1.12, 0.04, copper, x, 0.56, 1.84, building));
  box(0.86, 0.02, 0.5, lit, -0.4, 1.1, 1.56, building);

  // rooftop details
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.55, 32), steel);
  tank.position.set(-1.4, 3.97, -0.3);
  tank.castShadow = true;
  building.add(tank);
  [0.1, 0.8].forEach((x) => {
    const panel = box(0.62, 0.04, 0.95, slate, x, 3.82, -0.3, building);
    panel.rotation.x = -0.45;
  });

  // path to the door
  box(0.9, 0.015, 3.1, new THREE.MeshStandardMaterial({ color: 0xe9dcc6, roughness: 0.9 }), -0.4, 0.01, 2.8, building);

  // sign board on the lawn
  const sign = new THREE.Group();
  sign.position.set(-1.9, 0, 3.0);
  sign.rotation.y = 0.12;
  box(1.9, 0.62, 0.06, copper, 0, 0.62, 0, sign);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.52),
    new THREE.MeshStandardMaterial({ map: signTexture(name), roughness: 0.7 })
  );
  face.position.set(0, 0.62, 0.035);
  sign.add(face);
  [-0.75, 0.75].forEach((x) => box(0.06, 0.34, 0.06, copper, x, 0.17, 0, sign));
  building.add(sign);

  // trees
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5236, roughness: 0.9 });
  const leafMats = [0x4f8a63, 0x5c9a6f, 0x468059].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true })
  );
  const trees = [];
  [
    [-3.2, 1.2, 1.0], [3.3, 1.0, 1.1], [2.6, 2.6, 0.9], [-3.3, 2.0, 0.85],
    [0.9, 3.3, 0.8], [-2.8, -2.2, 1.0], [2.6, -2.4, 1.05], [0.2, -3.0, 0.9]
  ].forEach(([x, z, s], i) => {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    t.scale.setScalar(s);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.55, 8), trunkMat);
    trunk.position.y = 0.27;
    trunk.castShadow = true;
    t.add(trunk);
    const c1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), leafMats[i % 3]);
    c1.position.y = 0.85;
    c1.scale.y = 1.15;
    c1.castShadow = true;
    t.add(c1);
    const c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), leafMats[(i + 1) % 3]);
    c2.position.set(0.05, 1.28, 0);
    c2.castShadow = true;
    t.add(c2);
    t.userData.phase = i * 1.3;
    building.add(t);
    trees.push(t);
  });

  // floating contact shadow (does not rotate)
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 11),
    new THREE.MeshBasicMaterial({ map: blobTexture(0.38), transparent: true, depthWrite: false })
  );
  blob.rotation.x = -Math.PI / 2;
  scene.add(blob);

  // drifting particles
  const COUNT = coarse ? 45 : 90;
  const pos = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 1] = Math.random() * 8 - 1;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    seed[i] = Math.random() * 6.28;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.11, map: dotTexture(), color: COPPER, transparent: true, opacity: 0.6,
    depthWrite: false, sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ---------- layout ---------- */
  const view = { dist: 17, camBaseY: 3.4, lookY: 1.9, stageX: 0, stageY: 0, stageS: 1 };
  const tanHalf = Math.tan((fov * Math.PI) / 360);

  function layout() {
    const w = Math.max(mount.clientWidth, 1);
    const h = Math.max(mount.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const aspect = w / h;

    if (w <= 900) {
      // stacked: building sits low, below the text
      view.dist = Math.max(15, 9.8 / (aspect * 2 * tanHalf));
      const visH = 2 * tanHalf * view.dist;
      view.stageX = 0;
      view.stageS = w <= 640 ? 1.12 : 0.95;
      view.stageY = -visH * (w <= 640 ? 0.25 : 0.3);
    } else {
      view.dist = 14.5;
      const visW = 2 * tanHalf * view.dist * aspect;
      view.stageS = Math.min(1, (0.52 * visW) / 10.4);
      view.stageX = visW * 0.215;
      view.stageY = -0.2;
    }
    stage.scale.setScalar(view.stageS);
    particles.position.set(view.stageX, view.stageY, 0);
    blob.scale.setScalar(view.stageS);
    dirty = true;
  }

  /* ---------- interaction ---------- */
  let yaw = -0.55;
  let vel = 0;
  let dragging = false;
  let lastX = 0;
  let px = 0;
  let py = 0;
  let tpx = 0;
  let tpy = 0;
  let dirty = true;
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';

  const onDown = (e) => {
    dragging = true;
    lastX = e.clientX;
    vel = 0;
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    yaw += dx * 0.008;
    vel = dx * 0.008 * 60;
    dirty = true;
  };
  const onUp = () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onWinMove = (e) => {
    tpx = (e.clientX / window.innerWidth - 0.5) * 2;
    tpy = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (finePointer && !reduced) window.addEventListener('pointermove', onWinMove, { passive: true });

  /* ---------- loop ---------- */
  const ro = new ResizeObserver(layout);
  ro.observe(mount);
  layout();

  const clock = new THREE.Clock(false);
  let intro = reduced ? 1 : 0;
  let running = false;
  let t = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;

    if (intro < 1) intro = Math.min(1, intro + dt / 1.8);
    const ease = easeOutCubic(intro);

    if (!dragging) {
      yaw += (vel + (reduced ? 0 : 0.14)) * dt;
      vel *= Math.exp(-3 * dt);
    }
    if (Math.abs(vel) < 0.001) vel = 0;

    px += (tpx - px) * (1 - Math.exp(-4 * dt));
    py += (tpy - py) * (1 - Math.exp(-4 * dt));

    const bob = reduced ? 0 : Math.sin(t * 0.9) * 0.08;
    stage.rotation.y = yaw;
    stage.position.set(view.stageX, view.stageY + bob, 0);
    blob.position.set(view.stageX, view.stageY - 0.55, 0);
    blob.material.opacity = 1 - bob * 1.2;

    if (!reduced) {
      trees.forEach((tr) => {
        tr.rotation.z = Math.sin(t * 1.3 + tr.userData.phase) * 0.015;
      });
      const a = pGeo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        a.array[i * 3 + 1] += dt * 0.12;
        a.array[i * 3] += Math.sin(t * 0.4 + seed[i]) * dt * 0.05;
        if (a.array[i * 3 + 1] > 7) a.array[i * 3 + 1] = -1;
      }
      a.needsUpdate = true;
    }

    const d = view.dist * (1 + (1 - ease) * 0.28);
    camera.position.set(px * 0.7, view.camBaseY + view.stageY * 0.1 - py * 0.35, d);
    camera.lookAt(px * 0.2, view.lookY + view.stageY * 0.45, 0);

    const moving = intro < 1 || vel !== 0 || dragging;
    if (reduced && !dirty && !moving) return;
    dirty = false;
    if (!renderScene(renderer, scene, camera, onError)) return;
    if (!mount.classList.contains('is-ready')) mount.classList.add('is-ready');
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) {
      clock.start();
      renderer.setAnimationLoop(frame);
    } else {
      clock.stop();
      renderer.setAnimationLoop(null);
    }
  }
  frame();
  const stopGate = visibilityGate(mount, setRunning);

  return () => {
    stopGate();
    ro.disconnect();
    window.removeEventListener('pointermove', onWinMove);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
    setRunning(false);
    disposeAll(scene, renderer, [envTex]);
  };
}
