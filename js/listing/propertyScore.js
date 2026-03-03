// ============================================
//  Property Score — Completeness & Quality Score
// ============================================

import { STEP_CONFIG, getVisibleFields } from './formConfig.js';

/**
 * Calculate property listing completeness score
 * @param {Object} state - current listing state
 * @param {File[]} files - uploaded images
 * @returns {{ score: number, breakdown: Object, suggestions: string[] }}
 */
export function calculateScore(state, files = []) {
    const breakdown = {
        requiredFields: 0,
        photos: 0,
        description: 0,
        amenities: 0,
        pricing: 0,
        additional: 0,
    };
    const suggestions = [];

    // ── 1. Required Fields (40%) ──
    let totalRequired = 0;
    let filledRequired = 0;

    for (const step of STEP_CONFIG) {
        if (step.id === 'review') continue;
        const visible = getVisibleFields(step, state);
        for (const field of visible) {
            if (field.required) {
                totalRequired++;
                const val = state[field.name];
                if (field.type === 'file-upload') {
                    if (files.length >= (field.minCount || 1)) filledRequired++;
                } else if (field.type === 'checkbox-grid' || field.type === 'chip-input') {
                    if (Array.isArray(val) && val.length > 0) filledRequired++;
                } else {
                    if (val !== undefined && val !== null && val !== '') filledRequired++;
                }
            }
        }
    }

    breakdown.requiredFields = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 40) : 40;
    if (filledRequired < totalRequired) {
        suggestions.push(`Fill all required fields (${filledRequired}/${totalRequired} complete)`);
    }

    // ── 2. Photos (20%) ──
    const photoCount = files.length;
    const idealPhotos = 5;
    breakdown.photos = Math.min(20, Math.round((photoCount / idealPhotos) * 20));
    if (photoCount < 5) suggestions.push(`Upload at least 5 property images (${photoCount}/5)`);
    if (photoCount === 0) suggestions.push('Properties with photos get 10x more views');

    // ── 3. Description (10%) ──
    const desc = state.description || '';
    const descLen = desc.length;
    if (descLen >= 200) {
        breakdown.description = 10;
    } else if (descLen > 0) {
        breakdown.description = Math.round((descLen / 200) * 10);
        suggestions.push(`Add more detail to description (${descLen}/200 chars)`);
    } else {
        suggestions.push('Add a property description (minimum 200 characters)');
    }

    // ── 4. Amenities (10%) ──
    const amenities = state.amenities || [];
    const idealAmenities = 5;
    breakdown.amenities = Math.min(10, Math.round((amenities.length / idealAmenities) * 10));
    if (amenities.length < 5) {
        suggestions.push(`Select more amenities (${amenities.length}/5+ recommended)`);
    }

    // ── 5. Pricing (10%) ──
    let pricingScore = 0;
    if (state.expectedPrice || state.expectedRent) pricingScore += 5;
    if (state.ownershipType) pricingScore += 2;
    if (state.availableFrom) pricingScore += 2;
    if (state.priceNegotiable) pricingScore += 1;
    breakdown.pricing = Math.min(10, pricingScore);
    if (pricingScore < 8) suggestions.push('Complete all pricing & ownership details');

    // ── 6. Additional Details (10%) ──
    let additionalScore = 0;
    if (state.uspHighlights && state.uspHighlights.length > 0) additionalScore += 3;
    else suggestions.push('Add USP highlights to stand out');
    if (state.connectivity) additionalScore += 3;
    else suggestions.push('Add connectivity & transport details');
    if (state.nearbyFacilities && state.nearbyFacilities.length > 0) additionalScore += 2;
    if (state.reasonForSelling) additionalScore += 1;
    if (state.videoUrl) additionalScore += 1;
    breakdown.additional = Math.min(10, additionalScore);

    const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return { score: Math.min(100, score), breakdown, suggestions };
}

/**
 * Get score label and color
 */
export function getScoreLabel(score) {
    if (score >= 90) return { label: 'Excellent', color: '#27ae60', tier: 'excellent' };
    if (score >= 70) return { label: 'Good', color: '#2ecc71', tier: 'good' };
    if (score >= 50) return { label: 'Average', color: '#f39c12', tier: 'average' };
    if (score >= 30) return { label: 'Needs Work', color: '#e67e22', tier: 'needs-work' };
    return { label: 'Poor', color: '#e74c3c', tier: 'poor' };
}
