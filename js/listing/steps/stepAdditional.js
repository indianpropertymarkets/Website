// ============================================
//  Step 7: Additional Details
// ============================================

import { getStepById, getVisibleFields, getFieldOptions } from '../formConfig.js';
import { listingState } from '../listingState.js';

export function renderStepAdditional(container) {
    const step = getStepById('additional');
    const state = listingState.getAll();
    const fields = getVisibleFields(step, state);

    container.innerHTML = `
    <div class="wizard-step-inner">
      ${fields.map((f) => renderAdditionalField(f, state)).join('')}
    </div>
  `;

    bindInteractions(container);
}

function renderAdditionalField(field, state) {
    if (field.type === 'textarea') return renderTextarea(field, state);
    if (field.type === 'chip-input') return renderChipInput(field, state);
    if (field.type === 'checkbox-grid') return renderCheckboxGrid(field, state);
    if (field.type === 'select') return renderSelect(field, state);
    return '';
}

function renderTextarea(field, state) {
    const val = state[field.name] || '';
    const charCount = val.length;
    const minLen = field.minLength || 0;
    const isShort = minLen && charCount < minLen;

    return `
    <div class="form-group">
      <label class="form-label">
        ${field.label}
        ${field.required ? '<span class="required">*</span>' : '<span class="optional-tag">optional</span>'}
      </label>
      ${field.note ? `<div class="field-hint">${field.note}</div>` : ''}
      <textarea class="form-textarea" name="${field.name}"
                placeholder="${field.placeholder || ''}"
                style="min-height:140px;">${val}</textarea>
      ${minLen ? `
        <div class="char-counter ${isShort ? 'warning' : 'ok'}">
          ${charCount}/${minLen} characters ${isShort ? '— keep going!' : '✓'}
        </div>
      ` : ''}
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderChipInput(field, state) {
    const chips = state[field.name] || [];
    const suggestions = field.suggestions || [];

    return `
    <div class="wizard-field-group">
      <label class="wizard-field-label">
        ${field.label}
        <span class="selected-count">${chips.length} added</span>
      </label>
      <div class="chip-input-wrapper">
        <div class="chip-list">
          ${chips.map((chip, i) => `
            <span class="chip">
              ${chip}
              <button class="chip-remove" data-field="${field.name}" data-index="${i}">✕</button>
            </span>
          `).join('')}
        </div>
        <input type="text" class="form-input chip-text-input" id="chipInput_${field.name}"
               placeholder="${field.placeholder || 'Type and press Enter'}" data-field="${field.name}" />
      </div>
      ${suggestions.length > 0 ? `
        <div class="chip-suggestions">
          ${suggestions
                .filter((s) => !chips.includes(s))
                .slice(0, 8)
                .map((s) => `<button class="chip-suggestion" data-field="${field.name}" data-value="${s}">${s}</button>`)
                .join('')}
        </div>
      ` : ''}
      <div class="field-error" id="error-${field.name}"></div>
    </div>
  `;
}

function renderCheckboxGrid(field, state) {
    const selected = state[field.name] || [];
    const options = getFieldOptions(field, state);
    return `
    <div class="wizard-field-group">
      <label class="wizard-field-label">
        ${field.label}
        <span class="selected-count">${selected.length} selected</span>
      </label>
      <div class="checkbox-grid compact">
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
    </div>
  `;
}

function renderSelect(field, state) {
    const val = state[field.name] || '';
    return `
    <div class="form-group">
      <label class="form-label">${field.label} <span class="optional-tag">optional</span></label>
      <select class="form-select" name="${field.name}">
        <option value="" disabled ${!val ? 'selected' : ''}>Select</option>
        ${(field.options || []).map((o) => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>
  `;
}

function bindInteractions(container) {
    // Textareas
    container.querySelectorAll('textarea').forEach((el) => {
        el.addEventListener('input', () => {
            listingState.set(el.name, el.value);
            const counter = el.closest('.form-group')?.querySelector('.char-counter');
            if (counter) {
                const minLen = 200;
                const len = el.value.length;
                counter.textContent = `${len}/${minLen} characters ${len < minLen ? '— keep going!' : '✓'}`;
                counter.className = `char-counter ${len < minLen ? 'warning' : 'ok'}`;
            }
        });
    });

    // Selects
    container.querySelectorAll('select').forEach((el) => {
        el.addEventListener('change', () => listingState.set(el.name, el.value));
    });

    // Chip input — Enter key
    container.querySelectorAll('.chip-text-input').forEach((input) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const fieldName = input.dataset.field;
                const val = input.value.trim();
                if (!val) return;
                const current = listingState.get(fieldName) || [];
                if (!current.includes(val)) {
                    listingState.set(fieldName, [...current, val]);
                    renderStepAdditional(container);
                }
                input.value = '';
            }
        });
    });

    // Chip remove
    container.querySelectorAll('.chip-remove').forEach((btn) => {
        btn.addEventListener('click', () => {
            const fieldName = btn.dataset.field;
            const idx = parseInt(btn.dataset.index);
            const current = listingState.get(fieldName) || [];
            current.splice(idx, 1);
            listingState.set(fieldName, [...current]);
            renderStepAdditional(container);
        });
    });

    // Chip suggestions
    container.querySelectorAll('.chip-suggestion').forEach((btn) => {
        btn.addEventListener('click', () => {
            const fieldName = btn.dataset.field;
            const val = btn.dataset.value;
            const current = listingState.get(fieldName) || [];
            if (!current.includes(val)) {
                listingState.set(fieldName, [...current, val]);
                renderStepAdditional(container);
            }
        });
    });

    // Checkbox grid
    container.querySelectorAll('.checkbox-card').forEach((card) => {
        card.addEventListener('click', () => {
            const fieldName = card.dataset.field;
            const value = card.dataset.value;
            const current = listingState.get(fieldName) || [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            listingState.set(fieldName, updated);
            renderStepAdditional(container);
        });
    });
}
