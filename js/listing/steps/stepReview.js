// ============================================
//  Step 8: Review & Preview — Final Review
// ============================================

import { STEP_CONFIG, getVisibleFields } from '../formConfig.js';
import { listingState } from '../listingState.js';
import { calculateScore, getScoreLabel } from '../propertyScore.js';
import { isStepComplete } from '../validation.js';

export function renderStepReview(container, { onGoToStep }) {
    const state = listingState.getAll();
    const files = listingState.files;
    const { score, breakdown, suggestions } = calculateScore(state, files);
    const scoreInfo = getScoreLabel(score);

    container.innerHTML = `
    <div class="wizard-step-inner review-step">
      <!-- Score Gauge -->
      <div class="review-score-section">
        <div class="score-gauge" style="--score: ${score}; --score-color: ${scoreInfo.color}">
          <svg viewBox="0 0 120 120" class="score-ring">
            <circle cx="60" cy="60" r="52" class="score-ring-bg"/>
            <circle cx="60" cy="60" r="52" class="score-ring-fill" 
                    style="stroke-dashoffset: ${326.7 - (326.7 * score) / 100}"/>
          </svg>
          <div class="score-value">${score}%</div>
        </div>
        <div class="score-label-text" style="color: ${scoreInfo.color}">${scoreInfo.label}</div>
        <p class="score-hint">Property listings with higher scores get 5x more views</p>
      </div>

      ${suggestions.length > 0 ? `
        <div class="review-suggestions">
          <h4>💡 Improve Your Score</h4>
          <ul>
            ${suggestions.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Preview Sections -->
      ${renderPreviewSections(state, files, onGoToStep)}

      <!-- Score Breakdown -->
      <div class="review-breakdown">
        <h4>📊 Score Breakdown</h4>
        <div class="breakdown-bars">
          ${Object.entries(breakdown).map(([key, val]) => {
        const maxes = { requiredFields: 40, photos: 20, description: 10, amenities: 10, pricing: 10, additional: 10 };
        const max = maxes[key] || 10;
        const pct = Math.round((val / max) * 100);
        const labels = { requiredFields: 'Required Fields', photos: 'Photos', description: 'Description', amenities: 'Amenities', pricing: 'Pricing', additional: 'Additional Info' };
        return `
              <div class="breakdown-row">
                <span class="breakdown-label">${labels[key] || key}</span>
                <div class="breakdown-bar">
                  <div class="breakdown-bar-fill" style="width:${pct}%"></div>
                </div>
                <span class="breakdown-val">${val}/${max}</span>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    </div>
  `;

    // Edit buttons
    container.querySelectorAll('.review-edit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const stepIdx = parseInt(btn.dataset.step);
            if (onGoToStep) onGoToStep(stepIdx);
        });
    });
}

function renderPreviewSections(state, files, onGoToStep) {
    const sections = [
        {
            stepIndex: 0, title: '🎯 Intent', items: [
                { label: 'Listing For', value: state.listingFor },
                { label: 'Category', value: state.category },
                { label: 'Property Type', value: state.propertyType },
            ]
        },
        {
            stepIndex: 1, title: '📍 Location', items: [
                { label: 'Location', value: [state.locality, state.subLocality, state.city, state.state].filter(Boolean).join(', ') },
                { label: 'Pincode', value: state.pincode },
                { label: 'Project', value: state.projectName },
                { label: 'Landmark', value: state.landmark },
            ]
        },
        {
            stepIndex: 2, title: '🏗️ Property Profile', items: [
                state.category === 'Residential' && { label: 'Configuration', value: state.bhk },
                { label: 'Carpet Area', value: state.carpetArea ? `${state.carpetArea} sq ft` : '' },
                state.builtUpArea && { label: 'Built-up Area', value: `${state.builtUpArea} sq ft` },
                { label: 'Property Age', value: state.propertyAge },
                state.furnishing && { label: 'Furnishing', value: state.furnishing },
                state.facing && { label: 'Facing', value: state.facing },
                state.floorNumber && { label: 'Floor', value: `${state.floorNumber} of ${state.totalFloors || '—'}` },
                state.parking && { label: 'Parking', value: state.parking },
            ].filter(Boolean)
        },
        {
            stepIndex: 3, title: '💰 Pricing', items: [
                state.expectedPrice && { label: 'Price', value: `₹ ${Number(state.expectedPrice).toLocaleString('en-IN')}` },
                state.expectedRent && { label: 'Rent', value: `₹ ${Number(state.expectedRent).toLocaleString('en-IN')}/mo` },
                { label: 'Negotiable', value: state.priceNegotiable },
                { label: 'Ownership', value: state.ownershipType },
                { label: 'Available From', value: state.availableFrom },
            ].filter(Boolean)
        },
        {
            stepIndex: 4, title: '✨ Amenities', items: [
                { label: 'Selected', value: (state.amenities || []).join(', ') || 'None selected' },
                state.waterSource && { label: 'Water Source', value: state.waterSource },
            ].filter(Boolean)
        },
        {
            stepIndex: 5, title: '📸 Media', items: [
                { label: 'Images', value: `${files.length} uploaded` },
                state.videoUrl && { label: 'Video', value: state.videoUrl },
                state.virtualTourUrl && { label: 'Virtual Tour', value: state.virtualTourUrl },
            ].filter(Boolean)
        },
        {
            stepIndex: 6, title: '📝 Additional Info', items: [
                { label: 'Description', value: state.description ? `${state.description.substring(0, 120)}${state.description.length > 120 ? '...' : ''}` : '' },
                (state.uspHighlights || []).length > 0 && { label: 'Highlights', value: state.uspHighlights.join(', ') },
                state.connectivity && { label: 'Connectivity', value: state.connectivity.substring(0, 80) + '...' },
                state.reasonForSelling && { label: 'Reason', value: state.reasonForSelling },
            ].filter(Boolean)
        },
    ];

    return sections.map((section) => {
        const filledItems = section.items.filter((item) => item.value);
        const stepConfig = STEP_CONFIG[section.stepIndex];
        const complete = isStepComplete(stepConfig, state, files);

        return `
      <div class="review-card ${complete ? '' : 'incomplete'}">
        <div class="review-card-header">
          <h4>${section.title}</h4>
          <div class="review-card-actions">
            ${!complete ? '<span class="review-incomplete-badge">Incomplete</span>' : '<span class="review-complete-badge">✓</span>'}
            <button class="review-edit-btn" data-step="${section.stepIndex}">Edit</button>
          </div>
        </div>
        <div class="review-card-body">
          ${filledItems.length > 0 ? `
            <dl class="review-dl">
              ${filledItems.map((item) => `
                <div class="review-dl-row">
                  <dt>${item.label}</dt>
                  <dd>${item.value}</dd>
                </div>
              `).join('')}
            </dl>
          ` : '<p class="review-empty">No data entered yet</p>'}
        </div>
      </div>
    `;
    }).join('');
}
