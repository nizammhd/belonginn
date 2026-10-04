import React from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';

export default function MobileNav() {
  const { company, activeTab, setActiveTab, isAdmin } = usePg();

  const waUrl = waLink(
    company.whatsapp,
    `Hi ${company.name}, I want to enquire about available PG rooms.`
  );

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-inner">
        <a
          href="/"
          className={`mob-link ${activeTab === 'home' ? 'active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            setActiveTab('home');
          }}
        >
          {Icons.home}
          <span>Home</span>
        </a>

        <a
          href="/properties/"
          className={`mob-link ${activeTab === 'pgs' ? 'active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            setActiveTab('pgs');
          }}
        >
          {Icons.property}
          <span>Our PGs</span>
        </a>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mob-link wa-mob"
        >
          {Icons.whatsapp}
          <span>Chat</span>
        </a>

        <a
          href="/contact/"
          className={`mob-link ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            setActiveTab('contact');
          }}
        >
          {Icons.contact}
          <span>Contact</span>
        </a>

        <a
          href="/admin/"
          className={`mob-link ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            setActiveTab('admin');
          }}
        >
          {isAdmin ? Icons.unlock : Icons.lock}
          <span>Admin</span>
        </a>
      </div>
    </nav>
  );
}
