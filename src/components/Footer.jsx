/* ===========================================================
   Footer.jsx — Site Footer
   =========================================================== */
import React from 'react';
import { usePg } from '../context/PgContext';

export default function Footer() {
  const { company, setActiveTab } = usePg();
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot">
      <div className="wrap foot-in">
        <p>
          © {year} {company.name} · {company.office}
        </p>
        <nav className="foot-nav">
          <a href="/" onClick={(event) => { event.preventDefault(); setActiveTab('home'); }}>Home</a>
          <a href="/properties/" onClick={(event) => { event.preventDefault(); setActiveTab('pgs'); }}>Our PGs</a>
          <a href="/contact/" onClick={(event) => { event.preventDefault(); setActiveTab('contact'); }}>Contact</a>
          <a href="/admin/" onClick={(event) => { event.preventDefault(); setActiveTab('admin'); }}>Admin Portal</a>
          <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
            {company.phone}
          </a>
        </nav>
      </div>
    </footer>
  );
}
