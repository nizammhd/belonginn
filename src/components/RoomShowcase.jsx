import { useEffect, useRef, useState } from 'react';
import { Icons, waLink } from '../data/icons';
import ModelFallback from './ModelFallback';

const OPTIONS = [
  { n: 1, label: 'Single', text: 'One bed, a wardrobe and a study desk, just for you.' },
  { n: 2, label: '2 sharing', text: 'Two beds with a shared study desk and a wardrobe.' },
  { n: 3, label: '3 sharing', text: 'Three beds with a shared study desk and seating.' }
];

const ITEMS = ['Bed & mattress', 'Wooden wardrobe', 'Study desk & chair', 'Window light'];

export default function RoomShowcase({ company }) {
  const stageRef = useRef(null);
  const apiRef = useRef(null);
  const sharingRef = useRef(2);
  const [sharing, setSharing] = useState(2);
  const [hint, setHint] = useState(true);
  const [failed, setFailed] = useState(false);

  sharingRef.current = sharing;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      import('../three/roomScene')
        .then(({ createRoomScene }) => {
          if (disposed) return;
          try {
            apiRef.current = createRoomScene(stage, {
              reduced,
              sharing: sharingRef.current,
              onInteract: () => setHint(false),
              onError: (error) => {
                console.error('The 3D room scene stopped rendering.', error);
                setFailed(true);
              }
            });
          } catch (error) {
            console.error('Unable to initialize the 3D room scene.', error);
            setFailed(true);
          }
        })
        .catch((error) => {
          console.error('Unable to load the 3D room scene.', error);
          setFailed(true);
        });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(stage);

    return () => {
      disposed = true;
      io.disconnect();
      if (apiRef.current) apiRef.current.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (apiRef.current) apiRef.current.setSharing(sharing);
  }, [sharing]);

  const onKeyDown = (event) => {
    if (!apiRef.current) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      apiRef.current.rotateBy(-0.15);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      apiRef.current.rotateBy(0.15);
    }
  };

  const current = OPTIONS.find((o) => o.n === sharing);
  const waUrl = waLink(
    company.whatsapp,
    `Hi ${company.name}, I would like to know about ${current.label.toLowerCase()} rooms and availability.`
  );

  return (
    <section className="pad wrap room3d" id="room-3d">
      <div className="head">
        <p className="kicker">EXPLORE A ROOM</p>
        <h2>Step inside a PG room</h2>
        <p>Drag to look around, then switch between sharing options. This is an illustrative layout.</p>
      </div>

      <div className="room3d-card">
        <div
          className="room3d-stage"
          tabIndex={0}
          role="img"
          aria-label={`Interactive 3D model of a ${current.label.toLowerCase()} room. Use the left and right arrow keys to rotate.`}
          onKeyDown={onKeyDown}
        >
          <div className="room3d-canvas" ref={stageRef} />
          {failed && <ModelFallback type="room" className="room3d-fallback-art" />}
          {!failed && hint && <span className="room3d-hint">Drag to rotate</span>}
          {failed && <p className="room3d-fallback">Static preview · interactive 3D is unavailable on this device.</p>}
        </div>

        <div className="room3d-panel">
          <div className="room3d-tabs" role="group" aria-label="Room sharing type">
            {OPTIONS.map((o) => (
              <button
                key={o.n}
                type="button"
                className={`room3d-tab ${sharing === o.n ? 'active' : ''}`}
                aria-pressed={sharing === o.n}
                onClick={() => setSharing(o.n)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <h3>{current.label} room</h3>
          <p>{current.text}</p>
          <ul className="room3d-chips">
            {ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="btn btn-wa js-wa" href={waUrl} target="_blank" rel="noopener noreferrer">
            {Icons.whatsapp} Ask about {current.label.toLowerCase()} rooms
          </a>
          <small>Furniture and sizes vary by property. Ask us for current photos.</small>
        </div>
      </div>
    </section>
  );
}
