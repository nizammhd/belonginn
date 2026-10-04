import * as THREE from 'three';

export function createRenderer(mount, { coarse = false, onError } = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: !coarse,
    alpha: true,
    powerPreference: coarse ? 'low-power' : 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  const el = renderer.domElement;
  el.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;outline:none;';
  el.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    renderer.setAnimationLoop(null);
    onError?.(new Error('The browser lost the WebGL context.'));
  });
  mount.appendChild(el);
  return renderer;
}

export function renderScene(renderer, scene, camera, onError) {
  try {
    renderer.render(scene, camera);
    return true;
  } catch (error) {
    renderer.setAnimationLoop(null);
    onError?.(error);
    return false;
  }
}

export function environment(renderer, scene, RoomEnvironment, intensity) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  return tex;
}

export function blobTexture(alpha = 0.5) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(23,35,31,${alpha})`);
  grad.addColorStop(0.55, `rgba(23,35,31,${alpha * 0.4})`);
  grad.addColorStop(1, 'rgba(23,35,31,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function disposeAll(scene, renderer, extras = []) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    const mats = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
    mats.forEach((m) => {
      if (m.map) m.map.dispose();
      m.dispose();
    });
  });
  extras.forEach((e) => e && e.dispose && e.dispose());
  renderer.setAnimationLoop(null);
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
}

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// pause rendering when off-screen or tab hidden
export function visibilityGate(el, onChange) {
  let inView = true;
  const emit = () => onChange(inView && !document.hidden);
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    emit();
  }, { threshold: 0.01 });
  io.observe(el);
  document.addEventListener('visibilitychange', emit);
  return () => {
    io.disconnect();
    document.removeEventListener('visibilitychange', emit);
  };
}
