// ============================================
//  Main Application Entry – SPA Router
// ============================================
import './style.css';

// Page modules (lazy-ish imports)
import { renderHome } from './js/pages/home.js';
import { renderBuyer } from './js/pages/buyer.js';
import { renderSeller } from './js/pages/seller.js';
import { renderServices } from './js/pages/services.js';
import { renderAdmin } from './js/pages/admin.js';
import { renderContact } from './js/pages/contact.js';

const app = document.getElementById('app');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

// ---- Routes ----
const routes = {
  '/': renderHome,
  '/buyer': renderBuyer,
  '/seller': renderSeller,
  '/services': renderServices,
  '/admin': renderAdmin,
  '/contact': renderContact,
};

// ---- Router ----
function getPath() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash;
}

function navigate() {
  const path = getPath();
  const renderFn = routes[path] || renderHome;

  // Smooth page transition
  app.style.opacity = '0';
  app.style.transform = 'translateY(12px)';

  setTimeout(() => {
    app.innerHTML = '';
    renderFn(app);
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';
    window.scrollTo({ top: 0, behavior: 'instant' });
    updateActiveNav(path);
    closeMobileNav();
  }, 180);
}

// ---- Active Nav ----
function updateActiveNav(path) {
  const links = navLinks.querySelectorAll('a[data-nav]');
  links.forEach(link => {
    const navPath = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', navPath === path);
  });
}

// ---- Mobile Nav ----
function closeMobileNav() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
}

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    closeMobileNav();
  }
});

// ---- Scroll Effects ----
let scrollTop;
window.addEventListener('scroll', () => {
  scrollTop = window.scrollY;

  // Navbar background
  navbar.classList.toggle('scrolled', scrollTop > 50);

  // Scroll-to-top button
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', scrollTop > 400);
  }
});

// ---- App transition styles ----
app.style.transition = 'opacity 0.18s ease, transform 0.18s ease';

// ---- Init ----
window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

// Scroll-to-top button (persistent)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.body.appendChild(scrollTopBtn);
