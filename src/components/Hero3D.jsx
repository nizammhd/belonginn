import { useEffect, useRef, useState } from 'react';
import ModelFallback from './ModelFallback';

export default function Hero3D({ name = 'Kerala PG' }) {
  const mountRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let cleanup = () => {};

    import('../three/heroScene')
      .then(({ createHeroScene }) => {
        if (disposed) return;
        try {
          cleanup = createHeroScene(mount, {
            reduced,
            name: name.toUpperCase(),
            onError: (error) => {
              console.error('The 3D hero scene stopped rendering.', error);
              setFallback(true);
            }
          });
        } catch (error) {
          console.error('Unable to initialize the 3D hero scene.', error);
          setFallback(true);
        }
      })
      .catch((error) => {
        console.error('Unable to load the 3D hero scene.', error);
        setFallback(true);
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [name]);

  if (fallback) return <ModelFallback type="building" className="hero-model-fallback" />;
  return <div className="hero3d" ref={mountRef} aria-hidden="true" />;
}
