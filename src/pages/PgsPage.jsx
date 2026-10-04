/* ===========================================================
   PgsPage.jsx — "Our PGs" Page with Live Filters & Admin Integration
   =========================================================== */
import React, { useState, useMemo } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';
import PgCard from '../components/PgCard';
import Breadcrumbs from '../components/Breadcrumbs';
import AmbientScene from '../components/AmbientScene';

export default function PgsPage() {
  const {
    company,
    pgs,
    isAdmin,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    deletePg
  } = usePg();

  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'vacancy'

  // Filter & Search Logic
  const filteredPgs = useMemo(() => {
    let result = [...pgs];

    // Filter by audience / availability
    if (selectedFilter === 'free') {
      result = result.filter((p) => Number(p.vacancy) > 0);
    } else if (selectedFilter === 'Boys') {
      result = result.filter((p) => p.audience === 'Boys' || p.audience === 'Boys & Girls');
    } else if (selectedFilter === 'Girls') {
      result = result.filter((p) => p.audience === 'Girls' || p.audience === 'Boys & Girls');
    } else if (selectedFilter === 'coliving') {
      result = result.filter((p) => p.audience === 'Boys & Girls');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const areaMatch = p.area?.toLowerCase().includes(q);
        const landmarkMatch = p.landmark?.toLowerCase().includes(q);
        const sharingMatch = p.sharing?.toLowerCase().includes(q);
        const amenitiesMatch =
          Array.isArray(p.amenities) &&
          p.amenities.some((a) => a.toLowerCase().includes(q));

        return nameMatch || areaMatch || landmarkMatch || sharingMatch || amenitiesMatch;
      });
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => (Number(a.rent) || 0) - (Number(b.rent) || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (Number(b.rent) || 0) - (Number(a.rent) || 0));
    } else if (sortBy === 'vacancy') {
      result.sort((a, b) => (Number(b.vacancy) || 0) - (Number(a.vacancy) || 0));
    }

    return result;
  }, [pgs, selectedFilter, searchQuery, sortBy]);

  const consultWaUrl = waLink(
    company.whatsapp,
    `Hi ${company.name}, I need help finding the best PG near my workplace/college.`
  );

  return (
    <main>
      {/* HERO BANNER */}
      <section className="hero">
        <AmbientScene />
        <div className="wrap hero-in">
          <Breadcrumbs page="pgs" />
          <span className="eyebrow">
            <i /> Updated live · {pgs.length} properties managed
          </span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 50px)' }}>PG Rooms in Kerala</h1>
          <p>
            Browse managed rooms by location, rent, amenities, and availability.
            Message us on WhatsApp to ask about a room or arrange a visit.
          </p>
        </div>
      </section>

      {/* FILTER & SEARCH CONTROLS */}
      <section className="pad wrap" style={{ paddingTop: 32 }}>
        {/* LIVE SEARCH BAR */}
        <div className="search-wrap">
          <div className="search-icon">{Icons.search}</div>
          <input
            id="pg-search"
            type="search"
            placeholder="Search by area, property, or amenity"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* AUDIENCE FILTERS & SORT */}
        <div className="filters-row">
          <div className="filters">
            <button
              type="button"
              className={selectedFilter === 'all' ? 'on' : ''}
              onClick={() => setSelectedFilter('all')}
            >
              All properties ({pgs.length})
            </button>
            <button
              type="button"
              className={selectedFilter === 'free' ? 'on' : ''}
              onClick={() => setSelectedFilter('free')}
            >
              Available now
            </button>
            <button
              type="button"
              className={selectedFilter === 'Boys' ? 'on' : ''}
              onClick={() => setSelectedFilter('Boys')}
            >
              For boys
            </button>
            <button
              type="button"
              className={selectedFilter === 'Girls' ? 'on' : ''}
              onClick={() => setSelectedFilter('Girls')}
            >
              For girls
            </button>
            <button
              type="button"
              className={selectedFilter === 'coliving' ? 'on' : ''}
              onClick={() => setSelectedFilter('coliving')}
            >
              Coliving (Boys & Girls)
            </button>
          </div>

          <div className="sort-dropdown">
            <label htmlFor="pg-sort">Sort by:</label>
            <select
              id="pg-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-asc">Rent: Low to High</option>
              <option value="price-desc">Rent: High to Low</option>
              <option value="vacancy">Most Vacant Beds</option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div className="results-count-bar">
          <span>
            Showing <b>{filteredPgs.length}</b> of <b>{pgs.length}</b> properties
          </span>
          {(searchQuery || selectedFilter !== 'all') && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                setSortBy('default');
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* GRID OF PG CARDS */}
        {filteredPgs.length > 0 ? (
          <div className="grid-pg" id="pglist">
            {filteredPgs.map((pg) => (
              <PgCard
                key={pg.id}
                pg={pg}
                showAdminActions={isAdmin}
                onEdit={() => setActiveTab('admin')}
                onDelete={(p) => {
                  if (window.confirm(`Delete "${p.name}"?`)) {
                    deletePg(p.id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <div className="no-res-icon">{Icons.search}</div>
            <h3>No properties match your search</h3>
            <p>
              We couldn't find any PGs matching "{searchQuery}". Try searching for another
              locality, clearing the filters, or contact us directly on WhatsApp.
            </p>
            <button
              type="button"
              className="btn btn-line"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* WHATSAPP CONSULTATION CALLOUT */}
      <section className="wrap" style={{ marginBottom: 80 }}>
        <div className="band">
          <h2>Not sure which one suits you?</h2>
          <p>
            Tell us your office or college location and monthly budget. We will suggest
            the closest property with a free bed right now.
          </p>
          <a
            className="btn btn-wa js-wa"
            href={consultWaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Icons.whatsapp} Ask on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
