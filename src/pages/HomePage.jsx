/* ===========================================================
   HomePage.jsx — Landing Page
   =========================================================== */
import React, { useState, useEffect } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';
import PgCard from '../components/PgCard';
import Hero3D from '../components/Hero3D';
import RoomShowcase from '../components/RoomShowcase';
import { assetUrl } from '../data/assetUrl';

export default function HomePage() {
  const { company, facilities, gallery, pgs, stats, openLightbox } = usePg();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const tiltCards = Array.from(document.querySelectorAll('.tilt-card'));
    if (!tiltCards.length) return undefined;

    const handlePointerMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 6;

      event.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      event.currentTarget.style.boxShadow = '0 24px 40px -28px rgba(31, 42, 42, 0.22)';
    };

    const handlePointerLeave = (event) => {
      event.currentTarget.style.transform = '';
      event.currentTarget.style.boxShadow = '';
    };

    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', handlePointerMove);
      card.addEventListener('pointerleave', handlePointerLeave);
    });

    return () => {
      tiltCards.forEach((card) => {
        card.removeEventListener('pointermove', handlePointerMove);
        card.removeEventListener('pointerleave', handlePointerLeave);
      });
    };
  }, [activeCategory, pgs.length]);

  // Gallery categories
  const categories = ['All', ...new Set(gallery.map((g) => g.cat))];
  const filteredGallery =
    activeCategory === 'All' ? gallery : gallery.filter((g) => g.cat === activeCategory);
  const currentSlide = filteredGallery[activeSlide] || filteredGallery[0];

  const changeSlide = (direction) => {
    if (filteredGallery.length < 2) return;
    setActiveSlide((index) => (index + direction + filteredGallery.length) % filteredGallery.length);
  };

  // Featured PGs (properties with vacancy, or up to 3)
  const featuredPgs = pgs.filter((p) => Number(p.vacancy) > 0).slice(0, 3);
  const displayPgs = featuredPgs.length > 0 ? featuredPgs : pgs.slice(0, 3);

  const heroWaUrl = waLink(
    company.whatsapp,
    `Hi ${company.name}, I would like to check room availability and book a visit.`
  );

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero has-3d" id="hero-section">
        <div
          className="hero-photo-bg"
          style={{ backgroundImage: `url('${assetUrl(company.heroBg)}')` }}
        />
        <Hero3D name={company.name} />
        <div className="wrap hero-in">
          <span className="eyebrow">
            <i /> Open rooms across Kerala
          </span>
          <h1>{company.tagline}</h1>
          <p>{company.intro}</p>
          <div className="hero-actions">
            <a
              className="btn btn-wa js-wa"
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {Icons.whatsapp} Book on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="wrap">
        <div className="stats">
          {stats.map((s, i) => (
            <div key={i}>
              <b>
                {s.prefix || ''}
                {s.value}
                {s.suffix || ''}
              </b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WHO WE ARE / ABOUT */}
      <section className="pad wrap">
        <div className="split">
          <div>
            <p className="kicker">WHO WE ARE</p>
            <h2>Managed homes, with practical support</h2>
            <p className="section-copy">{company.about}</p>
            <ul className="ticks">
              <li>No broker, no commission, zero hidden charges</li>
              <li>Rent stays fixed for your full stay</li>
              <li>Repairs handled by us, not the building owner</li>
              <li>Visit the room in person before you pay anything</li>
            </ul>
          </div>
          <div className="art reveal in tilt-card">
            <b>{company.since}</b>
            <span>Running since</span>
          </div>
        </div>
      </section>

      {/* 3D ROOM EXPLORER */}
      <RoomShowcase company={company} />

      {/* LIFE HERE PHOTO GALLERY */}
      <section className="pad wrap">
        <div className="head">
          <p className="kicker">LIFE HERE</p>
          <h2>What it looks like inside</h2>
          <p>Room and amenity imagery. Ask us for current photos of a specific home.</p>
        </div>

        {/* CATEGORY TABS */}
        <div className="gallery-cat-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSlide(0);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {currentSlide && (
          <div className="photo-carousel" role="region" aria-label="Life here photo carousel">
            <div
              className="p-item"
              role="button"
              tabIndex={0}
              aria-label={`View ${currentSlide.title} full photo`}
              onClick={() => openLightbox(currentSlide.src, currentSlide.title, currentSlide.desc)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openLightbox(currentSlide.src, currentSlide.title, currentSlide.desc);
                }
              }}
            >
              <img src={assetUrl(currentSlide.src)} alt={currentSlide.title} />
              <div className="p-label">
                <span className="p-cat-tag">{currentSlide.cat}</span>
                <b>{currentSlide.title}</b>
                <small>{currentSlide.desc}</small>
              </div>
            </div>
            {filteredGallery.length > 1 && (
              <div className="photo-carousel-controls">
                <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous photo">
                  ‹
                </button>
                <div className="photo-carousel-position" aria-live="polite">
                  {activeSlide + 1} / {filteredGallery.length}
                </div>
                <div className="photo-carousel-dots" aria-label="Choose a photo">
                  {filteredGallery.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={index === activeSlide ? 'active' : ''}
                      aria-label={`Show photo ${index + 1}: ${item.title}`}
                      aria-pressed={index === activeSlide}
                      onClick={() => setActiveSlide(index)}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => changeSlide(1)} aria-label="Next photo">
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FACILITIES */}
      <section className="pad wrap">
        <div className="head">
          <p className="kicker">FACILITIES</p>
          <h2>What you get in every property</h2>
          <p>Facilities vary by property. Check each listing for details.</p>
        </div>
        <div className="grid-fac">
          {facilities.map((f, i) => (
            <article key={i} className="fac tilt-card">
              <div className="fac-img">
                <img src={assetUrl(f.photo)} alt={f.title} loading="lazy" />
                <div className="ic-badge">{Icons[f.icon]}</div>
              </div>
              <div className="fac-body">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURED AVAILABLE PGS */}
      <section className="pad wrap">
        <div className="head">
          <p className="kicker">AVAILABLE NOW</p>
          <h2>Room availability</h2>
          <p>Compare current availability, locations, and monthly rent.</p>
        </div>

        <div className="grid-pg">
          {displayPgs.map((pg) => (
            <PgCard key={pg.id} pg={pg} showAdminActions={false} />
          ))}
        </div>

      </section>
    </main>
  );
}
