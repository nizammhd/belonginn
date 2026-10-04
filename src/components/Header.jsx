/* ===========================================================
   Header.jsx — Sticky Navigation Bar with Admin Access
   =========================================================== */
import React, { useState, useEffect } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';
import { assetUrl } from '../data/assetUrl';

export default function Header() {
  const { company, activeTab, setActiveTab, isAdmin } = usePg();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const bookVisitUrl = waLink(
    company.whatsapp,
    `Hi ${company.name}, I would like to schedule a visit to inspect available rooms.`
  );

  return (
    <header className={`site-head ${scrolled ? 'scrolled' : ''}`}>
      <div className="head-in">
        {/* LOGO */}
        <a
          className="logo"
          id="logo"
          href="/"
          aria-label={`${company.name} home`}
          onClick={(event) => {
            event.preventDefault();
            handleNavClick('home');
          }}
          title={company.name}
        >
          <img
            src={assetUrl(company.logo)}
            alt={`${company.name} logo`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerText = company.short;
            }}
          />
        </a>

        {/* WORDMARK */}
        <a
          className="wordmark"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick('home');
          }}
        >
          {company.name}
          <span>Managed PG homes · Kerala</span>
        </a>

        {/* BURGER BUTTON */}
        <button
          className="burger"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>

        {/* SITE NAV */}
        <nav className={`site-nav ${mobileMenuOpen ? 'open' : ''}`} id="nav">
          <a
            href="/"
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('home');
            }}
          >
            Home
          </a>

          <a
            href="/properties/"
            className={`nav-link-btn ${activeTab === 'pgs' ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('pgs');
            }}
          >
            Our PGs
          </a>

          <a
            href="/contact/"
            className={`nav-link-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('contact');
            }}
          >
            Contact
          </a>

          {/* ADMIN PORTAL LINK */}
          <a
            href="/admin/"
            className={`nav-link-btn admin-nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              handleNavClick('admin');
            }}
            title="Admin Portal: Add and manage PG properties"
          >
            <span className="admin-nav-icon">
              {isAdmin ? Icons.unlock : Icons.lock}
            </span>
            Admin {isAdmin && <span className="admin-status-dot" />}
          </a>

          <a
            href={bookVisitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta js-wa"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a visit
          </a>
        </nav>
      </div>
    </header>
  );
}
