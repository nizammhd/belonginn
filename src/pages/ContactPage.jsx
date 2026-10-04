/* ===========================================================
   ContactPage.jsx — Contact Details & WhatsApp Enquiry Form
   =========================================================== */
import React, { useState } from 'react';
import { usePg } from '../context/PgContext';
import { Icons, waLink } from '../data/icons';
import Breadcrumbs from '../components/Breadcrumbs';
import AmbientScene from '../components/AmbientScene';

export default function ContactPage() {
  const { company, pgs } = usePg();

  const [formData, setFormData] = useState({
    name: '',
    property: '',
    date: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const chosenPg = formData.property || 'Any property';
    const moveDate = formData.date || 'Not specified';
    const notes = formData.note.trim() || 'Please share room details and availability.';

    const message = `Hi ${company.name},
My name is ${formData.name.trim()}.
• Property of interest: ${chosenPg}
• Planned move-in date: ${moveDate}
• Requirements / Notes: ${notes}`;

    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);

    const url = waLink(company.whatsapp, message);
    window.open(url, '_blank');
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <AmbientScene />
        <div className="wrap hero-in">
          <Breadcrumbs page="contact" />
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 50px)' }}>Talk to us</h1>
          <p>
            Fill this in and it opens WhatsApp with your enquiry already typed.
            Or simply call our central helpline.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="pad wrap" style={{ paddingTop: 44, marginBottom: 60 }}>
        <div className="contact-grid">
          {/* INFO SIDE */}
          <div>
            <div className="info">
              <div>
                <span>CENTRAL HELPLINE</span>
                <b>
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`}>
                    {company.phone}
                  </a>
                </b>
              </div>
              <div>
                <span>EMAIL SUPPORT</span>
                <b>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </b>
              </div>
              <div>
                <span>REGISTERED OFFICE</span>
                <b>{company.office}</b>
              </div>
              <div>
                <span>WORKING HOURS</span>
                <b>{company.hours}</b>
              </div>
            </div>

            <p style={{ marginTop: 22, color: 'var(--ink-2)', fontSize: '15px' }}>
              Visits are welcome without a prior appointment, but a quick message on WhatsApp
              helps us ensure a manager is on-site to give you a tour.
            </p>
          </div>

          {/* FORM SIDE */}
          <div className="form">
            <h3 style={{ fontSize: '20px', marginBottom: 6 }}>
              Enquire about a room
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', marginBottom: 20 }}>
              Takes 10 seconds · Direct response from our property managers
            </p>

            <form onSubmit={handleSend}>
              <div className="field-grp">
                <label htmlFor="contact-name">Your Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Akansha Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : formData.name ? 'valid' : ''}
                />
                {errors.name && <span className="field-err show">{errors.name}</span>}
              </div>

              <div className="field-grp">
                <label htmlFor="contact-pick">Which Property</label>
                <select
                  id="contact-pick"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                >
                  <option value="">Any property / Not sure yet</option>
                  {pgs.map((pg) => (
                    <option key={pg.id} value={pg.name}>
                      {pg.name} ({pg.area})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-grp">
                <label htmlFor="contact-date">Planning to move in</label>
                <input
                  id="contact-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="field-grp">
                <label htmlFor="contact-note">Anything else</label>
                <textarea
                  id="contact-note"
                  name="note"
                  rows="3"
                  placeholder="Looking for 2 sharing with AC, budget around ₹9,000..."
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>

              {success && (
                <div className="form-success show">
                  Opening WhatsApp with your message.
                </div>
              )}

              <button type="submit" className="btn btn-wa" style={{ width: '100%', justifyContent: 'center' }}>
                {Icons.whatsapp} Send on WhatsApp
              </button>
              <small style={{ display: 'block', marginTop: 10, textAlign: 'center', color: 'var(--ink-2)' }}>
                No slow email ticketing. This opens your WhatsApp app with the message ready.
              </small>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
