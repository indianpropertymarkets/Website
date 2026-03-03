// ============================================
//  Listing Wizard — Multi-Step Orchestrator
// ============================================

import { STEP_CONFIG } from './formConfig.js';
import { listingState } from './listingState.js';
import { validateStep } from './validation.js';
import { calculateScore, getScoreLabel } from './propertyScore.js';
import { submitToSheet } from '../sheets.js';
import { notifyAdmin } from '../whatsapp.js';

// Step renderers
import { renderStepIntent } from './steps/stepIntent.js';
import { renderStepLocation } from './steps/stepLocation.js';
import { renderStepProfile } from './steps/stepProfile.js';
import { renderStepPricing } from './steps/stepPricing.js';
import { renderStepAmenities } from './steps/stepAmenities.js';
import { renderStepMedia } from './steps/stepMedia.js';
import { renderStepAdditional } from './steps/stepAdditional.js';
import { renderStepReview } from './steps/stepReview.js';

const STEP_RENDERERS = [
    renderStepIntent,
    renderStepLocation,
    renderStepProfile,
    renderStepPricing,
    renderStepAmenities,
    renderStepMedia,
    renderStepAdditional,
    (container, opts) => renderStepReview(container, opts),
];

export function renderListingWizard(appContainer) {
    // Init state
    const hasDraft = listingState.init();

    appContainer.innerHTML = `
    <div class="page-wrapper no-pad">
      <!-- Page Header -->
      <div class="page-header listing-header">
        <div class="container">
          <span class="section-badge" style="border-color:rgba(212,168,67,0.4);color:#d4a843;background:rgba(212,168,67,0.15)">Post Property</span>
          <h1>List Your Property</h1>
          <p>Create a detailed listing that attracts serious buyers</p>
        </div>
      </div>

      ${hasDraft ? `
        <div class="draft-banner" id="draftBanner">
          <div class="container draft-banner-inner">
            <span>📝 You have an unsaved draft from earlier</span>
            <div class="draft-banner-actions">
              <button class="btn btn-sm btn-primary" id="resumeDraftBtn">Resume Draft</button>
              <button class="btn btn-sm btn-outline" id="clearDraftBtn">Start Fresh</button>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="section" style="padding-top: 0;">
        <div class="container">
          <div class="listing-wizard" id="listingWizard">
            <!-- Sidebar / Progress -->
            <aside class="wizard-sidebar" id="wizardSidebar">
              <div class="wizard-progress-header">
                <div class="wizard-progress-bar">
                  <div class="wizard-progress-fill" id="wizProgressFill"></div>
                </div>
                <span class="wizard-progress-text" id="wizProgressText">0%</span>
              </div>
              <nav class="wizard-step-list" id="wizStepList">
                ${STEP_CONFIG.map((step, i) => `
                  <button class="wizard-step-item" data-step="${i}" id="wizStepItem${i}">
                    <span class="wizard-step-number">${i + 1}</span>
                    <span class="wizard-step-icon">${step.icon}</span>
                    <span class="wizard-step-title">${step.title}</span>
                    <span class="wizard-step-check">✓</span>
                  </button>
                `).join('')}
              </nav>
            </aside>

            <!-- Content -->
            <div class="wizard-content">
              <div class="wizard-content-header" id="wizContentHeader"></div>
              <div class="wizard-step-content" id="wizStepContent"></div>
              
              <!-- Validation Errors Summary -->
              <div class="wizard-errors" id="wizErrors" style="display:none;"></div>

              <!-- Navigation -->
              <div class="wizard-nav" id="wizNav">
                <button class="btn btn-outline" id="wizPrevBtn">← Previous</button>
                <div class="wizard-nav-right">
                  <button class="btn btn-outline" id="wizSaveDraftBtn">💾 Save Draft</button>
                  <button class="btn btn-primary btn-lg" id="wizNextBtn">Next →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div class="form-success" id="listingSuccess">
        <div class="success-icon">🎉</div>
        <h3>Property Listed Successfully!</h3>
        <p>Your property listing has been submitted. Our team will review and publish it shortly.</p>
        <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a href="#/" class="btn btn-outline">← Back to Home</a>
          <button class="btn btn-primary" id="listNewBtn">List Another Property</button>
        </div>
      </div>
    </div>
  `;

    // ── Bind Draft Banner ──
    if (hasDraft) {
        const banner = document.getElementById('draftBanner');
        document.getElementById('resumeDraftBtn')?.addEventListener('click', () => {
            banner.style.display = 'none';
            goToStep(listingState.currentStep);
        });
        document.getElementById('clearDraftBtn')?.addEventListener('click', () => {
            listingState.reset();
            banner.style.display = 'none';
            goToStep(0);
        });

        // Auto-resume
        goToStep(listingState.currentStep);
    } else {
        goToStep(0);
    }

    // ── Step Navigation ──
    document.getElementById('wizPrevBtn')?.addEventListener('click', () => {
        if (listingState.currentStep > 0) goToStep(listingState.currentStep - 1);
    });

    document.getElementById('wizNextBtn')?.addEventListener('click', () => {
        const currentIdx = listingState.currentStep;

        // Review step → Submit
        if (currentIdx === STEP_CONFIG.length - 1) {
            handleSubmit();
            return;
        }

        // Validate current step
        const stepConfig = STEP_CONFIG[currentIdx];
        const { valid, errors } = validateStep(stepConfig, listingState.getAll(), listingState.files);

        if (!valid) {
            showErrors(errors);
            // Also highlight inline errors
            Object.entries(errors).forEach(([fieldName, msg]) => {
                const errorEl = document.getElementById(`error-${fieldName}`);
                if (errorEl) {
                    errorEl.textContent = msg;
                    errorEl.style.display = 'block';
                }
            });
            return;
        }

        hideErrors();
        goToStep(currentIdx + 1);
    });

    document.getElementById('wizSaveDraftBtn')?.addEventListener('click', () => {
        listingState.saveDraft();
        const btn = document.getElementById('wizSaveDraftBtn');
        btn.textContent = '✅ Saved!';
        setTimeout(() => (btn.textContent = '💾 Save Draft'), 2000);
    });

    // ── Step sidebar clicks ──
    document.querySelectorAll('.wizard-step-item').forEach((item) => {
        item.addEventListener('click', () => {
            const targetIdx = parseInt(item.dataset.step);
            // Allow going back freely, but validate for going forward
            if (targetIdx <= listingState.currentStep) {
                goToStep(targetIdx);
            } else {
                // Must validate all steps up to target
                let canGo = true;
                for (let i = listingState.currentStep; i < targetIdx; i++) {
                    const { valid } = validateStep(STEP_CONFIG[i], listingState.getAll(), listingState.files);
                    if (!valid) {
                        canGo = false;
                        goToStep(i);
                        const { errors } = validateStep(STEP_CONFIG[i], listingState.getAll(), listingState.files);
                        showErrors(errors);
                        break;
                    }
                }
                if (canGo) goToStep(targetIdx);
            }
        });
    });

    // ── List New Property ──
    document.getElementById('listNewBtn')?.addEventListener('click', () => {
        listingState.reset();
        document.getElementById('listingSuccess').classList.remove('show');
        document.getElementById('listingWizard').style.display = '';
        goToStep(0);
    });
}

function goToStep(idx) {
    listingState.currentStep = idx;
    const stepConfig = STEP_CONFIG[idx];
    const contentEl = document.getElementById('wizStepContent');
    const headerEl = document.getElementById('wizContentHeader');

    // Update header
    headerEl.innerHTML = `
    <div class="wizard-content-step-info">
      <span class="wizard-content-step-number">Step ${idx + 1} of ${STEP_CONFIG.length}</span>
      <h2>${stepConfig.icon} ${stepConfig.title}</h2>
      <p>${stepConfig.description}</p>
    </div>
  `;

    // Render step content
    contentEl.style.opacity = '0';
    contentEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
        contentEl.innerHTML = '';
        STEP_RENDERERS[idx](contentEl, { onGoToStep: goToStep });
        contentEl.style.opacity = '1';
        contentEl.style.transform = 'translateY(0)';
    }, 120);

    // Update sidebar
    updateSidebar(idx);

    // Update nav buttons
    updateNavButtons(idx);

    // Update progress
    updateProgress();

    hideErrors();

    // Scroll to top of wizard
    document.getElementById('listingWizard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSidebar(activeIdx) {
    STEP_CONFIG.forEach((_, i) => {
        const item = document.getElementById(`wizStepItem${i}`);
        if (!item) return;
        item.classList.remove('active', 'completed');
        if (i === activeIdx) item.classList.add('active');
        if (i < activeIdx) {
            const { valid } = validateStep(STEP_CONFIG[i], listingState.getAll(), listingState.files);
            if (valid) item.classList.add('completed');
        }
    });
}

function updateNavButtons(idx) {
    const prevBtn = document.getElementById('wizPrevBtn');
    const nextBtn = document.getElementById('wizNextBtn');

    if (prevBtn) prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';

    if (nextBtn) {
        if (idx === STEP_CONFIG.length - 1) {
            nextBtn.textContent = '🚀 Submit Listing';
            nextBtn.className = 'btn btn-gold btn-lg';
        } else {
            nextBtn.textContent = 'Next →';
            nextBtn.className = 'btn btn-primary btn-lg';
        }
    }
}

function updateProgress() {
    const state = listingState.getAll();
    const files = listingState.files;
    const { score } = calculateScore(state, files);
    const stepProgress = Math.round(((listingState.currentStep + 1) / STEP_CONFIG.length) * 100);

    const fill = document.getElementById('wizProgressFill');
    const text = document.getElementById('wizProgressText');
    if (fill) fill.style.width = `${stepProgress}%`;
    if (text) text.textContent = `${stepProgress}%`;
}

function showErrors(errors) {
    const errEl = document.getElementById('wizErrors');
    if (!errEl) return;
    errEl.style.display = 'block';
    errEl.innerHTML = `
    <div class="wizard-error-summary">
      <strong>⚠️ Please fix the following:</strong>
      <ul>
        ${Object.entries(errors).map(([, msg]) => `<li>${msg}</li>`).join('')}
      </ul>
    </div>
  `;
}

function hideErrors() {
    const errEl = document.getElementById('wizErrors');
    if (errEl) errEl.style.display = 'none';
}

async function handleSubmit() {
    const nextBtn = document.getElementById('wizNextBtn');
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Submitting...';
    }

    // Submit to Google Sheets
    const payload = listingState.toSubmissionPayload();
    await submitToSheet('Sellers', payload);

    // WhatsApp notification
    const s = listingState.getAll();
    const price = s.expectedPrice ? `₹${Number(s.expectedPrice).toLocaleString('en-IN')}` : (s.expectedRent ? `₹${Number(s.expectedRent).toLocaleString('en-IN')}/mo` : 'N/A');
    const msg = `🏷️ *New Property Listed*\n\n📋 ${s.listingFor} | ${s.category} | ${s.propertyType}\n📍 ${s.locality || ''}, ${s.city || ''}\n💰 ${price}\n📐 ${s.carpetArea || '—'} sq ft ${s.bhk || ''}\n📸 ${listingState.files.length} images`;
    notifyAdmin(msg);

    // Show success
    listingState.clearDraft();
    document.getElementById('listingWizard').style.display = 'none';
    document.getElementById('listingSuccess').classList.add('show');
}
