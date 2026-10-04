/* ===========================================================
   PgCard.jsx — Interactive PG Property Card
   =========================================================== */
import React, { useState } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, money, waLink } from '../data/icons';
import { assetUrl } from '../data/assetUrl';

export default function PgCard({ pg, onEdit, onDelete, showAdminActions = false }) {
  const { company, openLightbox, adjustVacancy } = usePg();
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = Array.isArray(pg.photos) && pg.photos.length > 0
    ? pg.photos
    : ['assets/room1.jpg'];

  const free = Number(pg.vacancy) > 0;

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const bookMsg = free
    ? `Hi ${company.name}, I am interested in ${pg.name} (${pg.sharing}, ${money(pg.rent)}/month). Is a bed available?`
    : `Hi ${company.name}, I want to join the waitlist for ${pg.name} (${pg.sharing}, ${money(pg.rent)}/month).`;

  const waUrl = waLink(company.whatsapp, bookMsg);

  return (
    <article className="pg tilt-card" data-audience={pg.audience} data-free={free}>
      {/* PHOTO GALLERY */}
      <div
        className="gallery"
        onClick={() =>
          openLightbox(
            assetUrl(photos[photoIndex]),
            pg.name,
            `${pg.sharing} · ${money(pg.rent)}/month · ${pg.area}`
          )
        }
        title="Click photo to enlarge"
      >
        <img
          src={assetUrl(photos[photoIndex])}
          alt={`${pg.name}, representative room photo ${photoIndex + 1}`}
          className="show"
          onError={(e) => {
            e.currentTarget.src = '/assets/room-hero.png';
          }}
        />
        <span className="photo-caption">Representative image</span>

        {/* AUDIENCE BADGE */}
        <span className="badge">{pg.audience}</span>

        {/* VACANCY BADGE */}
        <span className={`badge r ${free ? 'free' : 'full'}`}>
          {free ? `${pg.vacancy} ${pg.vacancy === 1 ? 'bed' : 'beds'} free` : 'Waitlist'}
        </span>

        {/* CAROUSEL CONTROLS */}
        {photos.length > 1 && (
          <>
            <div className="dots">
              {photos.map((_, i) => (
                <i
                  key={i}
                  className={i === photoIndex ? 'on' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(i);
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              className="gal-arr prev"
              onClick={prevPhoto}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="gal-arr next"
              onClick={nextPhoto}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* CARD BODY */}
      <div className="pg-body">
        <h3>{pg.name}</h3>
        <p className="loc">{pg.landmark || pg.area}</p>

        <div className="price">
          <b>{money(pg.rent)}</b>
          <span>
            per month · {money(pg.deposit)} deposit
          </span>
        </div>

        {/* SPECS GRID */}
        <div className="specs">
          <div>
            <span>ROOM TYPE</span>
            <b>{pg.sharing || '2 & 3 sharing'}</b>
          </div>
          <div>
            <span>FOOD</span>
            <b>{pg.food || 'Veg + non-veg'}</b>
          </div>
          <div>
            <span>NOTICE PERIOD</span>
            <b>{pg.notice || '1 month'}</b>
          </div>
          <div>
            <span>AREA</span>
            <b>{pg.area || 'Kerala'}</b>
          </div>
        </div>

        {/* AMENITIES */}
        {Array.isArray(pg.amenities) && pg.amenities.length > 0 && (
          <div className="chips">
            {pg.amenities.slice(0, 7).map((amenity, i) => (
              <span key={i} className="chip">
                {amenity}
              </span>
            ))}
            {pg.amenities.length > 7 && (
              <span className="chip chip-more">
                +{pg.amenities.length - 7} more
              </span>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="pg-foot">
          <a
            className="btn btn-wa"
            target="_blank"
            rel="noopener noreferrer"
            href={waUrl}
          >
            {Icons.whatsapp} {free ? 'Book on WhatsApp' : 'Join waitlist'}
          </a>

          {pg.mapLink && (
            <a
              className="pg-map-link"
              href={pg.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Google Maps"
            >
              {Icons.mapPin} Map
            </a>
          )}
        </div>

        {/* ADMIN MANAGEMENT CONTROLS */}
        {showAdminActions && (
          <div className="card-admin-bar">
            <div className="card-admin-vacancy">
              <span>Beds: <b>{pg.vacancy}</b></span>
              <button
                type="button"
                className="btn-vac-adjust"
                onClick={() => adjustVacancy(pg.id, -1)}
                title="Decrease available bed"
              >
                -
              </button>
              <button
                type="button"
                className="btn-vac-adjust"
                onClick={() => adjustVacancy(pg.id, 1)}
                title="Increase available bed"
              >
                +
              </button>
            </div>

            <div className="card-admin-btns">
              {onEdit && (
                <button
                  type="button"
                  className="btn-admin-edit"
                  onClick={() => onEdit(pg)}
                  title="Edit details"
                >
                  {Icons.edit} Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="btn-admin-del"
                  onClick={() => onDelete(pg)}
                  title="Delete PG"
                >
                  {Icons.trash} Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
