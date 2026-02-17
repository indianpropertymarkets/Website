// ============================================
//  Google Sheets Integration via Apps Script
// ============================================
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet with 3 tabs: "Buyers", "Sellers", "Contacts"
// 2. Add header rows matching form fields
// 3. Go to Extensions → Apps Script
// 4. Paste the following code:
//
// function doPost(e) {
//   const data = JSON.parse(e.postData.contents);
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheetName);
//   const timestamp = new Date().toLocaleString();
//   const row = [timestamp, ...data.values];
//   sheet.appendRow(row);
//   return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
//     .setMimeType(ContentService.MimeType.JSON);
// }
//
// function doGet(e) {
//   const sheetName = e.parameter.sheet || 'Buyers';
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
//   const data = sheet.getDataRange().getValues();
//   const headers = data[0];
//   const rows = data.slice(1).map(row => {
//     const obj = {};
//     headers.forEach((h, i) => obj[h] = row[i]);
//     return obj;
//   });
//   return ContentService.createTextOutput(JSON.stringify(rows))
//     .setMimeType(ContentService.MimeType.JSON);
// }
//
// 5. Deploy as Web App (Execute as: Me, Access: Anyone)
// 6. Copy the Web App URL and paste it below:

const APPS_SCRIPT_URL = ''; // ← Paste your deployed Apps Script URL here

/**
 * Submit data to a Google Sheet tab
 * @param {string} sheetName - Tab name (e.g. "Buyers", "Sellers", "Contacts")
 * @param {string[]} values - Array of values to append as a row
 * @returns {Promise<boolean>} success
 */
export async function submitToSheet(sheetName, values) {
    if (!APPS_SCRIPT_URL) {
        console.warn('[Sheets] No Apps Script URL configured. Data logged to console:');
        console.table({ sheetName, values });
        // Simulate success for demo purposes
        return true;
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sheetName, values }),
        });
        return true;
    } catch (err) {
        console.error('[Sheets] Submit failed:', err);
        return false;
    }
}

/**
 * Fetch all rows from a Google Sheet tab
 * @param {string} sheetName - Tab name
 * @returns {Promise<Object[]>} Array of row objects
 */
export async function fetchFromSheet(sheetName) {
    if (!APPS_SCRIPT_URL) {
        console.warn('[Sheets] No Apps Script URL configured. Returning demo data.');
        return getDemoData(sheetName);
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('[Sheets] Fetch failed:', err);
        return getDemoData(sheetName);
    }
}

// Demo data for development / preview
function getDemoData(sheetName) {
    if (sheetName === 'Buyers') {
        return [
            { Timestamp: '2026-02-15 10:30', Name: 'Rajesh Kumar', Phone: '9876543210', Email: 'rajesh@email.com', PropertyType: 'Apartment', Category: 'Residential', Location: 'Mumbai, Andheri', Budget: '₹80L – ₹1.2Cr', Size: '2 BHK', Requirements: 'Near metro station, gated community preferred' },
            { Timestamp: '2026-02-14 14:15', Name: 'Priya Sharma', Phone: '9123456789', Email: 'priya@email.com', PropertyType: 'Land', Category: 'Residential', Location: 'Pune, Hinjewadi', Budget: '₹40L – ₹60L', Size: '2000 sq ft', Requirements: 'Clear title, road-facing plot' },
            { Timestamp: '2026-02-13 09:00', Name: 'Amit Patel', Phone: '9988776655', Email: '', PropertyType: 'House', Category: 'Residential', Location: 'Bangalore, Whitefield', Budget: '₹1.5Cr – ₹2Cr', Size: '3 BHK', Requirements: 'Independent house with garden' },
            { Timestamp: '2026-02-12 16:45', Name: 'Sneha Reddy', Phone: '9456781234', Email: 'sneha.r@email.com', PropertyType: 'Commercial', Category: 'Commercial', Location: 'Hyderabad, Madhapur', Budget: '₹2Cr – ₹3Cr', Size: '5000 sq ft', Requirements: 'Office space, IT corridor' },
            { Timestamp: '2026-02-11 11:20', Name: 'Mohammed Tariq', Phone: '9321654987', Email: '', PropertyType: 'Apartment', Category: 'Residential', Location: 'Chennai, OMR', Budget: '₹50L – ₹75L', Size: '2 BHK', Requirements: 'Near schools, parking required' },
        ];
    }

    if (sheetName === 'Sellers') {
        return [
            { Timestamp: '2026-02-15 12:00', OwnerName: 'Vikram Singh', Phone: '9876001122', Email: 'vikram@email.com', PropertyType: 'Apartment', Category: 'Residential', Location: 'Mumbai, Powai', Size: '1200 sq ft', Price: '₹1.8 Cr', Description: '3 BHK with lake view, fully furnished' },
            { Timestamp: '2026-02-14 09:30', OwnerName: 'Lakshmi Iyer', Phone: '9654321876', Email: 'lakshmi.i@email.com', PropertyType: 'Land', Category: 'Residential', Location: 'Pune, Kharadi', Size: '3500 sq ft', Price: '₹85 Lakh', Description: 'Corner plot, NA sanctioned, ready for construction' },
            { Timestamp: '2026-02-12 17:00', OwnerName: 'Deepak Joshi', Phone: '9012345678', Email: '', PropertyType: 'Commercial', Category: 'Commercial', Location: 'Delhi, Connaught Place', Size: '4000 sq ft', Price: '₹5 Cr', Description: 'Ground floor showroom with basement' },
            { Timestamp: '2026-02-10 08:15', OwnerName: 'Ananya Nair', Phone: '9876543222', Email: 'ananya@email.com', PropertyType: 'House', Category: 'Residential', Location: 'Kochi, Marine Drive', Size: '2500 sq ft', Price: '₹1.2 Cr', Description: '4 BHK independent house, 5 years old' },
        ];
    }

    return [];
}
