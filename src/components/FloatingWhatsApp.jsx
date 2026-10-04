import React from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';

export default function FloatingWhatsApp() {
  const { company } = usePg();
  const url = waLink(
    company.whatsapp,
    `Hi ${company.name}, I would like to know about available rooms.`
  );

  return (
    <a
      id="float"
      className="float"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp with Kerala PG"
    >
      {Icons.whatsapp}
    </a>
  );
}
