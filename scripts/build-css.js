import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseCssPath = path.join(__dirname, '..', 'css', 'style.css');
const targetCssPath = path.join(__dirname, '..', 'src', 'index.css');

const baseCss = fs.readFileSync(baseCssPath, 'utf8');

const additionalCss = `
/* ===========================================================
   ADDITIONAL STYLES FOR REACT APP & ADMIN FEATURES
   =========================================================== */

/* Nav button resets to match original anchor links */
.nav-link-btn {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-2);
  padding: 9px 14px;
  border-radius: 99px;
  cursor: pointer;
  transition: background .18s, color .18s, transform .18s;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nav-link-btn::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: var(--grad-btn);
  border-radius: 2px;
  transition: transform .25s cubic-bezier(.2, .8, .3, 1);
}

.nav-link-btn:hover::after,
.nav-link-btn.active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link-btn:hover {
  color: var(--ink);
  background: var(--tint);
}

.nav-link-btn.active {
  color: var(--ink);
  background: var(--tint);
  font-weight: 600;
}

.admin-nav-btn {
  border: 1px dashed var(--line);
}

.admin-nav-icon {
  display: inline-flex;
  align-items: center;
}

.admin-nav-icon svg {
  width: 14px;
  height: 14px;
}

.admin-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  display: inline-block;
}

/* Mobile nav buttons reset */
.mobile-nav-inner button.mob-link {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

.foot-nav button {
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: color .2s;
}

.foot-nav button:hover {
  color: var(--brand);
}

/* ---------- ADMIN AUTHENTICATION ---------- */
.admin-auth-wrap {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.admin-login-card {
  max-width: 440px;
  width: 100%;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 40px 32px;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.admin-login-badge {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--tint);
  color: var(--brand);
  display: inline-grid;
  place-items: center;
  margin-bottom: 20px;
}

.admin-login-badge svg {
  width: 28px;
  height: 28px;
}

.admin-login-card h2 {
  font-size: 26px;
  margin-bottom: 10px;
}

.admin-login-card p {
  color: var(--ink-2);
  font-size: 14.5px;
  margin-bottom: 24px;
}

.admin-login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.admin-login-form label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.admin-login-form input {
  width: 100%;
  padding: 13px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  color: var(--ink);
  font-size: 15px;
  font-family: inherit;
  transition: border-color .2s, box-shadow .2s;
}

.admin-login-form input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(61, 78, 216, 0.15);
}

.admin-login-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: var(--ink-2);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.admin-login-divider::before,
.admin-login-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid var(--line);
}

.admin-login-divider span {
  padding: 0 12px;
}

/* ---------- ADMIN DASHBOARD ---------- */
.admin-dashboard {
  padding-top: 40px;
  padding-bottom: 80px;
}

.admin-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.admin-topbar h1 {
  font-size: clamp(28px, 4vw, 40px);
}

.admin-topbar-actions {
  display: flex;
  gap: 12px;
}

.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.admin-stat-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.admin-stat-card span {
  font-size: 13px;
  color: var(--ink-2);
  display: block;
  margin-bottom: 6px;
}

.admin-stat-card b {
  font-size: 28px;
  font-family: "Fraunces", serif;
  color: var(--ink);
}

.admin-tabs-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-bottom: 2px solid var(--line);
  margin-bottom: 32px;
  padding-bottom: 2px;
}

.admin-tab-btn {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);
  padding: 12px 20px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.admin-tab-btn:hover {
  color: var(--ink);
  background: var(--tint);
}

.admin-tab-btn.active {
  color: var(--brand);
  background: var(--card);
  border-bottom: 3px solid var(--brand);
  margin-bottom: -2px;
}

.admin-tab-btn.btn-tab-reset {
  margin-left: auto;
  font-size: 13.5px;
  color: #ef4444;
}

.admin-tab-btn.btn-tab-reset:hover {
  background: #fef2f2;
}

/* ---------- ADMIN FORM STYLES ---------- */
.admin-form-container {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 32px;
  box-shadow: var(--shadow);
}

.admin-form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.admin-form-header h2 {
  font-size: 24px;
  margin-bottom: 6px;
}

.admin-form-header p {
  color: var(--ink-2);
  font-size: 14.5px;
}

.admin-form-grid {
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 36px;
}

@media (max-width: 1080px) {
  .admin-form-grid {
    grid-template-columns: 1fr;
  }
}

.form-fieldset {
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 1px dashed var(--line);
}

.form-fieldset h3 {
  font-size: 18px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
}

.field-hint {
  font-size: 13.5px;
  color: var(--ink-2);
  margin-bottom: 16px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}

.field-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-col label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}

.field-col input,
.field-col select,
.field-col textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  color: var(--ink);
  font-size: 14.5px;
  font-family: inherit;
  transition: border-color .2s, box-shadow .2s;
}

.field-col input:focus,
.field-col select:focus,
.field-col textarea:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(61, 78, 216, 0.12);
}

/* Amenity Picker */
.amenity-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.amenity-chip-btn {
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 13px;
  font-family: inherit;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 99px;
  cursor: pointer;
  transition: all .18s;
}

.amenity-chip-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}

.amenity-chip-btn.selected {
  background: var(--tint);
  border-color: var(--brand);
  color: var(--brand);
  font-weight: 600;
}

.add-custom-amenity {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.add-custom-amenity input {
  flex: 1;
  padding: 9px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  color: var(--ink);
  font-size: 13.5px;
  font-family: inherit;
}

/* Photo Upload Zone */
.upload-dropzone {
  border: 2px dashed var(--line);
  border-radius: 14px;
  background: var(--tint);
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color .2s, background .2s;
  margin-bottom: 16px;
}

.upload-dropzone:hover {
  border-color: var(--brand);
  background: color-mix(in srgb, var(--tint) 80%, var(--brand) 20%);
}

.upload-dropzone-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.upload-icon svg {
  width: 32px;
  height: 32px;
  color: var(--brand);
}

.upload-dropzone-label b {
  font-size: 15px;
  color: var(--ink);
}

.upload-dropzone-label span {
  font-size: 13px;
  color: var(--ink-2);
}

.uploading-text {
  font-size: 13px;
  color: var(--brand);
  font-weight: 600;
  margin-top: 10px;
}

.add-photo-url-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.add-photo-url-row input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  color: var(--ink);
  font-size: 13.5px;
  font-family: inherit;
}

.stock-samples-box {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 18px;
}

.stock-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-2);
  display: block;
  margin-bottom: 8px;
}

.stock-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.stock-btn {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
}

.stock-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}

/* Photo Thumbnail Grid */
.photo-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.photo-thumb-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--line);
  aspect-ratio: 4/3;
  background: var(--tint);
}

.photo-thumb-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--gold);
  color: #000;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .3);
}

.thumb-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .75);
  display: flex;
  justify-content: space-between;
  padding: 4px 6px;
  backdrop-filter: blur(4px);
}

.btn-thumb-cover {
  background: none;
  border: none;
  color: #fff;
  font-size: 10.5px;
  cursor: pointer;
  padding: 2px 4px;
  font-weight: 600;
}

.btn-thumb-cover:hover {
  color: var(--gold);
}

.btn-thumb-del {
  background: rgba(239, 68, 68, .8);
  border: none;
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.btn-thumb-del:hover {
  background: #dc2626;
}

/* Submit row */
.form-submit-row {
  display: flex;
  gap: 14px;
  margin-top: 24px;
}

.btn-submit-pg {
  font-size: 16px;
  padding: 14px 28px;
}

.form-error-banner {
  background: #fee2e2;
  color: #b91c1c;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 22px;
  border: 1px solid #fecaca;
}

/* Live Preview Side */
.preview-sticky-wrap {
  position: sticky;
  top: 96px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.preview-badge {
  background: var(--tint);
  color: var(--brand);
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 99px;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.preview-header small {
  color: var(--ink-2);
  font-size: 12px;
}

/* ---------- PROPERTIES MANAGEMENT TABLE ---------- */
.manage-pgs-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.manage-pgs-header h3 {
  font-size: 22px;
  margin-bottom: 4px;
}

.manage-pgs-header p {
  color: var(--ink-2);
  font-size: 14px;
}

.admin-properties-table-wrap {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow-x: auto;
  box-shadow: var(--shadow);
}

.admin-properties-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
  min-width: 800px;
}

.admin-properties-table th {
  background: var(--bg);
  padding: 14px 18px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: .05em;
  border-bottom: 1px solid var(--line);
}

.admin-properties-table td {
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.admin-properties-table tr:hover {
  background: var(--tint);
}

.prop-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.table-prop-thumb {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  flex: none;
}

.prop-cell b {
  display: block;
  font-size: 15px;
  color: var(--ink);
}

.prop-cell small {
  color: var(--ink-2);
  font-size: 12.5px;
}

.table-dep {
  display: block;
  font-size: 12px;
  color: var(--ink-2);
}

.table-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}

.table-badge.audience {
  background: var(--tint);
  color: var(--brand);
}

.table-badge.free {
  background: #dcfce7;
  color: #15803d;
}

.table-badge.full {
  background: #fef3c7;
  color: #b45309;
}

.table-vac-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.vac-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--bg);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all .15s;
}

.vac-btn:hover {
  border-color: var(--brand);
  color: var(--brand);
}

.photo-count-badge {
  font-size: 12.5px;
  color: var(--ink-2);
  font-weight: 500;
}

.table-action-btns {
  display: flex;
  gap: 8px;
}

.btn-action-edit {
  background: var(--tint);
  border: 1px solid var(--line);
  color: var(--brand);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}

.btn-action-edit:hover {
  background: var(--brand);
  color: #fff;
}

.btn-action-del {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
}

.btn-action-del:hover {
  background: #dc2626;
  color: #fff;
}

/* Card Admin Bar on Public PG Cards */
.card-admin-bar {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.card-admin-vacancy {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-2);
}

.card-admin-vacancy b {
  color: var(--ink);
}

.btn-vac-adjust {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: var(--tint);
  border: 1px solid var(--line);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.card-admin-btns {
  display: flex;
  gap: 6px;
}

.btn-admin-edit,
.btn-admin-del {
  background: none;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all .15s;
}

.btn-admin-edit {
  color: var(--brand);
}

.btn-admin-edit:hover {
  background: var(--tint);
}

.btn-admin-del {
  color: #ef4444;
}

.btn-admin-del:hover {
  background: #fef2f2;
}

/* ---------- PGS PAGE ADMIN STRIP ---------- */
.pgs-admin-strip {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-shadow: var(--shadow);
}

.pgs-admin-strip-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--ink);
}

.strip-badge {
  background: var(--tint);
  color: var(--brand);
  font-weight: 700;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 99px;
  letter-spacing: .03em;
}

/* Filter row and sorting */
.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--ink-2);
}

.sort-dropdown select {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--card);
  color: var(--ink);
  font-size: 13.5px;
  font-family: inherit;
}

.results-count-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--ink-2);
}

.btn-reset-filters {
  background: none;
  border: none;
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.no-results-box {
  background: var(--card);
  border: 1px dashed var(--line);
  border-radius: var(--r);
  padding: 60px 24px;
  text-align: center;
  max-width: 500px;
  margin: 30px auto;
}

.no-res-icon {
  font-size: 40px;
  margin-bottom: 14px;
}

.no-results-box h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.no-results-box p {
  color: var(--ink-2);
  font-size: 14.5px;
  margin-bottom: 20px;
}

/* Search bar enhancements */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  display: grid;
  place-items: center;
  color: var(--ink-2);
  pointer-events: none;
}

.search-wrap input {
  width: 100%;
  padding: 14px 44px 14px 46px;
  border: 1px solid var(--line);
  border-radius: 99px;
  background: var(--card);
  color: var(--ink);
  font-size: 15px;
  font-family: inherit;
  box-shadow: var(--shadow);
  transition: all .2s;
}

.search-wrap input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 4px rgba(61, 78, 216, 0.15);
}

.search-clear-btn {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--ink-2);
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

/* ---------- GALLERY CATEGORY TABS ---------- */
.gallery-cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.cat-tab-btn {
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink-2);
  font-size: 13.5px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 99px;
  cursor: pointer;
  transition: all .2s;
}

.cat-tab-btn:hover {
  color: var(--ink);
  border-color: var(--brand);
}

.cat-tab-btn.active {
  background: var(--grad-btn);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(61, 78, 216, 0.3);
}

/* Lightbox Enhancements */
.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .8);
}

.lightbox-caption {
  margin-top: 14px;
  text-align: center;
  color: #fff;
}

.lightbox-caption h4 {
  font-size: 17px;
  margin-bottom: 4px;
}

.lightbox-caption p {
  font-size: 13.5px;
  color: rgba(255, 255, 255, .75);
}

/* ---------- TOAST NOTIFICATIONS ---------- */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  background: var(--card);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, .2);
  font-size: 14.5px;
  font-weight: 500;
  animation: toastSlideUp .3s cubic-bezier(.2, .8, .3, 1) both;
  max-width: 380px;
}

@keyframes toastSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-icon {
  font-size: 18px;
  flex: none;
}

.toast-success {
  border-left: 4px solid #22c55e;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-info {
  border-left: 4px solid var(--brand);
}

/* ---------- MODAL DIALOG ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(16, 20, 38, .7);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 20px;
  animation: fadeIn .2s ease;
}

.modal-box {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  animation: modalScale .25s cubic-bezier(.2, .8, .3, 1) both;
}

@keyframes modalScale {
  from {
    opacity: 0;
    transform: scale(.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-box h3 {
  font-size: 22px;
  margin-bottom: 12px;
}

.modal-box p {
  color: var(--ink-2);
  font-size: 15px;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-del-confirm {
  background: #dc2626;
  color: #fff;
  border: none;
  font-size: 14.5px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 99px;
  cursor: pointer;
  transition: background .2s;
}

.btn-del-confirm:hover {
  background: #b91c1c;
}

/* Reviews slider single card */
.rev-slider-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  padding: 36px 32px;
  max-width: 680px;
  margin: 0 auto 20px;
  box-shadow: var(--shadow);
  text-align: center;
  transition: all .3s;
}

.rev-quote {
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink);
  margin: 18px 0 24px;
  font-style: italic;
}

.rev-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.rev-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand);
}

.rev-user {
  text-align: left;
}

.rev-user b {
  display: block;
  font-size: 15px;
  color: var(--ink);
}

.rev-user span {
  font-size: 12.5px;
  color: var(--ink-2);
}

.rev-badge {
  display: inline-block;
  font-size: 11px;
  color: #16a34a;
  background: #dcfce7;
  padding: 2px 7px;
  border-radius: 99px;
  font-weight: 600;
  margin-left: 4px;
}

/* Fix mobile nav height clearance */
@media (max-width: 640px) {
  .site-foot {
    padding-bottom: 90px;
  }
  .toast-notification {
    bottom: 80px;
    right: 15px;
    left: 15px;
    max-width: none;
  }
}
`;

fs.writeFileSync(targetCssPath, baseCss + '\n' + additionalCss, 'utf8');
console.log('Successfully generated src/index.css');
