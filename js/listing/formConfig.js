// ============================================
//  Form Configuration — JSON-Driven Step & Field Definitions
// ============================================

export const STEP_CONFIG = [
    // ── STEP 1: Intent ──
    {
        id: 'intent',
        title: 'Intent',
        icon: '🎯',
        description: 'What would you like to do?',
        fields: [
            {
                name: 'listingFor',
                type: 'radio-cards',
                label: 'I want to',
                required: true,
                weight: 5,
                options: [
                    { value: 'Sell', label: 'Sell', icon: '🏷️', desc: 'Sell your property' },
                    { value: 'Rent', label: 'Rent / Lease', icon: '🔑', desc: 'Rent out your property' },
                    { value: 'PG', label: 'PG / Co-living', icon: '🏠', desc: 'List as PG' },
                ],
            },
            {
                name: 'category',
                type: 'radio-cards',
                label: 'Property Category',
                required: true,
                weight: 5,
                options: [
                    { value: 'Residential', label: 'Residential', icon: '🏡' },
                    { value: 'Commercial', label: 'Commercial', icon: '🏢' },
                ],
            },
            {
                name: 'propertyType',
                type: 'radio-cards',
                label: 'Property Type',
                required: true,
                weight: 5,
                columns: 3,
                optionsFn: (state) => {
                    if (state.category === 'Residential') {
                        return [
                            { value: 'Flat', label: 'Flat / Apartment', icon: '🏬' },
                            { value: 'House', label: 'House / Villa', icon: '🏡' },
                            { value: 'Plot', label: 'Plot / Land', icon: '📐' },
                            { value: 'BuilderFloor', label: 'Builder Floor', icon: '🏗️' },
                            { value: 'Penthouse', label: 'Penthouse', icon: '🌆' },
                            { value: 'Farmhouse', label: 'Farmhouse', icon: '🌾' },
                        ];
                    }
                    if (state.category === 'Commercial') {
                        return [
                            { value: 'Office', label: 'Office Space', icon: '💼' },
                            { value: 'Retail', label: 'Shop / Retail', icon: '🏪' },
                            { value: 'Warehouse', label: 'Warehouse / Godown', icon: '🏭' },
                            { value: 'Showroom', label: 'Showroom', icon: '🪟' },
                            { value: 'CoWorking', label: 'Co-working', icon: '💻' },
                            { value: 'IndustrialLand', label: 'Industrial Land', icon: '🏗️' },
                        ];
                    }
                    return [];
                },
            },
        ],
    },

    // ── STEP 2: Location ──
    {
        id: 'location',
        title: 'Location Details',
        icon: '📍',
        description: 'Where is your property located?',
        fields: [
            { name: 'state', type: 'select', label: 'State', required: true, weight: 3, options: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Bihar', 'Andhra Pradesh', 'Odisha', 'Jharkhand', 'Chhattisgarh', 'Assam', 'Goa', 'Uttarakhand', 'Himachal Pradesh', 'Other'] },
            { name: 'city', type: 'text', label: 'City', required: true, weight: 3, placeholder: 'e.g. Mumbai, Bangalore' },
            { name: 'locality', type: 'text', label: 'Locality / Area', required: true, weight: 3, placeholder: 'e.g. Andheri West' },
            { name: 'subLocality', type: 'text', label: 'Sub-locality', required: false, weight: 1, placeholder: 'e.g. Four Bungalows' },
            { name: 'landmark', type: 'text', label: 'Landmark', required: false, weight: 1, placeholder: 'Near Metro Station' },
            { name: 'pincode', type: 'text', label: 'Pincode', required: true, weight: 2, placeholder: '400053', pattern: '^\\d{6}$', maxLength: 6 },
            { name: 'projectName', type: 'text', label: 'Project / Society Name', required: false, weight: 2, placeholder: 'e.g. Hiranandani Gardens' },
            { name: 'mapReady', type: 'map-placeholder', label: 'Pin Location on Map', required: false, weight: 0 },
        ],
    },

    // ── STEP 3: Property Profile ──
    {
        id: 'profile',
        title: 'Property Profile',
        icon: '🏗️',
        description: 'Tell us about your property details',
        fields: [
            // Residential fields
            { name: 'bhk', type: 'radio-cards', label: 'BHK Type', required: true, weight: 4, showWhen: (s) => s.category === 'Residential' && s.propertyType !== 'Plot', columns: 5, options: [{ value: '1 RK', label: '1 RK' }, { value: '1 BHK', label: '1 BHK' }, { value: '2 BHK', label: '2 BHK' }, { value: '3 BHK', label: '3 BHK' }, { value: '4 BHK', label: '4 BHK' }, { value: '5+ BHK', label: '5+ BHK' }] },
            { name: 'bathrooms', type: 'select', label: 'Bathrooms', required: true, weight: 2, showWhen: (s) => s.category === 'Residential' && s.propertyType !== 'Plot', options: ['1', '2', '3', '4', '5+'] },
            { name: 'balconies', type: 'select', label: 'Balconies', required: false, weight: 1, showWhen: (s) => s.category === 'Residential' && s.propertyType !== 'Plot', options: ['0', '1', '2', '3', '4+'] },
            { name: 'carpetArea', type: 'number', label: 'Carpet Area (sq ft)', required: true, weight: 4, placeholder: 'e.g. 850', min: 1 },
            { name: 'builtUpArea', type: 'number', label: 'Built-up Area (sq ft)', required: false, weight: 2, showWhen: (s) => s.category === 'Residential' && s.propertyType !== 'Plot', placeholder: 'e.g. 1050' },
            { name: 'superBuiltUpArea', type: 'number', label: 'Super Built-up Area (sq ft)', required: false, weight: 2, showWhen: (s) => s.category === 'Residential' && s.propertyType !== 'Plot', placeholder: 'e.g. 1200' },
            { name: 'propertyAge', type: 'select', label: 'Property Age', required: true, weight: 2, options: ['Under Construction', 'Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'] },
            { name: 'floorNumber', type: 'number', label: 'Floor Number', required: false, weight: 1, showWhen: (s) => s.category === 'Residential' && !['Plot', 'House', 'Farmhouse'].includes(s.propertyType), placeholder: 'e.g. 5', min: 0 },
            { name: 'totalFloors', type: 'number', label: 'Total Floors', required: false, weight: 1, showWhen: (s) => !['Plot'].includes(s.propertyType), placeholder: 'e.g. 15', min: 1 },
            { name: 'facing', type: 'select', label: 'Facing Direction', required: false, weight: 1, options: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] },
            { name: 'furnishing', type: 'radio-cards', label: 'Furnishing Status', required: true, weight: 3, showWhen: (s) => s.propertyType !== 'Plot', columns: 3, options: [{ value: 'Unfurnished', label: 'Unfurnished', icon: '📦' }, { value: 'Semi-Furnished', label: 'Semi-Furnished', icon: '🪑' }, { value: 'Fully-Furnished', label: 'Fully Furnished', icon: '🛋️' }] },
            { name: 'parking', type: 'select', label: 'Reserved Parking', required: false, weight: 1, showWhen: (s) => s.propertyType !== 'Plot', options: ['None', '1 Covered', '2 Covered', '1 Open', '2 Open', '1 Covered + 1 Open', 'Other'] },
            // Commercial fields
            { name: 'washrooms', type: 'select', label: 'Washrooms', required: false, weight: 1, showWhen: (s) => s.category === 'Commercial', options: ['Shared', '1 Private', '2 Private', '3+ Private'] },
            { name: 'cabins', type: 'number', label: 'No. of Cabins', required: false, weight: 1, showWhen: (s) => s.category === 'Commercial', placeholder: 'e.g. 3', min: 0 },
            { name: 'conferenceRooms', type: 'number', label: 'Conference Rooms', required: false, weight: 1, showWhen: (s) => s.category === 'Commercial', placeholder: 'e.g. 1', min: 0 },
            { name: 'pantry', type: 'radio-cards', label: 'Pantry / Cafeteria', required: false, weight: 1, showWhen: (s) => s.category === 'Commercial', columns: 3, options: [{ value: 'None', label: 'None' }, { value: 'Dry', label: 'Dry Pantry' }, { value: 'Wet', label: 'Wet Pantry' }] },
        ],
    },

    // ── STEP 4: Pricing & Ownership ──
    {
        id: 'pricing',
        title: 'Pricing & Ownership',
        icon: '💰',
        description: 'Set your price and ownership details',
        fields: [
            { name: 'expectedPrice', type: 'number', label: 'Expected Price (₹)', required: true, weight: 5, placeholder: 'e.g. 8500000', min: 1 },
            { name: 'priceNegotiable', type: 'radio-cards', label: 'Price Negotiable?', required: false, weight: 1, columns: 2, options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
            { name: 'maintenanceCharges', type: 'number', label: 'Monthly Maintenance (₹)', required: false, weight: 1, placeholder: 'e.g. 5000', min: 0 },
            { name: 'bookingAmount', type: 'number', label: 'Booking / Token Amount (₹)', required: false, weight: 1, placeholder: 'e.g. 100000', min: 0, showWhen: (s) => s.listingFor === 'Sell' },
            { name: 'ownershipType', type: 'select', label: 'Ownership Type', required: true, weight: 2, options: ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney'] },
            { name: 'availableFrom', type: 'date', label: 'Available From', required: true, weight: 2, placeholder: '' },
            { name: 'currentlyRented', type: 'radio-cards', label: 'Currently Rented Out?', required: false, weight: 1, showWhen: (s) => s.listingFor === 'Sell', columns: 2, options: [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }] },
            { name: 'currentRent', type: 'number', label: 'Current Monthly Rent (₹)', required: false, weight: 1, showWhen: (s) => s.listingFor === 'Sell' && s.currentlyRented === 'Yes', placeholder: 'e.g. 25000', min: 0 },
            { name: 'expectedRent', type: 'number', label: 'Expected Monthly Rent (₹)', required: true, weight: 4, showWhen: (s) => s.listingFor === 'Rent' || s.listingFor === 'PG', placeholder: 'e.g. 30000', min: 1 },
            { name: 'securityDeposit', type: 'number', label: 'Security Deposit (₹)', required: false, weight: 1, showWhen: (s) => s.listingFor === 'Rent' || s.listingFor === 'PG', placeholder: 'e.g. 60000', min: 0 },
        ],
    },

    // ── STEP 5: Amenities ──
    {
        id: 'amenities',
        title: 'Amenities',
        icon: '✨',
        description: 'Select the amenities available',
        fields: [
            {
                name: 'amenities',
                type: 'checkbox-grid',
                label: 'Select all that apply',
                required: false,
                weight: 10,
                options: [
                    { value: 'Gated Community', icon: '🏘️' },
                    { value: 'Lift', icon: '🛗' },
                    { value: 'Power Backup', icon: '🔋' },
                    { value: 'Swimming Pool', icon: '🏊' },
                    { value: 'Gym', icon: '💪' },
                    { value: 'Club House', icon: '🏛️' },
                    { value: '24x7 Security', icon: '🛡️' },
                    { value: 'CCTV', icon: '📹' },
                    { value: 'Piped Gas', icon: '🔥' },
                    { value: 'Rain Water Harvesting', icon: '🌧️' },
                    { value: 'Park / Garden', icon: '🌳' },
                    { value: 'Indoor Games', icon: '🎮' },
                    { value: 'Fire Safety', icon: '🧯' },
                    { value: 'Intercom', icon: '📞' },
                    { value: 'Visitor Parking', icon: '🅿️' },
                    { value: 'Children Play Area', icon: '🛝' },
                    { value: 'Jogging Track', icon: '🏃' },
                    { value: 'Vastu Compliant', icon: '🧭' },
                    { value: 'Water Purifier', icon: '💧' },
                    { value: 'Air Conditioning', icon: '❄️' },
                ],
            },
            {
                name: 'waterSource',
                type: 'select',
                label: 'Water Source',
                required: false,
                weight: 1,
                options: ['Municipal', 'Borewell', 'Both', 'Other'],
            },
        ],
    },

    // ── STEP 6: Media Upload ──
    {
        id: 'media',
        title: 'Photos & Media',
        icon: '📸',
        description: 'Upload images and media for your listing',
        fields: [
            { name: 'images', type: 'file-upload', label: 'Property Images', required: true, weight: 20, minCount: 5, maxCount: 15, accept: 'image/jpeg,image/png,image/webp', note: 'Minimum 5 images required • Max 15 • JPG/PNG/WebP • Recommended 800×600+' },
            { name: 'videoUrl', type: 'url', label: 'Video Link (YouTube / Vimeo)', required: false, weight: 3, placeholder: 'https://youtube.com/watch?v=...' },
            { name: 'virtualTourUrl', type: 'url', label: 'Virtual Tour Link', required: false, weight: 2, placeholder: 'https://...' },
            { name: 'voiceNote', type: 'textarea', label: 'Voice Description (text for now)', required: false, weight: 1, placeholder: 'Describe the property in your own words — this area is reserved for voice recording in a future update.', note: '🎙️ Voice recording coming soon' },
        ],
    },

    // ── STEP 7: Additional Details ──
    {
        id: 'additional',
        title: 'Additional Details',
        icon: '📝',
        description: 'Help buyers know your property better',
        fields: [
            { name: 'description', type: 'textarea', label: 'Property Description', required: true, weight: 10, placeholder: 'Write a detailed description of your property — highlight key features, nearby places, and why someone should buy/rent it.', minLength: 200, note: 'Minimum 200 characters for a quality listing' },
            {
                name: 'uspHighlights',
                type: 'chip-input',
                label: 'USP / Highlights',
                required: false,
                weight: 3,
                placeholder: 'Type and press Enter (e.g. Corner Unit, Sea View)',
                suggestions: ['Corner Unit', 'Sea View', 'Lake View', 'Park Facing', 'Road Facing', 'Recently Renovated', 'Prime Location', 'Near Metro', 'Gated Society', 'High Floor', 'Natural Light', 'No Brokerage'],
            },
            { name: 'connectivity', type: 'textarea', label: 'Connectivity & Transport', required: false, weight: 2, placeholder: 'Metro — 500m, Bus stop — 200m, Railway station — 2 km, Airport — 12 km' },
            {
                name: 'nearbyFacilities',
                type: 'checkbox-grid',
                label: 'Nearby Facilities',
                required: false,
                weight: 2,
                options: [
                    { value: 'Hospital', icon: '🏥' },
                    { value: 'School', icon: '🏫' },
                    { value: 'Shopping Mall', icon: '🛒' },
                    { value: 'ATM / Bank', icon: '🏧' },
                    { value: 'Market', icon: '🏪' },
                    { value: 'Park', icon: '🌳' },
                    { value: 'Restaurant', icon: '🍽️' },
                    { value: 'Pharmacy', icon: '💊' },
                    { value: 'Petrol Pump', icon: '⛽' },
                    { value: 'Police Station', icon: '🚔' },
                ],
            },
            {
                name: 'reasonForSelling',
                type: 'select',
                label: 'Reason for Selling / Renting',
                required: false,
                weight: 1,
                options: ['Relocation', 'Upgrading', 'Investment', 'Financial Need', 'Downsizing', 'Other'],
            },
        ],
    },

    // ── STEP 8: Review & Preview ──
    {
        id: 'review',
        title: 'Review & Submit',
        icon: '✅',
        description: 'Review your listing before publishing',
        fields: [], // rendered by stepReview.js directly
    },
];

/**
 * Get visible fields for a step based on current state
 */
export function getVisibleFields(stepConfig, state) {
    return stepConfig.fields.filter((f) => {
        if (typeof f.showWhen === 'function') return f.showWhen(state);
        return true;
    });
}

/**
 * Get field options — supports static options or dynamic optionsFn
 */
export function getFieldOptions(field, state) {
    if (typeof field.optionsFn === 'function') return field.optionsFn(state);
    return field.options || [];
}

/**
 * Get step config by id
 */
export function getStepById(id) {
    return STEP_CONFIG.find((s) => s.id === id);
}
