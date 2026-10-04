/* ===========================================================
   App.jsx — Main Application Root
   =========================================================== */
import React from 'react';
import { lazy, Suspense } from 'react';
import { PgProvider, usePg } from './context/PgContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ProgressBar from './components/ProgressBar';
import BackToTop from './components/BackToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Lightbox from './components/Lightbox';
import Toast from './components/Toast';
import Seo from './components/Seo';

import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const PgsPage = lazy(() => import('./pages/PgsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function AppContent() {
  const { activeTab, company, pgs } = usePg();

  return (
    <div className="app-shell">
      <Seo page={activeTab || 'notFound'} company={company} pgs={pgs} />
      <ProgressBar />
      <Header />

      {activeTab === 'home' && <HomePage />}
      <Suspense fallback={<div className="route-loading" role="status">Loading page</div>}>
        {activeTab === 'pgs' && <PgsPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'admin' && <AdminPage />}
      </Suspense>
      {!activeTab && <NotFoundPage />}

      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
      <BackToTop />
      <Lightbox />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <PgProvider>
      <AppContent />
    </PgProvider>
  );
}
