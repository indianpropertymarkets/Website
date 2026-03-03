// ============================================
//  Step 5: Amenities — Checkbox Grid
// ============================================

import { getStepById, getVisibleFields, getFieldOptions } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepAmenities(container) {
    const step = getStepById('amenities');
    const state = listingState.getAll();
    const fields = getVisibleFields(step, state);

    container.innerHTML = `
    <div class="wizard-step-inner">
      ${fields.map((f) => renderAmenityField(f, state)).join('')}
    </div>
  `;

    bindInteractions(container);
}

function renderAmenityField(field, state) {
    if (field.type === 'checkbox-grid') {
        const selected = state[field.name] || [];
        const options = getFieldOptions(field, state);
        return `
      <div class="wizard-field-group">
        <label class="wizard-field-label">
          ${field.label}
          <span class="selected-count">${selected.length} selected</span>
        </label>
        <div class="checkbox-grid">
          ${options.map((opt) => {
            const val = opt.value || opt;
            const isChecked = selected.includes(val);
            return `
              <div class="checkbox-card ${isChecked ? 'active' : ''}"
                   data-field="${field.name}" data-value="${val}">
                ${opt.icon ? `<span class="checkbox-card-icon">${opt.icon}</span>` : ''}
                <span class="checkbox-card-label">${val}</span>
                <span class="checkbox-indicator">${isChecked ? '✓' : ''}</span>
              </div>
            `;
        }).join('')}
        </div>
        <div class="field-error" id="error-${field.name}"></div>
      </div>
    `;
    }

    if (field.type === 'select') {
        const val = state[field.name] || '';
        return `
      <div class="form-group">
        <label class="form-label">${field.label}</label>
        <select class="form-select" name="${field.name}">
          <option value="" disabled ${!val ? 'selected' : ''}>Select</option>
          ${(field.options || []).map((o) => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      </div>
    `;
    }

    return '';
}

function bindInteractions(container) {
    container.querySelectorAll('.checkbox-card').forEach((card) => {
        card.addEventListener('click', () => {
            const fieldName = card.dataset.field;
            const value = card.dataset.value;
            const current = listingState.get(fieldName) || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            listingState.set(fieldName, updated);
            renderStepAmenities(container);
        });
    });

    container.querySelectorAll('select').forEach((el) => {
        el.addEventListener('change', () => listingState.set(el.name, el.value));
    });
}
