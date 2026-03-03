// ============================================
//  Listing State Manager — Central Form State
// ============================================

const DRAFT_KEY = 'ipm_listing_draft';
const AUTOSAVE_DELAY = 1000; // ms

class ListingState {
    constructor() {
        this._state = {};
        this._currentStep = 0;
        this._subscribers = [];
        this._saveTimer = null;
        this._selectedFiles = []; // stored separately (File objects can't serialize)
    }

    /** Initialize state — attempt to load draft */
    init() {
        const draft = this.loadDraft();
        if (draft) {
            this._state = draft.state || {};
            this._currentStep = draft.currentStep || 0;
            return true; // draft found
        }
        return false;
    }

    /** Get a value */
    get(key) {
        return this._state[key];
    }

    /** Get entire state snapshot */
    getAll() {
        return { ...this._state };
    }

    /** Set a value (triggers autosave + notify) */
    set(key, value) {
        this._state[key] = value;
        this._scheduleSave();
        this._notify();
    }

    /** Bulk update */
    setMany(obj) {
        Object.assign(this._state, obj);
        this._scheduleSave();
        this._notify();
    }

    /** Current step index */
    get currentStep() {
        return this._currentStep;
    }

    set currentStep(val) {
        this._currentStep = val;
        this._scheduleSave();
    }

    /** File storage (in-memory only) */
    get files() {
        return this._selectedFiles;
    }

    set files(arr) {
        this._selectedFiles = arr;
        this._notify();
    }

    // ── Observer Pattern ──

    subscribe(fn) {
        this._subscribers.push(fn);
        return () => {
            this._subscribers = this._subscribers.filter((s) => s !== fn);
        };
    }

    _notify() {
        this._subscribers.forEach((fn) => fn(this._state));
    }

    // ── Persistence ──

    _scheduleSave() {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => this.saveDraft(), AUTOSAVE_DELAY);
    }

    saveDraft() {
        try {
            const data = {
                state: this._state,
                currentStep: this._currentStep,
                savedAt: Date.now(),
            };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[ListingState] Save draft failed:', e);
        }
    }

    loadDraft() {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    hasDraft() {
        return !!localStorage.getItem(DRAFT_KEY);
    }

    clearDraft() {
        localStorage.removeItem(DRAFT_KEY);
    }

    getDraftAge() {
        const draft = this.loadDraft();
        if (!draft || !draft.savedAt) return null;
        return Date.now() - draft.savedAt;
    }

    // ── Submission ──

    /**
     * Flatten state to array for Google Sheets submission
     * Returns [ownerName, phone, email, listingFor, category, propertyType, ...]
     */
    toSubmissionPayload() {
        const s = this._state;
        return [
            s.listingFor || '',
            s.category || '',
            s.propertyType || '',
            s.state || '',
            s.city || '',
            s.locality || '',
            s.subLocality || '',
            s.pincode || '',
            s.projectName || '',
            s.bhk || '',
            s.carpetArea || '',
            s.builtUpArea || '',
            s.propertyAge || '',
            s.furnishing || '',
            s.expectedPrice || '',
            s.priceNegotiable || '',
            s.ownershipType || '',
            s.availableFrom || '',
            (s.amenities || []).join(', '),
            `${this._selectedFiles.length} image(s)`,
            s.description || '',
            (s.uspHighlights || []).join(', '),
        ];
    }

    /** Reset everything */
    reset() {
        this._state = {};
        this._currentStep = 0;
        this._selectedFiles = [];
        this.clearDraft();
        this._notify();
    }
}

// Singleton
export const listingState = new ListingState();
