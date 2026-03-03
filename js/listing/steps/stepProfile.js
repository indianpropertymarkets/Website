// ============================================
//  Step 3: Property Profile — Conditional Fields
// ============================================

import { getStepById, getVisibleFields, getFieldOptions } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepProfile(container) {
    const step = getStepById('profile');
    const state = listingState.getAll();
    const fields = getVisibleFields(step, state);

    const categoryLabel = state.category === 'Commercial' ? 'Commercial Property Details' : 'Residential Property Details';

    container.innerHTML = `
    <div class="wizard-step-inner">
      <div class="step-category-badge">${state.category === 'Commercial' ? '🏢' : '🏡'} ${categoryLabel}</div>
      ${fields.map((f) => renderProfileField(f, state)).join('')}
    </div>
  `;

    bindInteractions(container);
}

function renderProfileField(field, state) {
    if (field.type === 'radio-cards') return renderRadioCards(field, state);
    if (field.type === 'select') return renderSelect(field, state);
    if (field.type === 'number') return renderNumber(field, state);
    return '';
}

function renderRadioCards(field, state) {
    const options = getFieldOptions(field, state);
    const currentValue = state[field.name] || '';
    return `
    <div class="wizard-field-group">
      <label class="wizard-field-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : ''}
      </label>
      <div class="radio-card-grid columns-${field.columns || options.length}">
        ${options.map((opt) => `
          <div class="radio-card compact ${currentValue === (opt.value || opt) ? 'active' : ''}"
               data-field="${field.name}" data-value="${opt.value || opt}">
            ${opt.icon ? `<span class="radio-card-icon">${opt.icon}</span>` : ''}
            <span class="radio-card-label">${opt.label || opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderSelect(field, state) {
    const val = state[field.name] || '';
    const options = field.options || [];
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>
        <option value="" disabled ${!val ? 'selected' : ''}>Select</option>
        ${options.map((o) => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderNumber(field, state) {
    const val = state[field.name] || '';
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <input type="number" class="form-input" name="${field.name}" value="${val}"
             placeholder="${field.placeholder || ''}"
             ${field.min !== undefined ? `min="${field.min}"` : ''}
             ${field.required ? 'required' : ''} />
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function bindInteractions(container) {
    // Radio cards
    container.querySelectorAll('.radio-card').forEach((card) => {
        card.addEventListener('click', () => {
            listingState.set(card.dataset.field, card.dataset.value);
            renderStepProfile(container);
        });
    });
    // Inputs & selects
    container.querySelectorAll('input, select').forEach((el) => {
        const event = el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(event, () => listingState.set(el.name, el.value));
    });
}
