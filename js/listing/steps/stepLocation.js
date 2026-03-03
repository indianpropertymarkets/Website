// ============================================
//  Step 2: Location Details
// ============================================

import { getStepById, getVisibleFields } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepLocation(container) {
    const step = getStepById('location');
    const state = listingState.getAll();
    const fields = getVisibleFields(step, state);

    container.innerHTML = `
    <div class="wizard-step-inner">
      <div class="form-row">
        ${renderSelect(fields.find((f) => f.name === 'state'), state)}
        ${renderInput(fields.find((f) => f.name === 'city'), state)}
      </div>
      <div class="form-row">
        ${renderInput(fields.find((f) => f.name === 'locality'), state)}
        ${renderInput(fields.find((f) => f.name === 'subLocality'), state)}
      </div>
      <div class="form-row">
        ${renderInput(fields.find((f) => f.name === 'landmark'), state)}
        ${renderInput(fields.find((f) => f.name === 'pincode'), state)}
      </div>
      ${renderInput(fields.find((f) => f.name === 'projectName'), state)}
      ${renderMapPlaceholder()}
    </div>
  `;

    bindInputs(container);
}

function renderInput(field, state) {
    if (!field) return '';
    const val = state[field.name] || '';
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <input type="${field.type === 'number' ? 'number' : 'text'}"
             class="form-input" name="${field.name}" value="${val}"
             placeholder="${field.placeholder || ''}"
             ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
             ${field.required ? 'required' : ''} />
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderSelect(field, state) {
    if (!field) return '';
    const val = state[field.name] || '';
    const options = field.options || [];
    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      <select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>
        <option value="" disabled ${!val ? 'selected' : ''}>Select ${field.label.toLowerCase()}</option>
        ${options.map((o) => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderMapPlaceholder() {
    return `
    <div class="map-placeholder">
      <div class="map-placeholder-inner">
        <span class="map-icon">📍</span>
        <p>Map pin selection</p>
        <span class="coming-soon-badge">Coming Soon — Google Maps Integration Ready</span>
      </div>
    </div>
  `;
}

function bindInputs(container) {
    container.querySelectorAll('input, select').forEach((el) => {
        const event = el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(event, () => {
            listingState.set(el.name, el.value);
        });
    });
}
