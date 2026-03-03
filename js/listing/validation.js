// ============================================
//  Validation Engine — Per-Step Field Validation
// ============================================

import { getVisibleFields } from './formConfig.js';

/**
 * Validate all visible fields in a step
 * @param {Object} stepConfig - step object from STEP_CONFIG
 * @param {Object} state - current listing state
 * @param {File[]} files - selected files (for media step)
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateStep(stepConfig, state, files = []) {
    const errors = {};
    const visibleFields = getVisibleFields(stepConfig, state);

    for (const field of visibleFields) {
        const value = state[field.name];
        const error = validateField(field, value, state, files);
        if (error) errors[field.name] = error;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Validate a single field
 */
function validateField(field, value, state, files) {
    // Required check
    if (field.required) {
        if (field.type === 'file-upload') {
            const min = field.minCount || 1;
            if (files.length < min) return `Please upload at least ${min} images`;
        } else if (field.type === 'checkbox-grid') {
            if (!value || !Array.isArray(value) || value.length === 0) return `Please select at least one option`;
        } else if (field.type === 'chip-input') {
            if (!value || !Array.isArray(value) || value.length === 0) return `Please add at least one item`;
        } else {
            if (value === undefined || value === null || value === '') return `${field.label} is required`;
        }
    }

    // Skip further checks if empty and not required
    if (value === undefined || value === null || value === '') return null;

    // Type-specific validations
    if (field.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) return 'Please enter a valid number';
        if (field.min !== undefined && num < field.min) return `Minimum value is ${field.min}`;
        if (field.max !== undefined && num > field.max) return `Maximum value is ${field.max}`;
    }

    if (field.type === 'text' || field.type === 'textarea') {
        if (field.minLength && String(value).length < field.minLength) {
            return `Minimum ${field.minLength} characters required (${String(value).length}/${field.minLength})`;
        }
        if (field.maxLength && String(value).length > field.maxLength) {
            return `Maximum ${field.maxLength} characters allowed`;
        }
    }

    if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(String(value))) return `Please enter a valid ${field.label.toLowerCase()}`;
    }

    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            return 'Please enter a valid URL';
        }
    }

    // Special field validators
    if (field.name === 'pincode' && value) {
        if (!/^\d{6}$/.test(value)) return 'Pincode must be 6 digits';
    }

    return null;
}

/**
 * Check if a step is complete (all required fields filled, no errors)
 */
export function isStepComplete(stepConfig, state, files = []) {
    return validateStep(stepConfig, state, files).valid;
}
