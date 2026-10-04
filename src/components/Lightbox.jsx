import React, { useEffect } from 'react';
import { usePg } from '../context/PgContext';
import { assetUrl } from '../data/assetUrl';

export default function Lightbox() {
  const { lightbox, closeLightbox } = usePg();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && lightbox.isOpen) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen, closeLightbox]);

  if (!lightbox.isOpen) return null;

  return (
    <div
      className="lightbox-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLightbox();
      }}
    >
      <button
        className="lightbox-close"
        aria-label="Close photo preview"
        onClick={closeLightbox}
      >
        ✕
      </button>
      <div className="lightbox-content">
        <img src={assetUrl(lightbox.src)} alt={lightbox.title || 'PG photo preview'} />
        {(lightbox.title || lightbox.desc) && (
          <div className="lightbox-caption">
            {lightbox.title && <h4>{lightbox.title}</h4>}
            {lightbox.desc && <p>{lightbox.desc}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
