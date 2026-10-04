/* ===========================================================
   PgContext.jsx — Global State for PGs, Admin, & UI
   =========================================================== */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  COMPANY,
  FACILITIES,
  INITIAL_PGS,
  LIFE_GALLERY
} from '../data/initialData';

const LOCAL_STORAGE_KEY = 'sainivas_managed_pgs_v2';
const ADMIN_STORAGE_KEY = 'sainivas_admin_auth_v2';

const PgContext = createContext();
const TAB_PATHS = {
  home: '/',
  pgs: '/properties/',
  contact: '/contact/',
  admin: '/admin/'
};

function getTabFromPath(pathname) {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return Object.keys(TAB_PATHS).find((tab) => TAB_PATHS[tab] === normalizedPath) || null;
}

function getInitialTab() {
  const pathTab = getTabFromPath(window.location.pathname);
  if (pathTab) return pathTab;

  if (window.location.pathname === '/') {
    const legacyHash = window.location.hash.slice(1);
    if (['home', 'pgs', 'contact', 'admin'].includes(legacyHash)) {
      return legacyHash;
    }
  }

  return null;
}

export function PgProvider({ children }) {
  // Load PGs from localStorage or fallback to INITIAL_PGS
  const [pgs, setPgs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading pgs from localStorage', err);
    }
    return INITIAL_PGS;
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  // Search & Filter state for PGs page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Lightbox modal state
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    src: '',
    title: '',
    desc: ''
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync PGs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pgs));
    } catch (err) {
      console.error('Error saving pgs to localStorage', err);
    }
  }, [pgs]);

  const setActiveTab = (tab) => {
    const nextPath = TAB_PATHS[tab];
    if (!nextPath) return;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveTabState(tab);
  };

  // Keep browser history navigation and legacy hash links in sync.
  useEffect(() => {
    const legacyHash = window.location.hash.slice(1);
    if (
      window.location.pathname === '/' &&
      ['home', 'pgs', 'contact', 'admin'].includes(legacyHash)
    ) {
      window.history.replaceState({}, '', TAB_PATHS[legacyHash]);
    }

    const handlePopState = () => {
      setActiveTabState(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (activeTab) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const loginAdmin = (password) => {
    if (password === 'admin123' || password === 'admin' || password === '') {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      showToast('Welcome, Admin! Admin Mode is now active.');
      return true;
    }
    showToast('Incorrect passcode. Use "admin123" to sign in.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    showToast('Signed out of Admin Mode.', 'info');
  };

  // Add a new PG
  const addPg = (newPgData) => {
    const newPg = {
      id: `pg-${Date.now()}`,
      name: newPgData.name.trim() || 'New PG Residence',
      audience: newPgData.audience || 'Boys',
      area: newPgData.area.trim() || 'Kerala',
      address: newPgData.address.trim() || COMPANY.office,
      landmark: newPgData.landmark.trim() || 'Prime location near transit',
      rent: Number(newPgData.rent) || 8000,
      deposit: Number(newPgData.deposit) || 15000,
      sharing: newPgData.sharing.trim() || '2 & 3 sharing',
      food: newPgData.food.trim() || 'Veg + non-veg',
      notice: newPgData.notice.trim() || '1 month',
      vacancy: Number(newPgData.vacancy) || 0,
      photos:
        Array.isArray(newPgData.photos) && newPgData.photos.length > 0
          ? newPgData.photos
          : ['assets/room1.jpg', 'assets/room2.jpg'],
      amenities:
        Array.isArray(newPgData.amenities) && newPgData.amenities.length > 0
          ? newPgData.amenities
          : ['Wi-Fi', 'Home Food', 'Daily Housekeeping', '24/7 Power'],
      mapLink:
        newPgData.mapLink?.trim() ||
        `https://maps.google.com/?q=${encodeURIComponent((newPgData.area || newPgData.name) + ' Kerala')}`,
      createdAt: new Date().toISOString()
    };

    setPgs((prev) => [newPg, ...prev]);
    showToast(`"${newPg.name}" was added successfully and is now live in Our PGs!`);
    return newPg;
  };

  // Update existing PG
  const updatePg = (id, updatedData) => {
    setPgs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    showToast(`Property updated successfully!`);
  };

  // Quick adjust vacancy
  const adjustVacancy = (id, delta) => {
    setPgs((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newVac = Math.max(0, (item.vacancy || 0) + delta);
          return { ...item, vacancy: newVac };
        }
        return item;
      })
    );
  };

  // Delete PG
  const deletePg = (id) => {
    const toRemove = pgs.find((p) => p.id === id);
    setPgs((prev) => prev.filter((item) => item.id !== id));
    showToast(`Removed "${toRemove?.name || 'Property'}".`, 'info');
  };

  // Reset to initial properties
  const resetToDefaults = () => {
    setPgs(INITIAL_PGS);
    showToast('Reset to original default properties.', 'info');
  };

  // Computed statistics
  const stats = [
    { value: pgs.length, suffix: '', label: 'Properties' },
    { value: pgs.reduce((sum, pg) => sum + Number(pg.vacancy || 0), 0), suffix: '', label: 'Open rooms' },
    { value: [...new Set(pgs.map((pg) => pg.area.split(',').slice(-1)[0].trim()))].length, suffix: '', label: 'Areas covered' }
  ];

  // Lightbox handlers
  const openLightbox = (src, title = '', desc = '') => {
    setLightbox({ isOpen: true, src, title, desc });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <PgContext.Provider
      value={{
        company: COMPANY,
        facilities: FACILITIES,
        gallery: LIFE_GALLERY,
        pgs,
        stats,
        addPg,
        updatePg,
        deletePg,
        adjustVacancy,
        resetToDefaults,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        lightbox,
        openLightbox,
        closeLightbox,
        toast,
        showToast
      }}
    >
      {children}
    </PgContext.Provider>
  );
}

export const usePg = () => {
  const ctx = useContext(PgContext);
  if (!ctx) {
    throw new Error('usePg must be used within a PgProvider');
  }
  return ctx;
};
