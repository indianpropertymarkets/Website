// ============================================
//  SELLER PAGE — Property Listing Form
// ============================================
import { submitToSheet } from '../sheets.js';
import { notifyAdmin } from '../whatsapp.js';

export function renderSeller(container) {
    container.innerHTML = `
    <div class="page-wrapper no-pad">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <span class="section-badge" style="border-color:rgba(212,168,67,0.4);color:#d4a843;background:rgba(212,168,67,0.15)">Seller</span>
          <h1>List Your Property for Sale</h1>
          <p>Reach verified, serious buyers through our trusted broker network.</p>
        </div>
      </div>

      <!-- Form -->
      <div class="section" style="padding-top:0;">
        <div class="form-container anim-fade-up">
          <form id="sellerForm">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Owner Name <span class="required">*</span></label>
                <input type="text" class="form-input" name="ownerName" placeholder="Enter owner's full name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number <span class="required">*</span></label>
                <input type="tel" class="form-input" name="phone" placeholder="+91 98765 43210" required pattern="[0-9+\\s-]{10,15}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email <span style="color:var(--text-lighter);font-weight:400">(optional)</span></label>
              <input type="email" class="form-input" name="email" placeholder="your@email.com" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Property Type <span class="required">*</span></label>
                <select class="form-select" name="propertyType" required>
                  <option value="" disabled selected>Select property type</option>
                  <option value="Land">Land</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial Building</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Category <span class="required">*</span></label>
                <select class="form-select" name="category" required>
                  <option value="" disabled selected>Select category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Property Location <span class="required">*</span></label>
              <input type="text" class="form-input" name="location" placeholder="Full address or area, city" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Property Size <span class="required">*</span></label>
                <input type="text" class="form-input" name="size" placeholder="e.g. 1200 sq ft, 2 BHK" required />
              </div>
              <div class="form-group">
                <label class="form-label">Expected Selling Price <span class="required">*</span></label>
                <input type="text" class="form-input" name="price" placeholder="e.g. ₹85 Lakh, ₹1.2 Cr" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Property Description</label>
              <textarea class="form-textarea" name="description" placeholder="Describe your property — features, amenities, nearby landmarks, age, floor, facing direction, etc."></textarea>
            </div>

            <!-- Image Upload -->
            <div class="form-group">
              <label class="form-label">Property Images <span style="color:var(--text-lighter);font-weight:400">(up to 5 images)</span></label>
              <div class="file-upload-area" id="uploadArea">
                <div class="upload-icon">📷</div>
                <p>Drag & drop images here or <span>browse files</span></p>
                <p style="font-size:0.78rem;margin-top:4px;color:var(--text-lighter);">JPG, PNG — Max 5 images, 5MB each</p>
                <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" multiple style="display:none" />
              </div>
              <div class="file-preview-grid" id="filePreview"></div>
            </div>

            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <button type="submit" class="btn btn-gold btn-lg" id="sellerSubmitBtn">
                List My Property →
              </button>
              <button type="button" class="btn btn-whatsapp btn-lg" id="sellerWhatsappBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </button>
            </div>
          </form>

          <!-- Success State -->
          <div class="form-success" id="sellerSuccess">
            <div class="success-icon">🎉</div>
            <h3>Property Listed Successfully!</h3>
            <p>Our team will review your listing and start matching you with verified buyers. We'll contact you shortly.</p>
            <div style="margin-top:24px;">
              <a href="#/" class="btn btn-outline">← Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    // ---- Image Upload Logic ----
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewGrid = document.getElementById('filePreview');
    let selectedFiles = [];

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        const remaining = 5 - selectedFiles.length;
        const newFiles = Array.from(files).slice(0, remaining);
        selectedFiles = [...selectedFiles, ...newFiles];
        renderPreviews();
    }

    function renderPreviews() {
        previewGrid.innerHTML = '';
        selectedFiles.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'file-preview-item';
                div.innerHTML = `
          <img src="${e.target.result}" alt="Preview" />
          <button class="remove-file" data-index="${i}">✕</button>
        `;
                previewGrid.appendChild(div);

                div.querySelector('.remove-file').addEventListener('click', () => {
                    selectedFiles.splice(i, 1);
                    renderPreviews();
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // ---- Form Submission ----
    const form = document.getElementById('sellerForm');
    const successDiv = document.getElementById('sellerSuccess');
    const submitBtn = document.getElementById('sellerSubmitBtn');
    const whatsappBtn = document.getElementById('sellerWhatsappBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const fd = new FormData(form);
        const values = [
            fd.get('ownerName'),
            fd.get('phone'),
            fd.get('email') || '',
            fd.get('propertyType'),
            fd.get('category'),
            fd.get('location'),
            fd.get('size'),
            fd.get('price'),
            fd.get('description') || '',
            selectedFiles.length > 0 ? `${selectedFiles.length} image(s) attached` : 'No images',
        ];

        await submitToSheet('Sellers', values);

        // WhatsApp notification
        const msg = `🏷️ *New Property Listed*%0A%0A👤 Owner: ${fd.get('ownerName')}%0A📞 Phone: ${fd.get('phone')}%0A🏗️ Type: ${fd.get('propertyType')} (${fd.get('category')})%0A📍 Location: ${fd.get('location')}%0A📐 Size: ${fd.get('size')}%0A💰 Price: ${fd.get('price')}`;
        notifyAdmin(decodeURIComponent(msg));

        form.style.display = 'none';
        successDiv.classList.add('show');
    });

    whatsappBtn.addEventListener('click', () => {
        const fd = new FormData(form);
        const owner = fd.get('ownerName') || 'Not provided';
        const phone = fd.get('phone') || 'Not provided';
        const type = fd.get('propertyType') || 'Not selected';
        const location = fd.get('location') || 'Not provided';
        const price = fd.get('price') || 'Not provided';

        const msg = `Hi, I'd like to list my property for sale.%0A%0A👤 Owner: ${owner}%0A📞 Phone: ${phone}%0A🏗️ Type: ${type}%0A📍 Location: ${location}%0A💰 Price: ${price}`;
        notifyAdmin(decodeURIComponent(msg));
    });
}
