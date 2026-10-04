/* ===========================================================
   AdminPage.jsx — Full Admin Dashboard & PG Management Portal
   =========================================================== */
import React, { useState } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, money } from '../data/icons';
import AdminPgForm from '../components/AdminPgForm';
import { assetUrl } from '../data/assetUrl';

export default function AdminPage() {
  const {
    pgs,
    deletePg,
    adjustVacancy,
    resetToDefaults,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    setActiveTab
  } = usePg();

  const [passwordInput, setPasswordInput] = useState('');
  const [adminTab, setAdminTab] = useState('add'); // 'add' | 'manage'
  const [editingPg, setEditingPg] = useState(null);
  const [pgToDelete, setPgToDelete] = useState(null);

  // Statistics
  const totalPgs = pgs.length;
  const totalBeds = pgs.reduce((acc, p) => acc + (Number(p.vacancy) || 0), 0);
  const boysCount = pgs.filter((p) => p.audience === 'Boys').length;
  const girlsCount = pgs.filter((p) => p.audience === 'Girls').length;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput('');
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin123');
  };

  const handleStartEdit = (pg) => {
    setEditingPg(pg);
    setAdminTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormDone = () => {
    setEditingPg(null);
    setAdminTab('manage');
  };

  const confirmDelete = () => {
    if (pgToDelete) {
      deletePg(pgToDelete.id);
      setPgToDelete(null);
    }
  };

  // IF NOT AUTHENTICATED: Show login card
  if (!isAdmin) {
    return (
      <div className="pad wrap admin-auth-wrap">
        <div className="admin-login-card">
          <div className="admin-login-badge">{Icons.lock}</div>
          <h2>Admin Portal Sign In</h2>
          <p>
            Sign in to add new PG residences, upload room photos, update rental terms,
            and manage bed vacancies.
          </p>

          <form onSubmit={handleLoginSubmit} className="admin-login-form">
            <label htmlFor="admin-pass">Admin Passcode</label>
            <input
              id="admin-pass"
              type="password"
              placeholder="Enter passcode (default: admin123)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />

            <button type="submit" className="btn btn-grad" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In to Admin
            </button>
          </form>

          <div className="admin-login-divider">
            <span>or for quick evaluation</span>
          </div>

          <button
            type="button"
            className="btn btn-wa"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleQuickDemoLogin}
          >
            One-Click Demo Admin Login
          </button>
          <small style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--ink-2)' }}>
            Default passcode is <code>admin123</code>
          </small>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED: Full Admin Dashboard
  return (
    <div className="pad wrap admin-dashboard">
      {/* TOP BAR */}
      <div className="admin-topbar">
        <div>
          <span className="eyebrow" style={{ marginBottom: 8 }}>
            <i></i> Admin Control Center
          </span>
          <h1>PG Management Dashboard</h1>
        </div>

        <div className="admin-topbar-actions">
          <button
            type="button"
            className="btn btn-line"
            onClick={() => setActiveTab('pgs')}
          >
            {Icons.eye} View Public "Our PGs" Page
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ color: 'var(--ink)' }}
            onClick={logoutAdmin}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Managed PGs</span>
          <b>{totalPgs}</b>
        </div>
        <div className="admin-stat-card">
          <span>Total Vacant Beds</span>
          <b>{totalBeds}</b>
        </div>
        <div className="admin-stat-card">
          <span>Boys PGs</span>
          <b>{boysCount}</b>
        </div>
        <div className="admin-stat-card">
          <span>Girls PGs</span>
          <b>{girlsCount}</b>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${adminTab === 'add' ? 'active' : ''}`}
          onClick={() => {
            setAdminTab('add');
            if (!editingPg) setEditingPg(null);
          }}
        >
          {editingPg ? `${Icons.edit} Edit Property` : `${Icons.plus} Add New PG Property`}
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${adminTab === 'manage' ? 'active' : ''}`}
          onClick={() => {
            setAdminTab('manage');
            setEditingPg(null);
          }}
        >
          {Icons.list} Manage Properties ({pgs.length})
        </button>

        <button
          type="button"
          className="admin-tab-btn btn-tab-reset"
          onClick={() => {
            if (window.confirm('Reset all PGs to the original 4 demo properties?')) {
              resetToDefaults();
            }
          }}
          title="Restore the initial 4 PG properties"
        >
          {Icons.refresh} Reset Default Properties
        </button>
      </div>

      {/* TAB CONTENT: ADD / EDIT FORM */}
      {adminTab === 'add' && (
        <div className="admin-tab-pane">
          <AdminPgForm
            initialData={editingPg}
            onComplete={handleFormDone}
            onCancel={
              editingPg
                ? () => {
                    setEditingPg(null);
                    setAdminTab('manage');
                  }
                : null
            }
          />
        </div>
      )}

      {/* TAB CONTENT: MANAGE PROPERTIES */}
      {adminTab === 'manage' && (
        <div className="admin-tab-pane">
          <div className="manage-pgs-header">
            <div>
              <h3>All Listed PG Properties</h3>
              <p>
                Adjust bed vacancies, update descriptions or photos, or delete properties.
                Changes sync immediately to the website.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-grad"
              onClick={() => {
                setEditingPg(null);
                setAdminTab('add');
              }}
            >
              + Add Another PG
            </button>
          </div>

          <div className="admin-properties-table-wrap">
            <table className="admin-properties-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Audience</th>
                  <th>Area</th>
                  <th>Rent / Deposit</th>
                  <th>Vacancy</th>
                  <th>Photos</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pgs.map((pg) => {
                  const free = Number(pg.vacancy) > 0;
                  const thumb = assetUrl(pg.photos?.[0] || 'assets/room1.jpg');

                  return (
                    <tr key={pg.id}>
                      <td className="prop-cell">
                        <img
                          src={thumb}
                          alt={pg.name}
                          className="table-prop-thumb"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/room-hero.png';
                          }}
                        />
                        <div>
                          <b>{pg.name}</b>
                          <small>{pg.landmark}</small>
                        </div>
                      </td>

                      <td>
                        <span className="table-badge audience">{pg.audience}</span>
                      </td>

                      <td>{pg.area}</td>

                      <td>
                        <b>{money(pg.rent)}</b>
                        <small className="table-dep">{money(pg.deposit)} dep</small>
                      </td>

                      <td>
                        <div className="table-vac-control">
                          <button
                            type="button"
                            className="vac-btn"
                            onClick={() => adjustVacancy(pg.id, -1)}
                            title="Decrease vacancy"
                          >
                            -
                          </button>
                          <span className={`table-badge ${free ? 'free' : 'full'}`}>
                            {free ? `${pg.vacancy} free` : 'Full'}
                          </span>
                          <button
                            type="button"
                            className="vac-btn"
                            onClick={() => adjustVacancy(pg.id, 1)}
                            title="Increase vacancy"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td>
                        <span className="photo-count-badge">
                          {Icons.camera} {pg.photos?.length || 0}
                        </span>
                      </td>

                      <td>
                        <div className="table-action-btns">
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => handleStartEdit(pg)}
                            title="Edit this PG"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-action-del"
                            onClick={() => setPgToDelete(pg)}
                            title="Delete this PG"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {pgToDelete && (
        <div className="modal-backdrop open" onClick={() => setPgToDelete(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3>Delete Property</h3>
            <p>
              Are you sure you want to delete <b>{pgToDelete.name}</b>?
              This will remove it from the "Our PGs" page immediately.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-line"
                onClick={() => setPgToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-del-confirm"
                onClick={confirmDelete}
              >
                Yes, Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
