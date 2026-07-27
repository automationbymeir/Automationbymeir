
// Footer and Cookie Consent Manager

function initFooterAndConsent() {
  // 1. Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Footer Styles */
    .site-footer {
      background-color: #111;
      color: #fff;
      padding: 4rem 1rem 2rem;
      margin-top: auto;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    .footer-section h4 {
      color: var(--primary, #00e676);
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-links li {
      margin-bottom: 0.8rem;
    }
    .footer-links a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.3s ease;
      font-size: 0.95rem;
    }
    .footer-links a:hover {
      color: #fff;
    }
    .copyright {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      color: #666;
      font-size: 0.9rem;
    }

    /* Cookie Consent Banner */
    #cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(20, 20, 20, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 1rem;
      z-index: 1000;
      display: none; /* Hidden by default */
      box-shadow: 0 -10px 20px rgba(0,0,0,0.3);
    }
    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .cookie-text p {
      margin: 0;
      color: #ddd;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .cookie-buttons {
      display: flex;
      gap: 1rem;
    }
    .btn-accept {
      background: #00e676;
      color: #000;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .btn-accept:hover {
      background: #00c853;
      transform: translateY(-2px);
    }
    .btn-decline {
      background: transparent;
      color: #ccc;
      border: 1px solid #555;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .btn-decline:hover {
      border-color: #888;
      color: #fff;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .cookie-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      .btn-accept, .btn-decline {
        width: 100%;
      }
      .cookie-buttons {
        width: 100%;
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(style);

  // 2. Inject Footer HTML
  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="/index.html">Home</a></li>
            <li><a href="/index.html#services">Services</a></li>
            <li><a href="/index.html#projects">Featured Projects</a></li>
            <li><a href="/why-automation.html">Why Automate</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Showcases</h4>
          <ul class="footer-links">
            <li><a href="/showcase2.html">Business Analytics System</a></li>
            <li><a href="/showcase-job-post-pro.html">Job Post Pro</a></li>
            <li><a href="/showcase-power-automate.html">Automated Onboarding</a></li>
            <li><a href="/showcase-retail-data-platform.html">Retail Data Intelligence</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact & Info</h4>
          <ul class="footer-links">
            <li><a href="/index.html#contact">Contact</a></li>
            <li><a href="mailto:service@automationbymeir.com">service@automationbymeir.com</a></li>
            <li><a href="/automation-playground.html">Automation Playground</a></li>
            <li><a href="/payment.html">Packages & Pricing</a></li>
            <li><a href="/about-me.html">About Me</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="/services/process-automation.html">Process Automation</a></li>
            <li><a href="/services/ai-powered-systems.html">AI-Powered Systems</a></li>
            <li><a href="/services/api-integration.html">API Integration</a></li>
            <li><a href="/services/data-dashboards.html">Data Dashboards</a></li>
            <li><a href="/services/document-generation.html">Document Generation</a></li>
            <li><a href="/services/web-development.html">Web Development</a></li>
          </ul>
        </div>
        <div class="footer-section">
            <h4>Automation by Meir</h4>
            <p style="color: #aaa; font-size: 0.9rem;">Empowering businesses through intelligent automation.</p>
            <ul class="footer-links" style="margin-top: 1rem;">
              <li><a href="/privacy-policy.html">Privacy Policy</a></li>
              <li><a href="/terms.html">Terms of Service</a></li>
            </ul>
        </div>
      </div>
      <div class="copyright">
        &copy; ${new Date().getFullYear()} Automation by Meir. All rights reserved.
      </div>
    </footer>
  `;

  // Append footer to body
  const body = document.body;
  // If there's a script tag at the end, insert before it, otherwise append
  // Actually, easiest is to just append to body, browsers act smart enough
  // But let's try to be cleaner: append after the main container if possible
  // Most pages have a specific structure. Appending to body is safe.
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = footerHTML;
  body.appendChild(tempDiv.firstElementChild);


  // 3. Cookie Consent Logic
  const CONSENT_KEY = 'abm_cookie_consent';

  // Show the banner only if no choice has been made yet ('true' or 'false')
  if (!localStorage.getItem(CONSENT_KEY)) {
    // Inject Banner
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <div class="cookie-text">
          <p>I use cookies for analytics (Google Analytics and Microsoft Clarity) to understand how the site is used. Analytics only run if you accept. See the <a href="/privacy-policy.html" style="color:#00e676;">Privacy Policy</a>.</p>
        </div>
        <div class="cookie-buttons">
          <button id="btn-decline-cookies" class="btn-decline">Decline</button>
          <button id="btn-accept-cookies" class="btn-accept">Accept</button>
        </div>
      </div>
    `;
    body.appendChild(banner);

    // Show banner with slight delay
    setTimeout(() => {
      banner.style.display = 'block';
    }, 1000);

    // Handle Accept
    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'true');
      banner.style.display = 'none';
      // Load analytics now that consent is given
      if (window.abmLoadAnalytics) window.abmLoadAnalytics();
      recordConsent();
    });

    // Handle Decline — remember the choice, never load analytics
    document.getElementById('btn-decline-cookies').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'false');
      banner.style.display = 'none';
    });
  }
}

async function recordConsent() {
  try {
    const response = await fetch('/api/schedule/cookie-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        consentType: 'all',
        url: window.location.href
      })
    });

    if (!response.ok) {
      console.warn('Failed to record consent stats');
    }
  } catch (e) {
    console.error('Error recording consent:', e);
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooterAndConsent);
} else {
  initFooterAndConsent();
}
