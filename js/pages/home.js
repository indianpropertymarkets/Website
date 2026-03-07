// ============================================
//  HOME PAGE
// ============================================

export function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
    <div class="container">
      <div class="hero-wrapper">
        
        <!-- LEFT SLIDESHOW -->
        <div class="hero-image anim-fade-up">
          <div class="hero-slideshow" id="heroSlideshow">
            <img src="/assets/hero-slide-1.png" alt="Luxury Villa" class="hero-slide active">
            <img src="/assets/hero-slide-2.png" alt="Modern Apartments" class="hero-slide">
            <img src="/assets/hero-slide-3.png" alt="Commercial Space" class="hero-slide">
            <div class="hero-dots">
              <span class="hero-dot active" data-slide="0"></span>
              <span class="hero-dot" data-slide="1"></span>
              <span class="hero-dot" data-slide="2"></span>
            </div>
          </div>
        </div>

        <!-- RIGHT CONTENT -->
        <div class="hero-content">
          <div class="hero-badge anim-fade-up">
            🏆 Trusted Property Broker Service
          </div>

          <h1 class="anim-fade-up delay-1">
            Connecting Property<br>
            Buyers & Sellers<br>
            <span class="highlight">Seamlessly</span>
          </h1>

          <p class="hero-subtitle anim-fade-up delay-2">
            We personally match property buyers with verified sellers across India.
            Our expert team handles every step — so you get the best deal with zero hassle.
          </p>

          <div class="hero-ctas anim-fade-up delay-3">
            <a href="#/buyer" class="btn btn-primary btn-lg">I Am a Buyer →</a>
            <a href="#/seller" class="btn btn-gold btn-lg">I Am a Seller →</a>
          </div>

          <div class="hero-stats anim-fade-up delay-4">
            ...
          </div>
        </div>

      </div>
    </div>
  </section>


    <!-- CTA Cards -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Get Started</span>
          <h2 class="section-title">What Are You Looking For?</h2>
          <p class="section-subtitle">Whether you're buying or selling, we've got you covered. Select your role to get started.</p>
        </div>
        <div class="cta-cards">
          <a href="#/buyer" class="cta-card buyer anim-fade-up">
            <div class="cta-icon">🏠</div>
            <h3>I Am a Buyer</h3>
            <p>Tell us what you're looking for — location, budget, property type — and we'll find the perfect match.</p>
            <span class="btn btn-primary">Submit Requirement →</span>
          </a>
          <a href="#/seller" class="cta-card seller anim-fade-up delay-1">
            <div class="cta-icon">🏷️</div>
            <h3>I Am a Seller</h3>
            <p>List your property with us and get connected to verified, serious buyers quickly and safely.</p>
            <span class="btn btn-gold">List Property →</span>
          </a>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Process</span>
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Our streamlined 3-step process makes property transactions simple and stress-free.</p>
        </div>
        <div class="steps-grid">
          <div class="step-card anim-fade-up">
            <div class="step-number">1</div>
            <h3>Submit Your Details</h3>
            <p>Fill out a simple form with your property requirements or listing details. It takes less than 2 minutes.</p>
          </div>
          <div class="step-card anim-fade-up delay-1">
            <div class="step-number">2</div>
            <h3>Admin Reviews</h3>
            <p>Our team personally reviews every submission, verifies details, and identifies the best matches.</p>
          </div>
          <div class="step-card anim-fade-up delay-2">
            <div class="step-number">3</div>
            <h3>Get Connected</h3>
            <p>We connect matching buyers and sellers, facilitate meetings, and support you through the deal closure.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Property Categories -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Categories</span>
          <h2 class="section-title">Property Categories</h2>
          <p class="section-subtitle">We deal in all major property types across India.</p>
        </div>
        <div class="categories-grid">
          <div class="category-card anim-fade-up">
            <div class="cat-icon">🌍</div>
            <h3>Land</h3>
            <p>Residential & agricultural plots</p>
          </div>
          <div class="category-card anim-fade-up delay-1">
            <div class="cat-icon">🏡</div>
            <h3>House</h3>
            <p>Independent houses & villas</p>
          </div>
          <div class="category-card anim-fade-up delay-2">
            <div class="cat-icon">🏢</div>
            <h3>Apartment</h3>
            <p>Flats & high-rise apartments</p>
          </div>
          <div class="category-card anim-fade-up delay-3">
            <div class="cat-icon">🏗️</div>
            <h3>Commercial</h3>
            <p>Shops, offices & warehouses</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-badge">Our Promise</span>
          <h2 class="section-title">Why Choose Us</h2>
          <p class="section-subtitle">We're not just another listing portal — we're your trusted property partner.</p>
        </div>
        <div class="why-grid">
          <div class="card anim-fade-up">
            <div class="card-icon">🛡️</div>
            <h3>Trusted & Transparent</h3>
            <p>Every transaction is handled with complete honesty and transparency. No hidden charges, no surprises.</p>
          </div>
          <div class="card anim-fade-up delay-1">
            <div class="card-icon gold">✅</div>
            <h3>Verified Properties</h3>
            <p>All property listings go through our verification process before being shared with potential buyers.</p>
          </div>
          <div class="card anim-fade-up delay-2">
            <div class="card-icon primary">🤝</div>
            <h3>Personalized Service</h3>
            <p>Our team personally handles every client, understanding unique needs and finding the perfect match.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <h2 class="anim-fade-up">Submit Your Requirement Today</h2>
        <p class="anim-fade-up delay-1">Join 1,200+ clients who found their ideal property through us.</p>
        <div class="anim-fade-up delay-2">
          <a href="#/buyer" class="btn btn-primary btn-lg" style="margin-right:12px;">Buyer Form →</a>
          <a href="#/seller" class="btn btn-gold btn-lg">Seller Form →</a>
        </div>
      </div>
    </section>
  `;

  // --- Hero Slideshow Logic ---
  initHeroSlideshow();
}

function initHeroSlideshow() {
  const slideshow = document.getElementById('heroSlideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero-slide');
  const dots = slideshow.querySelectorAll('.hero-dot');
  let currentIndex = 0;
  let intervalId = null;
  const INTERVAL_MS = 5000;

  function goToSlide(index) {
    // Remove active from current
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');

    currentIndex = index;

    // Add active to new
    slides[currentIndex].classList.add('active');

    // Force CSS animation restart on the dot
    const activeDot = dots[currentIndex];
    activeDot.classList.remove('active');
    // Trigger reflow to restart animation
    void activeDot.offsetWidth;
    activeDot.classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  function startAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      if (slideIndex !== currentIndex) {
        goToSlide(slideIndex);
        startAutoPlay();
      }
    });
  });

  slideshow.addEventListener('mouseenter', stopAutoPlay);
  slideshow.addEventListener('mouseleave', startAutoPlay);

  // Initialize first dot animation
  void dots[0].offsetWidth;

  startAutoPlay();
}