// ============================================
//  SERVICES PAGE
// ============================================

export function renderServices(container) {
    container.innerHTML = `
    <div class="page-wrapper no-pad">
      <div class="page-header">
        <div class="container">
          <span class="section-badge" style="border-color:rgba(39,174,96,0.3)">What We Do</span>
          <h1>Our Services</h1>
          <p>Comprehensive real estate solutions tailored to your needs.</p>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="services-grid">
            <!-- Service 1 -->
            <div class="service-card anim-fade-up">
              <div class="service-icon">🏠</div>
              <h3>Buyer Requirement Handling</h3>
              <p>We carefully assess each buyer's unique needs — budget, location, property type, and preferences — to find the most suitable options.</p>
              <ul>
                <li>Detailed requirement analysis</li>
                <li>Curated property shortlisting</li>
                <li>Budget-aligned recommendations</li>
                <li>Location & amenity matching</li>
              </ul>
            </div>

            <!-- Service 2 -->
            <div class="service-card anim-fade-up delay-1">
              <div class="service-icon" style="background:var(--gold-light)">🏷️</div>
              <h3>Seller Property Promotion</h3>
              <p>We promote your property to our verified buyer network, ensuring maximum visibility and the best possible price.</p>
              <ul>
                <li>Professional listing creation</li>
                <li>Targeted buyer outreach</li>
                <li>Price evaluation guidance</li>
                <li>Document verification support</li>
              </ul>
            </div>

            <!-- Service 3 -->
            <div class="service-card anim-fade-up delay-2">
              <div class="service-icon" style="background:rgba(52,152,219,0.12)">🤝</div>
              <h3>Manual Buyer–Seller Matching</h3>
              <p>Unlike automated portals, we personally vet and match buyers with sellers based on compatibility, seriousness, and mutual requirements.</p>
              <ul>
                <li>Human-driven matching process</li>
                <li>Buyer credibility verification</li>
                <li>Seller background check</li>
                <li>Compatibility assessment</li>
              </ul>
            </div>

            <!-- Service 4 -->
            <div class="service-card anim-fade-up delay-3">
              <div class="service-icon" style="background:rgba(155,89,182,0.12)">📋</div>
              <h3>Property Consultation</h3>
              <p>Expert guidance on property valuation, legal requirements, documentation, and market trends to help you make informed decisions.</p>
              <ul>
                <li>Fair market value assessment</li>
                <li>Legal documentation guidance</li>
                <li>Market trend analysis</li>
                <li>Investment advisory</li>
              </ul>
            </div>

            <!-- Service 5 -->
            <div class="service-card anim-fade-up delay-4">
              <div class="service-icon" style="background:rgba(231,76,60,0.12)">🏆</div>
              <h3>End-to-End Deal Support</h3>
              <p>From the first meeting to final registration, we support you throughout the entire transaction process.</p>
              <ul>
                <li>Site visit coordination</li>
                <li>Price negotiation support</li>
                <li>Agreement drafting assistance</li>
                <li>Registration process guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="final-cta">
        <div class="container">
          <h2 class="anim-fade-up">Ready to Get Started?</h2>
          <p class="anim-fade-up delay-1">Submit your requirement or list your property — our team is here to help.</p>
          <div class="anim-fade-up delay-2">
            <a href="#/buyer" class="btn btn-primary btn-lg" style="margin-right:12px;">Buyer Form →</a>
            <a href="#/seller" class="btn btn-gold btn-lg">Seller Form →</a>
          </div>
        </div>
      </section>
    </div>
  `;
}
