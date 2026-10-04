import { useEffect, useRef } from 'react';

export default function AmbientScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!scene || reducedMotion.matches || !finePointer.matches) return undefined;

    let frame = 0;
    const updateScene = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        const pointerX = Math.max(-1, Math.min(1, x));
        const pointerY = Math.max(-1, Math.min(1, y));
        scene.style.setProperty('--room-x', `${pointerX * -10}px`);
        scene.style.setProperty('--room-y', `${pointerY * -7}px`);
        scene.style.setProperty('--room-rotate-x', `${pointerY * -3}deg`);
        scene.style.setProperty('--room-rotate-y', `${20 + pointerX * 5}deg`);
        scene.style.setProperty('--panel-one-x', `${pointerX * 15}px`);
        scene.style.setProperty('--panel-one-y', `${pointerY * 9}px`);
        scene.style.setProperty('--panel-two-x', `${pointerX * -11}px`);
        scene.style.setProperty('--panel-two-y', `${pointerY * 13}px`);
      });
    };
    const resetScene = () => {
      scene.style.setProperty('--room-x', '0px');
      scene.style.setProperty('--room-y', '0px');
      scene.style.setProperty('--room-rotate-x', '0deg');
      scene.style.setProperty('--room-rotate-y', '20deg');
      scene.style.setProperty('--panel-one-x', '0px');
      scene.style.setProperty('--panel-one-y', '0px');
      scene.style.setProperty('--panel-two-x', '0px');
      scene.style.setProperty('--panel-two-y', '0px');
    };

    window.addEventListener('pointermove', updateScene, { passive: true });
    window.addEventListener('blur', resetScene);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updateScene);
      window.removeEventListener('blur', resetScene);
    };
  }, []);

  return (
    <div className="ambient-scene" ref={sceneRef} aria-hidden="true">
      <div className="ambient-scene-depth">
        <div className="ambient-room">
          <div className="ambient-room-face">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ambient-room-side" />
          <div className="ambient-room-roof" />
        </div>
        <div className="ambient-panel ambient-panel-one" />
        <div className="ambient-panel ambient-panel-two" />
      </div>
    </div>
  );
}
