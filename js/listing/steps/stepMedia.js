// ============================================
//  Step 6: Media Upload — Images, Video, Tour
// ============================================

import { listingState } from '../listingState.js';

export function renderStepMedia(container) {
    const state = listingState.getAll();
    const files = listingState.files;
    const minRequired = 5;
    const maxAllowed = 15;

    container.innerHTML = `
    <div class="wizard-step-inner">
      <!-- Image Upload -->
      <div class="wizard-field-group">
        <label class="wizard-field-label">
          Property Images <span class="required">*</span>
          <span class="selected-count">${files.length}/${maxAllowed}</span>
        </label>
        ${files.length < minRequired ? `
          <div class="media-warning">
            <span>⚠️</span> Minimum ${minRequired} images required — ${files.length} uploaded
          </div>
        ` : `
          <div class="media-success">
            <span>✅</span> ${files.length} images uploaded
          </div>
        `}
        <div class="file-upload-area" id="wizUploadArea">
          <div class="upload-icon">📸</div>
          <p>Drag & drop images here or <span>browse files</span></p>
          <p style="font-size:0.78rem;margin-top:6px;color:var(--text-lighter);">
            JPG, PNG, WebP — Min ${minRequired}, Max ${maxAllowed} images • Recommended 800×600+
          </p>
          <input type="file" id="wizFileInput" accept="image/jpeg,image/png,image/webp" multiple style="display:none" />
        </div>
        ${files.length > 0 ? `
          <div class="file-preview-grid" id="wizFilePreview">
            ${files.map((_, i) => `
              <div class="file-preview-item" data-index="${i}">
                <img id="wizPreview${i}" alt="Preview ${i + 1}" />
                <button class="remove-file" data-index="${i}">✕</button>
                <span class="file-index">${i + 1}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="field-error" id="error-images"></div>
      </div>

      <!-- Video -->
      <div class="form-group">
        <label class="form-label">Video Link <span class="optional-tag">optional</span></label>
        <input type="url" class="form-input" name="videoUrl" value="${state.videoUrl || ''}"
               placeholder="https://youtube.com/watch?v=..." />
        <div class="field-hint">Add a YouTube or Vimeo link to showcase your property</div>
      </div>

      <!-- Virtual Tour -->
      <div class="form-group">
        <label class="form-label">Virtual Tour Link <span class="optional-tag">optional</span></label>
        <input type="url" class="form-input" name="virtualTourUrl" value="${state.virtualTourUrl || ''}"
               placeholder="https://..." />
      </div>

      <!-- Voice Note -->
      <div class="form-group">
        <label class="form-label">
          Voice Description <span class="optional-tag">optional</span>
        </label>
        <div class="voice-placeholder">
          <span>🎙️</span>
          <p>Voice recording feature coming soon</p>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
        <textarea class="form-textarea" name="voiceNote" placeholder="In the meantime, describe your property in your own words here..."
                  style="margin-top:12px;">${state.voiceNote || ''}</textarea>
      </div>
    </div>
  `;

    bindMediaInteractions(container, files, maxAllowed);
}

function bindMediaInteractions(container, files, maxAllowed) {
    const uploadArea = container.querySelector('#wizUploadArea');
    const fileInput = container.querySelector('#wizFileInput');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            addFiles(e.dataTransfer.files, container, maxAllowed);
        });

        fileInput.addEventListener('change', () => {
            addFiles(fileInput.files, container, maxAllowed);
        });
    }

    // Load previews for existing files
    files.forEach((file, i) => {
        const img = container.querySelector(`#wizPreview${i}`);
        if (img) {
            const reader = new FileReader();
            reader.onload = (e) => (img.src = e.target.result);
            reader.readAsDataURL(file);
        }
    });

    // Remove buttons
    container.querySelectorAll('.remove-file').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            const updated = [...listingState.files];
            updated.splice(idx, 1);
            listingState.files = updated;
            renderStepMedia(container);
        });
    });

    // Text inputs
    container.querySelectorAll('input[type="url"], textarea').forEach((el) => {
        el.addEventListener('input', () => listingState.set(el.name, el.value));
    });
}

function addFiles(fileList, container, maxAllowed) {
    const current = listingState.files;
    const remaining = maxAllowed - current.length;
    const newFiles = Array.from(fileList).slice(0, remaining);
    listingState.files = [...current, ...newFiles];
    renderStepMedia(container);
}
