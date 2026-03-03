// ============================================
//  Step 1: Intent — Listing Purpose & Property Type
// ============================================

import { getStepById, getFieldOptions } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepIntent(container) {
    const step = getStepById('intent');
    const state = listingState.getAll();

    container.innerHTML = `
    <div class="wizard-step-inner">
      ${step.fields.map((field) => renderField(field, state)).join('')}
    </div>
  `;

    // Bind interactions
    container.querySelectorAll('.radio-card').forEach((card) => {
        card.addEventListener('click', () => {
            const name = card.dataset.field;
            const value = card.dataset.value;
            listingState.set(name, value);

            // Clear dependent fields when parent changes
            if (name === 'category') listingState.set('propertyType', '');

            reRender(container);
        });
    });
}

function reRender(container) {
    renderStepIntent(container);
}

function renderField(field, state) {
    const options = getFieldOptions(field, state);
    if (field.type === 'radio-cards' && options.length === 0) return '';

    const currentValue = state[field.name] || '';

    return `
    <div class="wizard-field-group">
      <label class="wizard-field-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : ''}
      </label>
      <div class="radio-card-grid columns-${field.columns || options.length}">
        ${options
            .map(
                (opt) => `
          <div class="radio-card ${currentValue === (opt.value || opt) ? 'active' : ''}"
               data-field="${field.name}" data-value="${opt.value || opt}">
            ${opt.icon ? `<span class="radio-card-icon">${opt.icon}</span>` : ''}
            <span class="radio-card-label">${opt.label || opt}</span>
            ${opt.desc ? `<span class="radio-card-desc">${opt.desc}</span>` : ''}
          </div>
        `
            )
            .join('')}
      </div>
    </div>
  `;
}
