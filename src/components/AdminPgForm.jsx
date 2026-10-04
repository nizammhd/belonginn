/* ===========================================================
   AdminPgForm.jsx — Admin Form to Add / Edit PG Details & Photos
   =========================================================== */
import React, { useState } from 'react';
import { usePg } from '../context/PgContext';
import { COMMON_AMENITIES, SAMPLE_STOCK_PHOTOS } from '../data/initialData';
import { Icons } from '../data/icons';
import PgCard from './PgCard';
import { assetUrl } from '../data/assetUrl';

export default function AdminPgForm({ initialData = null, onComplete, onCancel }) {
  const { addPg, updatePg, setActiveTab } = usePg();

  const isEditing = Boolean(initialData && initialData.id);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    audience: initialData?.audience || 'Boys',
    area: initialData?.area || '',
    address: initialData?.address || '',
    landmark: initialData?.landmark || '',
    rent: initialData?.rent || 8500,
    deposit: initialData?.deposit || 15000,
    sharing: initialData?.sharing || '2 & 3 sharing',
    food: initialData?.food || 'Veg + non-veg',
    notice: initialData?.notice || '1 month',
    vacancy: initialData?.vacancy ?? 3,
    mapLink: initialData?.mapLink || '',
    amenities: initialData?.amenities || [
      'High-Speed Wi-Fi',
      'Home-Cooked Food',
      '24/7 Power Backup',
      'Daily Housekeeping',
      '24-Hour Hot Water',
      'Washing Machine'
    ],
    photos: initialData?.photos || ['assets/room1.jpg', 'assets/room2.jpg']
  });

  const [customAmenity, setCustomAmenity] = useState('');
  const [urlPhotoInput, setUrlPhotoInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // Toggle predefined amenity
  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item]
      };
    });
  };

  // Add custom amenity
  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (!formData.amenities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, trimmed]
      }));
    }
    setCustomAmenity('');
  };

  // Handle local file uploads (FileReader -> Base64 data URL)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    const readPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises)
      .then((results) => {
        const validPhotos = results.filter(Boolean);
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...validPhotos]
        }));
        setIsUploading(false);
      })
      .catch(() => {
        setIsUploading(false);
        setErrorMsg('Error reading uploaded image files. Please try again.');
      });
  };

  // Add photo via URL
  const handleAddPhotoUrl = (e) => {
    e.preventDefault();
    const url = urlPhotoInput.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, url]
    }));
    setUrlPhotoInput('');
  };

  // Add stock photo
  const handleAddStockPhoto = (stockUrl) => {
    if (!formData.photos.includes(stockUrl)) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, stockUrl]
      }));
    }
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Make photo the cover (first index)
  const handleSetCoverPhoto = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const selected = prev.photos[index];
      const others = prev.photos.filter((_, i) => i !== index);
      return {
        ...prev,
        photos: [selected, ...others]
      };
    });
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter a Property Name.');
      return;
    }
    if (!formData.area.trim()) {
      setErrorMsg('Please specify the Kerala area or locality for this property.');
      return;
    }
    if (formData.photos.length === 0) {
      setErrorMsg('Please add at least one photo for this PG.');
      return;
    }

    setErrorMsg('');

    if (isEditing) {
      updatePg(initialData.id, formData);
      if (onComplete) onComplete();
    } else {
      addPg(formData);
      if (onComplete) {
        onComplete();
      } else {
        // Automatically switch to Our PGs page so admin sees it live!
        setActiveTab('pgs');
      }
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <div>
          <h2>{isEditing ? 'Edit PG Property' : 'Add New PG Property'}</h2>
          <p>
            {isEditing
              ? 'Update the PG specifications, amenities, and photos.'
              : 'Add details and photos for a new PG. It will immediately appear in the Our PGs section!'}
          </p>
        </div>
        {onCancel && (
          <button type="button" className="btn btn-line" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="form-error-banner" role="alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form-grid">
        <div className="admin-inputs-col">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="form-fieldset">
            <h3>1. Basic Information</h3>

            <div className="field-row">
              <div className="field-col">
                <label htmlFor="pg-name">Property Name *</label>
                <input
                  id="pg-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Kerala PG | Kakkanad"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-col">
                <label htmlFor="pg-audience">Audience / Resident Type *</label>
                <select
                  id="pg-audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                >
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Boys & Girls">Boys & Girls (Coliving)</option>
                  <option value="Working Professionals">Working Professionals</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field-col">
                <label htmlFor="pg-area">Area / Locality *</label>
                <input
                  id="pg-area"
                  name="area"
                  type="text"
                  placeholder="e.g. Kakkanad, Kochi"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-col">
                <label htmlFor="pg-landmark">Nearest Landmark *</label>
                <input
                  id="pg-landmark"
                  name="landmark"
                  type="text"
                  placeholder="e.g. 200m from Metro Station"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-col">
              <label htmlFor="pg-address">Detailed Address</label>
              <textarea
                id="pg-address"
                name="address"
                rows="2"
                placeholder="Kakkanad, Kochi, Kerala"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="field-col">
              <label htmlFor="pg-map">Google Maps Link (Optional)</label>
              <input
                id="pg-map"
                name="mapLink"
                type="url"
                placeholder="https://maps.google.com/?q=..."
                value={formData.mapLink}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 2: PRICING & ROOM SPECS */}
          <div className="form-fieldset">
            <h3>2. Pricing & Stay Terms</h3>

            <div className="field-row">
              <div className="field-col">
                <label htmlFor="pg-rent">Monthly Rent (₹) *</label>
                <input
                  id="pg-rent"
                  name="rent"
                  type="number"
                  min="1000"
                  step="500"
                  placeholder="8500"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-col">
                <label htmlFor="pg-deposit">Security Deposit (₹) *</label>
                <input
                  id="pg-deposit"
                  name="deposit"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="15000"
                  value={formData.deposit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-col">
                <label htmlFor="pg-sharing">Room Sharing Types *</label>
                <input
                  id="pg-sharing"
                  name="sharing"
                  type="text"
                  placeholder="e.g. Single, 2 & 3 sharing"
                  value={formData.sharing}
                  onChange={handleChange}
                />
              </div>

              <div className="field-col">
                <label htmlFor="pg-food">Food Service *</label>
                <input
                  id="pg-food"
                  name="food"
                  type="text"
                  placeholder="e.g. Veg + non-veg (2 meals/day)"
                  value={formData.food}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-col">
                <label htmlFor="pg-notice">Notice Period</label>
                <input
                  id="pg-notice"
                  name="notice"
                  type="text"
                  placeholder="e.g. 1 month / 15 days"
                  value={formData.notice}
                  onChange={handleChange}
                />
              </div>

              <div className="field-col">
                <label htmlFor="pg-vacancy">Available Beds (0 for Waitlist)</label>
                <input
                  id="pg-vacancy"
                  name="vacancy"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.vacancy}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: AMENITIES */}
          <div className="form-fieldset">
            <h3>3. Facilities & Amenities Included</h3>
            <p className="field-hint">
              Click tags to select/deselect the amenities provided at this property:
            </p>

            <div className="amenity-picker">
              {COMMON_AMENITIES.map((item) => {
                const isSelected = formData.amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`amenity-chip-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleAmenity(item)}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="add-custom-amenity">
              <input
                type="text"
                placeholder="Or type a custom amenity (e.g. Snooker Table, Cafeteria)"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomAmenity(e);
                }}
              />
              <button
                type="button"
                className="btn btn-line"
                onClick={handleAddCustomAmenity}
              >
                + Add
              </button>
            </div>
          </div>

          {/* SECTION 4: PHOTO MANAGEMENT */}
          <div className="form-fieldset">
            <h3>4. Property Photos & Gallery</h3>
            <p className="field-hint">
              Upload photos from your computer or choose from high-resolution property presets.
              The first photo is used as the cover on the card.
            </p>

            {/* UPLOAD FILE ZONE */}
            <div className="upload-dropzone">
              <input
                id="photo-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload-input" className="upload-dropzone-label">
                <div className="upload-icon">{Icons.upload}</div>
                <b>Click to upload photos from device</b>
                <span>Supports JPG, PNG, WebP (multiple files allowed)</span>
              </label>
              {isUploading && <p className="uploading-text">Processing photos…</p>}
            </div>

            {/* ADD VIA URL */}
            <div className="add-photo-url-row">
              <input
                type="text"
                placeholder="Or paste an image URL (https://... or assets/room1.jpg)"
                value={urlPhotoInput}
                onChange={(e) => setUrlPhotoInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-line"
                onClick={handleAddPhotoUrl}
              >
                Add URL
              </button>
            </div>

            {/* STOCK SAMPLES SHORTCUT */}
            <div className="stock-samples-box">
              <span className="stock-label">Quick Stock Presets:</span>
              <div className="stock-buttons">
                {SAMPLE_STOCK_PHOTOS.map((stock) => (
                  <button
                    key={stock.url}
                    type="button"
                    className="stock-btn"
                    onClick={() => handleAddStockPhoto(stock.url)}
                    title={`Add ${stock.label}`}
                  >
                    + {stock.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PHOTO THUMBNAIL LIST */}
            {formData.photos.length > 0 && (
              <div className="photo-preview-grid">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-thumb-card">
                    <img
                      src={assetUrl(photo)}
                      alt={`Upload preview ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/room-hero.png';
                      }}
                    />
                    {index === 0 && <span className="cover-badge">Cover</span>}
                    <div className="thumb-actions">
                      {index !== 0 && (
                        <button
                          type="button"
                          className="btn-thumb-cover"
                          onClick={() => handleSetCoverPhoto(index)}
                          title="Set as cover photo"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-thumb-del"
                        onClick={() => handleRemovePhoto(index)}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORM ACTIONS */}
          <div className="form-submit-row">
            <button type="submit" className="btn btn-grad btn-submit-pg">
              {isEditing ? 'Save Changes' : 'Publish Property to Website'}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-line" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* LIVE PREVIEW COLUMN */}
        <div className="admin-preview-col">
          <div className="preview-sticky-wrap">
            <div className="preview-header">
              <span className="preview-badge">Live Card Preview</span>
              <small>How it appears in "Our PGs"</small>
            </div>

            <PgCard
              pg={{
                id: 'preview-pg',
                name: formData.name || 'Kerala PG | Property Name',
                audience: formData.audience,
                area: formData.area || 'Locality Name',
                landmark: formData.landmark || 'Nearby Landmark',
                rent: formData.rent || 8000,
                deposit: formData.deposit || 15000,
                sharing: formData.sharing || '2 & 3 sharing',
                food: formData.food || 'Veg + non-veg',
                notice: formData.notice || '1 month',
                vacancy: formData.vacancy ?? 2,
                photos: formData.photos.length > 0 ? formData.photos : ['assets/room1.jpg'],
                amenities: formData.amenities,
                mapLink: formData.mapLink
              }}
              showAdminActions={false}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
