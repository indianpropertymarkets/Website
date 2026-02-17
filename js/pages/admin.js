// ============================================
//  ADMIN DASHBOARD PAGE
// ============================================
import { fetchFromSheet } from '../sheets.js';
import { whatsappButtonHTML } from '../whatsapp.js';

const ADMIN_PASSWORD = 'admin123'; // Simple password for demo

export function renderAdmin(container) {
    // Check if already authenticated this session
    if (sessionStorage.getItem('adminAuth') !== 'true') {
        renderLogin(container);
        return;
    }

    renderDashboard(container);
}

function renderLogin(container) {
    container.innerHTML = `
    <div class="admin-login-overlay" id="adminLoginOverlay">
      <div class="admin-login-box">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔐</div>
        <h3>Admin Access</h3>
        <p>Enter your admin password to access the dashboard.</p>
        <input type="password" class="form-input" id="adminPassword" placeholder="Password" />
        <div id="loginError" style="color:var(--danger);font-size:0.85rem;margin-bottom:12px;display:none;">Incorrect password. Try again.</div>
        <button class="btn btn-primary" id="adminLoginBtn" style="width:100%;">Login →</button>
        <div style="margin-top:16px;">
          <a href="#/" style="color:var(--text-light);font-size:0.88rem;">← Back to Home</a>
        </div>
      </div>
    </div>
  `;

    const passwordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('adminLoginBtn');
    const loginError = document.getElementById('loginError');

    function attemptLogin() {
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuth', 'true');
            renderDashboard(container);
        } else {
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    setTimeout(() => passwordInput.focus(), 200);
}

async function renderDashboard(container) {
    container.innerHTML = `
    <div class="page-wrapper" style="background:var(--bg);">
      <section class="section" style="padding-top:var(--gap-2xl);">
        <div class="container">
          <!-- Header -->
          <div class="admin-header">
            <div>
              <h1 style="font-size:1.8rem;margin-bottom:4px;">Admin Dashboard</h1>
              <p style="color:var(--text-light);font-size:0.9rem;">Manage buyer requirements and seller listings</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button class="btn btn-outline btn-sm" id="refreshBtn">🔄 Refresh</button>
              <button class="btn btn-outline btn-sm" id="logoutBtn" style="color:var(--danger);border-color:var(--danger);">Logout</button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="admin-tabs" id="adminTabs">
            <button class="admin-tab active" data-tab="buyers">🏠 Buyer Requests</button>
            <button class="admin-tab" data-tab="sellers">🏷️ Seller Properties</button>
          </div>

          <!-- Filters -->
          <div class="admin-filters" id="adminFilters" style="margin-top:16px;">
            <input type="text" class="form-input" id="filterSearch" placeholder="🔍 Search name, location..." />
            <select class="form-select" id="filterType">
              <option value="">All Types</option>
              <option value="Land">Land</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
            </select>
            <select class="form-select" id="filterLocation">
              <option value="">All Locations</option>
            </select>
          </div>

          <!-- Data Table -->
          <div id="tableContainer">
            <div class="loading-spinner"><div class="spinner"></div></div>
          </div>

          <!-- Stats -->
          <div id="statsBar" style="display:flex;gap:16px;margin-top:24px;flex-wrap:wrap;"></div>
        </div>
      </section>
    </div>
  `;

    // State
    let currentTab = 'buyers';
    let buyerData = [];
    let sellerData = [];

    // Elements
    const tableContainer = document.getElementById('tableContainer');
    const tabs = document.querySelectorAll('.admin-tab');
    const filterSearch = document.getElementById('filterSearch');
    const filterType = document.getElementById('filterType');
    const filterLocation = document.getElementById('filterLocation');
    const statsBar = document.getElementById('statsBar');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // ---- Load Data ----
    async function loadData() {
        tableContainer.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
        buyerData = await fetchFromSheet('Buyers');
        sellerData = await fetchFromSheet('Sellers');
        populateLocationFilter();
        renderTable();
        renderStats();
    }

    // ---- Populate Locations ----
    function populateLocationFilter() {
        const data = currentTab === 'buyers' ? buyerData : sellerData;
        const key = currentTab === 'buyers' ? 'Location' : 'Location';
        const locations = [...new Set(data.map(d => {
            const loc = d[key] || d.Location || '';
            return loc.split(',')[0].trim();
        }).filter(Boolean))];

        filterLocation.innerHTML = '<option value="">All Locations</option>';
        locations.forEach(loc => {
            filterLocation.innerHTML += `<option value="${loc}">${loc}</option>`;
        });
    }

    // ---- Filter Data ----
    function getFilteredData() {
        let data = currentTab === 'buyers' ? [...buyerData] : [...sellerData];
        const search = filterSearch.value.toLowerCase().trim();
        const typeFilter = filterType.value;
        const locFilter = filterLocation.value;

        if (search) {
            data = data.filter(d => {
                const str = Object.values(d).join(' ').toLowerCase();
                return str.includes(search);
            });
        }

        if (typeFilter) {
            data = data.filter(d => (d.PropertyType || d['Property Type'] || '') === typeFilter);
        }

        if (locFilter) {
            data = data.filter(d => {
                const loc = d.Location || '';
                return loc.toLowerCase().includes(locFilter.toLowerCase());
            });
        }

        return data;
    }

    // ---- Render Table ----
    function renderTable() {
        const data = getFilteredData();

        if (data.length === 0) {
            tableContainer.innerHTML = `
        <div class="data-table-wrapper">
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No Records Found</h3>
            <p style="color:var(--text-light);">Try adjusting your filters or wait for new submissions.</p>
          </div>
        </div>
      `;
            return;
        }

        if (currentTab === 'buyers') {
            renderBuyerTable(data);
        } else {
            renderSellerTable(data);
        }
    }

    function getBadgeClass(type) {
        const t = (type || '').toLowerCase();
        if (t.includes('land')) return 'badge-land';
        if (t.includes('house')) return 'badge-house';
        if (t.includes('apartment')) return 'badge-apartment';
        if (t.includes('commercial')) return 'badge-commercial';
        return '';
    }

    function renderBuyerTable(data) {
        const rows = data.map(d => `
      <tr>
        <td><strong>${d.Name || '—'}</strong></td>
        <td>${d.Phone || '—'}</td>
        <td><span class="badge ${getBadgeClass(d.PropertyType)}">${d.PropertyType || '—'}</span></td>
        <td>${d.Location || '—'}</td>
        <td><strong>${d.Budget || '—'}</strong></td>
        <td style="max-width:200px;font-size:0.82rem;color:var(--text-light);">${d.Requirements || d.Size || '—'}</td>
        <td>${d.Phone ? whatsappButtonHTML(d.Phone, 'Chat') : '—'}</td>
      </tr>
    `).join('');

        tableContainer.innerHTML = `
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Requirements</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    }

    function renderSellerTable(data) {
        const rows = data.map(d => `
      <tr>
        <td><strong>${d.OwnerName || d['Owner Name'] || '—'}</strong></td>
        <td>${d.Phone || '—'}</td>
        <td><span class="badge ${getBadgeClass(d.PropertyType)}">${d.PropertyType || '—'}</span></td>
        <td>${d.Location || '—'}</td>
        <td>${d.Size || '—'}</td>
        <td><strong>${d.Price || '—'}</strong></td>
        <td style="max-width:180px;font-size:0.82rem;color:var(--text-light);">${d.Description || '—'}</td>
        <td>${d.Phone ? whatsappButtonHTML(d.Phone, 'Chat') : '—'}</td>
      </tr>
    `).join('');

        tableContainer.innerHTML = `
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Location</th>
              <th>Size</th>
              <th>Price</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    }

    // ---- Stats ----
    function renderStats() {
        const data = currentTab === 'buyers' ? buyerData : sellerData;
        const label = currentTab === 'buyers' ? 'Buyer Requests' : 'Seller Listings';

        const types = {};
        data.forEach(d => {
            const t = d.PropertyType || 'Other';
            types[t] = (types[t] || 0) + 1;
        });

        const statsHTML = `
      <div class="card" style="padding:16px 20px;flex:1;min-width:140px;">
        <p style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-light);margin-bottom:4px;">Total ${label}</p>
        <h3 style="font-size:1.5rem;color:var(--accent);">${data.length}</h3>
      </div>
      ${Object.entries(types).map(([type, count]) => `
        <div class="card" style="padding:16px 20px;flex:1;min-width:140px;">
          <p style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-light);margin-bottom:4px;">${type}</p>
          <h3 style="font-size:1.5rem;">${count}</h3>
        </div>
      `).join('')}
    `;

        statsBar.innerHTML = statsHTML;
    }

    // ---- Events ----
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            populateLocationFilter();
            filterSearch.value = '';
            filterType.value = '';
            filterLocation.value = '';
            renderTable();
            renderStats();
        });
    });

    filterSearch.addEventListener('input', renderTable);
    filterType.addEventListener('change', renderTable);
    filterLocation.addEventListener('change', renderTable);

    refreshBtn.addEventListener('click', loadData);

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('adminAuth');
        window.location.hash = '#/';
    });

    // ---- Init ----
    loadData();
}
