// ============================================
//  CONTACT PAGE
// ============================================
import { submitToSheet } from '../sheets.js';
import { notifyAdmin } from '../whatsapp.js';

export function renderContact(container) {
    container.innerHTML = `
    <div class="page-wrapper no-pad">
      <div class="page-header">
        <div class="container">
          <span class="section-badge" style="border-color:rgba(39,174,96,0.3)">Reach Us</span>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch today.</p>
        </div>
      </div>

      <section class="section" style="padding-top:0;">
        <div class="container">
          <div class="contact-grid" style="margin-top:-2rem;position:relative;z-index:2;">
            <!-- Contact Info -->
            <div class="contact-info-cards anim-fade-up">
              <div class="contact-info-card">
                <div class="info-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                  <p style="font-size:0.82rem;color:var(--text-lighter);">Mon – Sat, 9 AM – 7 PM</p>
                </div>
              </div>
              <div class="contact-info-card">
                <div class="info-icon" style="background:var(--gold-light);">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@indiapropertymarkets.com</p>
                  <p style="font-size:0.82rem;color:var(--text-lighter);">We respond within 24 hours</p>
                </div>
              </div>
              <div class="contact-info-card">
                <div class="info-icon" style="background:rgba(52,152,219,0.12);">📍</div>
                <div>
                  <h4>Office Address</h4>
                  <p>123 Property Hub, Andheri West</p>
                  <p style="font-size:0.82rem;color:var(--text-lighter);">Mumbai, Maharashtra 400058</p>
                </div>
              </div>
              <div class="contact-info-card" style="border-color:#25D366;background:rgba(37,211,102,0.04);">
                <div class="info-icon" style="background:rgba(37,211,102,0.12);">💬</div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>Chat with us instantly</p>
                  <a href="https://wa.me/919876543210" target="_blank" class="btn btn-whatsapp btn-sm" style="margin-top:8px;">
                    Chat Now →
                  </a>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="anim-fade-up delay-1">
              <div class="card" style="padding:var(--gap-2xl);">
                <h3 style="margin-bottom:var(--gap-lg);">Send Us a Message</h3>
                <form id="contactForm">
                  <div class="form-group">
                    <label class="form-label">Full Name <span class="required">*</span></label>
                    <input type="text" class="form-input" name="fullName" placeholder="Your name" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone Number <span class="required">*</span></label>
                    <input type="tel" class="form-input" name="phone" placeholder="+91 98765 43210" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" name="email" placeholder="your@email.com" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Subject</label>
                    <input type="text" class="form-input" name="subject" placeholder="How can we help?" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Message <span class="required">*</span></label>
                    <textarea class="form-textarea" name="message" placeholder="Type your message..." required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-lg" id="contactSubmitBtn" style="width:100%;">
                    Send Message →
                  </button>
                </form>

                <div class="form-success" id="contactSuccess">
                  <div class="success-icon">📨</div>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you within 24 hours. Thank you for reaching out.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

    // ---- Form Submission ----
    const form = document.getElementById('contactForm');
    const successDiv = document.getElementById('contactSuccess');
    const submitBtn = document.getElementById('contactSubmitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const fd = new FormData(form);
        const values = [
            fd.get('fullName'),
            fd.get('phone'),
            fd.get('email') || '',
            fd.get('subject') || '',
            fd.get('message'),
        ];

        await submitToSheet('Contacts', values);

        const msg = `📨 *New Contact Message*%0A%0A👤 ${fd.get('fullName')}%0A📞 ${fd.get('phone')}%0A📝 ${fd.get('message')}`;
        notifyAdmin(decodeURIComponent(msg));

        form.style.display = 'none';
        successDiv.classList.add('show');
    });
}
