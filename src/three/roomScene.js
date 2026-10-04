import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createRenderer, environment, blobTexture, disposeAll, easeOutBack, renderScene, visibilityGate } from './helpers.js';

const BRAND = 0x31594b;
const COPPER = 0xb4764f;

function plankTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  const planks = 14;
  const w = c.width / planks;
  for (let i = 0; i < planks; i++) {
    let y = -Math.random() * 300;
    while (y < c.height) {
      const len = 280 + Math.random() * 360;
      const l = 50 + Math.random() * 8;
      g.fillStyle = `hsl(28, 42%, ${l}%)`;
      g.fillRect(i * w, y, w, len);
      g.strokeStyle = 'rgba(80,50,25,.35)';
      g.lineWidth = 2;
      g.strokeRect(i * w, y, w, len);
      // grain
      g.strokeStyle = 'rgba(110,70,35,.12)';
      g.lineWidth = 1;
      for (let k = 0; k < 6; k++) {
        const gx = i * w + 6 + Math.random() * (w - 12);
        g.beginPath();
        g.moveTo(gx, y + 4);
        g.lineTo(gx + (Math.random() - 0.5) * 6, y + len - 4);
        g.stroke();
      }
      y += len;
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function createRoomScene(mount, { reduced = false, sharing = 2, onInteract, onError } = {}) {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const renderer = createRenderer(mount, { coarse, onError });
  const scene = new THREE.Scene();
  const envTex = coarse ? null : environment(renderer, scene, RoomEnvironment, 0.5);

  const fov = 34;
  const tanHalf = Math.tan((fov * Math.PI) / 360);
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  const target = new THREE.Vector3(0, 1.0, 0.2);

  /* ---------- lights ---------- */
  const key = new THREE.DirectionalLight(0xfff0d8, 1.9);
  key.position.set(5, 9, 7);
  key.castShadow = !coarse;
  key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 5;
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xe6eef5, 0xd9c7ab, 0.6));

  /* ---------- materials ---------- */
  const M = (color, rough = 0.8, metal = 0, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  const wallA = M(0xf3eee4, 0.92);
  const wallB = M(0xece5d8, 0.92);
  const trim = M(0xffffff, 0.7);
  const green = M(BRAND, 0.55, 0.1);
  const copper = M(COPPER, 0.32, 0.85);
  const wood = M(0x8b5e3c, 0.6);
  const woodLight = M(0xc99d6f, 0.55);
  const fabric = M(0xf7f3ea, 0.95);
  const dark = M(0x2a2f2d, 0.35, 0.6);
  const silver = M(0xd9dcdc, 0.3, 0.8);

  const add = (geo, mat, x, y, z, parent, shadow = true) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const R = (w, h, d, r = 0.04) => new RoundedBoxGeometry(w, h, d, 4, r);

  const room = new THREE.Group();
  scene.add(room);

  /* ---------- shell ---------- */
  add(B(7.6, 0.25, 6.2), M(0xe8dfd0, 0.8), 0, -0.125, 0, room);
  const floorTex = plankTexture();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 6), M(0xffffff, 0.55, 0, { map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  floor.receiveShadow = true;
  room.add(floor);

  add(B(7.6, 3.2, 0.2), wallA, -0.1, 1.6, -3.1, room);
  add(B(0.2, 3.2, 6.2), wallB, -3.8, 1.6, 0, room);
  add(B(7.4, 0.14, 0.04), trim, 0, 0.07, -2.98, room);
  add(B(0.04, 0.14, 6), trim, -3.68, 0.07, 0, room);

  // accent headboard wall
  add(B(4.6, 2.2, 0.05), green, -1.4, 1.1, -2.975, room);
  add(B(4.6, 0.05, 0.07), copper, -1.4, 2.2, -2.965, room);

  // window with curtains above the desk
  add(B(1.75, 1.25, 0.1), trim, 2.4, 1.75, -2.96, room);
  add(B(1.55, 1.05, 0.04), M(0xbfdde8, 0.2, 0, { emissive: 0xdff0f7, emissiveIntensity: 0.9 }), 2.4, 1.75, -2.9, room, false);
  add(B(0.04, 1.05, 0.05), trim, 2.4, 1.75, -2.88, room, false);
  add(B(1.55, 0.04, 0.05), trim, 2.4, 1.75, -2.88, room, false);
  [1.38, 3.42].forEach((x) => add(R(0.34, 1.6, 0.1, 0.04), M(0xe8d7c0, 0.95), x, 1.62, -2.88, room));

  /* ---------- furniture ---------- */
  const bedX = [-2.5, -1.1, 0.3];
  const beds = bedX.map((x, i) => {
    const g = new THREE.Group();
    g.position.set(x, 0, -1.9);
    g.rotation.y = 0;
    add(R(1.0, 0.26, 2.0, 0.03), wood, 0, 0.18, 0, g);
    [[-0.44, -0.94], [0.44, -0.94], [-0.44, 0.94], [0.44, 0.94]].forEach(([lx, lz]) =>
      add(B(0.07, 0.1, 0.07), wood, lx, 0.05, lz, g));
    add(R(0.94, 0.2, 1.9, 0.07), fabric, 0, 0.4, 0, g);
    add(R(0.98, 0.1, 1.15, 0.045), i === 1 ? M(COPPER, 0.9) : M(0x3d6b5a, 0.9), 0, 0.53, 0.4, g);
    add(R(0.98, 0.06, 0.2, 0.025), M(0xf0e4d0, 0.9), 0, 0.57, -0.17, g);
    add(R(0.62, 0.14, 0.36, 0.06), fabric, 0, 0.57, -0.72, g);
    add(R(1.04, 0.85, 0.08, 0.02), wood, 0, 0.62, -1.04, g);
    room.add(g);
    return g;
  });

  // desk (always present)
  add(R(2.4, 0.06, 0.8, 0.02), woodLight, 2.4, 0.78, -2.6, room);
  [[1.28, -2.95], [3.52, -2.95], [1.28, -2.28], [3.52, -2.28]].forEach(([x, z]) =>
    add(B(0.05, 0.76, 0.05), dark, x, 0.38, z, room));
  add(R(0.5, 0.5, 0.7, 0.02), wood, 3.3, 0.28, -2.6, room);
  add(B(0.3, 0.02, 0.05), copper, 3.3, 0.38, -2.24, room, false);

  // seats: chair + laptop per slot
  const seatX = [1.65, 2.4, 3.15];
  const seats = seatX.map((x, i) => {
    const g = new THREE.Group();
    g.position.set(x, 0, 0);
    // laptop on desk
    const lap = new THREE.Group();
    lap.position.set(0, 0.81, -2.5);
    add(R(0.34, 0.02, 0.23, 0.008), silver, 0, 0.01, 0, lap);
    const scr = new THREE.Group();
    scr.position.set(0, 0.02, -0.11);
    scr.rotation.x = -0.28;
    add(R(0.34, 0.22, 0.012, 0.005), silver, 0, 0.11, 0, scr);
    add(new THREE.PlaneGeometry(0.31, 0.19), M(0x9fd0e0, 0.3, 0, { emissive: 0x7fc4de, emissiveIntensity: 0.55 }), 0, 0.11, 0.0075, scr, false);
    lap.add(scr);
    g.add(lap);
    // chair
    const ch = new THREE.Group();
    ch.position.set(0, 0, -1.75);
    ch.rotation.y = (i - 1) * 0.14;
    add(R(0.45, 0.07, 0.45, 0.03), green, 0, 0.47, 0, ch);
    add(R(0.45, 0.5, 0.06, 0.03), green, 0, 0.78, 0.2, ch);
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), dark, 0, 0.24, 0, ch);
    add(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 24), dark, 0, 0.02, 0, ch);
    g.add(ch);
    room.add(g);
    return g;
  });

  // wardrobe on left wall
  add(R(0.62, 2.3, 1.3, 0.02), M(0xb98a5e, 0.6), -3.37, 1.15, 1.0, room);
  [0.68, 1.32].forEach((z) => add(R(0.03, 2.1, 0.62, 0.012), M(0xcfae86, 0.55), -3.04, 1.15, z, room));
  [0.94, 1.06].forEach((z) => add(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 10), copper, -3.015, 1.1, z, room, false));

  // wall shelf with books + plant
  add(R(0.3, 0.05, 1.1, 0.015), wood, -3.55, 1.65, -0.1, room);
  [[0xb4764f, 0.34], [0x31594b, 0.3], [0xe6d6bd, 0.26], [0x7a5236, 0.32]].forEach(([c, h], i) =>
    add(B(0.18, h, 0.06), M(c, 0.8), -3.55, 1.675 + h / 2, -0.5 + i * 0.075, room));
  add(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 16), M(0xe6d6bd, 0.6), -3.55, 1.74, 0.25, room);
  add(new THREE.IcosahedronGeometry(0.11, 1), M(0x4f8a63, 0.85, 0, { flatShading: true }), -3.55, 1.89, 0.25, room);

  // rug
  add(R(2.8, 0.03, 1.9, 0.012), M(0xc08a62, 0.95), -0.2, 0.02, 0.9, room, false);
  add(R(2.5, 0.036, 1.6, 0.012), M(0xf0e4d0, 0.95), -0.2, 0.022, 0.9, room, false);

  // floor lamp (warm light)
  const lamp = new THREE.Group();
  lamp.position.set(3.3, 0, 0.2);
  add(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 24), dark, 0, 0.015, 0, lamp);
  add(new THREE.CylinderGeometry(0.015, 0.015, 1.45, 10), dark, 0, 0.74, 0, lamp);
  add(
    new THREE.CylinderGeometry(0.2, 0.28, 0.32, 28, 1, true),
    M(0xf5e6c8, 0.8, 0, { emissive: 0xffc27a, emissiveIntensity: 0.6, side: THREE.DoubleSide }),
    0, 1.52, 0, lamp, false
  );
  const lampLight = new THREE.PointLight(0xffc98a, 7, 6, 2);
  lampLight.position.set(0, 1.5, 0);
  lamp.add(lampLight);
  room.add(lamp);

  // plant in the corner
  const plant = new THREE.Group();
  plant.position.set(-3.1, 0, 2.5);
  add(new THREE.CylinderGeometry(0.26, 0.2, 0.4, 20), copper, 0, 0.2, 0, plant);
  const leaf = M(0x4f8a63, 0.85, 0, { flatShading: true });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const l = add(new THREE.IcosahedronGeometry(0.24, 1), leaf, Math.cos(a) * 0.17, 0.72 + (i % 2) * 0.2, Math.sin(a) * 0.17, plant);
    l.scale.set(0.8, 1.5, 0.8);
  }
  room.add(plant);

  // floating contact shadow
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 11),
    new THREE.MeshBasicMaterial({ map: blobTexture(0.32), transparent: true, depthWrite: false })
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = -0.6;
  scene.add(blob);

  /* ---------- sharing slots ---------- */
  const seatMap = { 1: [1], 2: [0, 2], 3: [0, 1, 2] };
  const slots = [];
  beds.forEach((g, i) => slots.push({ g, p: 0, target: 0, bed: i }));
  seats.forEach((g, i) => slots.push({ g, p: 0, target: 0, seat: i }));

  function setSharing(n, instant = false) {
    slots.forEach((s) => {
      s.target = s.bed !== undefined ? (s.bed < n ? 1 : 0) : (seatMap[n].includes(s.seat) ? 1 : 0);
      if (instant) s.p = s.target;
    });
    dirty = true;
  }

  /* ---------- camera orbit ---------- */
  let theta = 0.55;
  let phi = 1.1;
  let thetaT = 0.55;
  let phiT = 1.1;
  let dist = 13;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idleAt = performance.now();
  let swayAmp = 0;
  let dirty = true;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';
  const onDown = (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.style.cursor = 'grabbing';
    canvas.setPointerCapture(e.pointerId);
    if (onInteract) onInteract();
  };
  const onMove = (e) => {
    if (!dragging) return;
    thetaT = clamp(thetaT - (e.clientX - lastX) * 0.006, -0.2, 0.95);
    phiT = clamp(phiT - (e.clientY - lastY) * 0.004, 0.85, 1.3);
    lastX = e.clientX;
    lastY = e.clientY;
    idleAt = performance.now();
    dirty = true;
  };
  const onUp = () => {
    dragging = false;
    idleAt = performance.now();
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  function rotateBy(d) {
    thetaT = clamp(thetaT + d, -0.2, 0.95);
    idleAt = performance.now();
    dirty = true;
    if (onInteract) onInteract();
  }

  /* ---------- resize + loop ---------- */
  function layout() {
    const w = Math.max(mount.clientWidth, 1);
    const h = Math.max(mount.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Keep the room at a useful size on narrow portrait screens.
    // The old aspect-ratio formula pushed the camera too far away on phones.
    if (w <= 480) {
      dist = 13;
    } else if (w <= 900) {
      dist = 12;
    } else {
      dist = 11;
    }

    dirty = true;
  }
  const ro = new ResizeObserver(layout);
  ro.observe(mount);
  layout();
  setSharing(sharing, true);

  const clock = new THREE.Clock(false);
  let t = 0;
  let running = false;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    t += dt;

    let animating = false;
    slots.forEach((s) => {
      const dir = s.target - s.p;
      if (dir !== 0) {
        animating = true;
        const step = (reduced ? 1 : dt * 2.4) * Math.sign(dir);
        s.p = Math.abs(dir) <= Math.abs(step) ? s.target : s.p + step;
      }
      const sc = s.p <= 0 ? 0.0001 : easeOutBack(s.p);
      s.g.visible = s.p > 0;
      s.g.scale.setScalar(Math.max(sc, 0.0001));
    });

    const idle = !dragging && !reduced && performance.now() - idleAt > 2500;
    swayAmp += ((idle ? 1 : 0) - swayAmp) * (1 - Math.exp(-1.5 * dt));
    const k = 1 - Math.exp(-8 * dt);
    theta += (thetaT - theta) * k;
    phi += (phiT - phi) * k;
    const th = theta + Math.sin(t * 0.4) * 0.14 * swayAmp;

    camera.position.set(
      target.x + dist * Math.sin(phi) * Math.sin(th),
      target.y + dist * Math.cos(phi),
      target.z + dist * Math.sin(phi) * Math.cos(th)
    );
    camera.lookAt(target);

    const moving = animating || Math.abs(thetaT - theta) > 5e-4 || Math.abs(phiT - phi) > 5e-4;
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

  return {
    setSharing,
    rotateBy,
    dispose() {
      stopGate();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      setRunning(false);
      disposeAll(scene, renderer, [envTex, floorTex]);
    }
  };
}
