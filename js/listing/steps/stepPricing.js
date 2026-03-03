// ============================================
//  Step 4: Pricing & Ownership
// ============================================

import { getStepById, getVisibleFields, getFieldOptions } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepPricing(container) {
    const step = getStepById('pricing');
    const state = listingState.getAll();
    const fields = getVisibleFields(step, state);

    container.innerHTML = `
    <div class="wizard-step-inner">
      ${fields.map((f) => renderPricingField(f, state)).join('')}
    </div>
  `;

    bindInteractions(container);
}

function renderPricingField(field, state) {
    if (field.type === 'radio-cards') return renderRadioCards(field, state);
    if (field.type === 'select') return renderSelect(field, state);
    if (field.type === 'number') return renderNumberWithFormat(field, state);
    if (field.type === 'date') return renderDate(field, state);
    return '';
}

function renderRadioCards(field, state) {
    const options = getFieldOptions(field, state);
    const currentValue = state[field.name] || '';
    return `
    <div class="wizard-field-group">
      <label class="wizard-field-label">${field.label}</label>
      <div class="radio-card-grid columns-${field.columns || 2}">
        ${options.map((opt) => `
          <div class="radio-card compact ${currentValue === opt.value ? 'active' : ''}"
               data-field="${field.name}" data-value="${opt.value}">
            <span class="radio-card-label">${opt.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSelect(field, state) {
    const val = state[field.name] || '';
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <select class="form-select" name="${field.name}">
        <option value="" disabled ${!val ? 'selected' : ''}>Select</option>
        ${(field.options || []).map((o) => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderNumberWithFormat(field, state) {
    const val = state[field.name] || '';
    const displayVal = val ? Number(val).toLocaleString('en-IN') : '';
    const isPrice = field.name.includes('Price') || field.name.includes('price') || field.name.includes('Rent') || field.name.includes('rent') || field.name.includes('Amount') || field.name.includes('Deposit') || field.name.includes('Charges') || field.name.includes('maintenance');
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <div class="input-with-prefix">
        ${isPrice ? '<span class="input-prefix">₹</span>' : ''}
        <input type="number" class="form-input ${isPrice ? 'has-prefix' : ''}" name="${field.name}" value="${val}"
               placeholder="${field.placeholder || ''}"
               ${field.min !== undefined ? `min="${field.min}"` : ''}
               ${field.required ? 'required' : ''} />
      </div>
      ${val && isPrice ? `<div class="price-words">${formatIndianPrice(Number(val))}</div>` : ''}
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderDate(field, state) {
    const val = state[field.name] || '';
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <input type="date" class="form-input" name="${field.name}" value="${val}"
             ${field.required ? 'required' : ''} />
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function formatIndianPrice(num) {
    if (!num || isNaN(num)) return '';
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Crore`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    if (num >= 1000) return `₹ ${(num / 1000).toFixed(1)} Thousand`;
    return `₹ ${num}`;
}

function bindInteractions(container) {
    container.querySelectorAll('.radio-card').forEach((card) => {
        card.addEventListener('click', () => {
            listingState.set(card.dataset.field, card.dataset.value);
            renderStepPricing(container);
        });
    });
    container.querySelectorAll('input, select').forEach((el) => {
        const event = el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(event, () => {
            listingState.set(el.name, el.value);
            // Re-render for conditional fields (currentlyRented → currentRent)
            if (el.name === 'currentlyRented') renderStepPricing(container);
            // Update price display
            if (el.type === 'number') {
                const wordsEl = el.closest('.form-group')?.querySelector('.price-words');
                if (wordsEl) wordsEl.textContent = formatIndianPrice(Number(el.value));
            }
        });
    });
}
