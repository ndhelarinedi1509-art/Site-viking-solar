/* ============================================================
   Viking Solar – Premium Motion & Interaction Orchestrator
   ============================================================ */

// 1. DYNAMIC INJECTION OF SCREEN LOADER (Fires immediately)
(function injectAndInitLoader() {
  const loaderHTML = `
    <div class="vs-loader-overlay" id="vsLoader">
      <div class="vs-loader-corona"></div>
      <div class="vs-loader-center">
        <div class="vs-loader-logo-wrap">
          <svg viewBox="0 0 32 32" fill="none">
            <circle class="vs-loader-logo-ring" cx="16" cy="16" r="14" stroke-width="2.5"/>
            <path class="vs-loader-logo-star" d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z"/>
          </svg>
        </div>
        <div class="vs-loader-brand">Vicking <strong>Solar</strong></div>
        <div class="vs-loader-slogan">Votre partenaire en énergie solaire durable</div>
        <div class="vs-loader-progress-wrap">
          <div class="vs-loader-progress-bar" id="vsProgressBar"></div>
        </div>
      </div>
    </div>
  `;
  
  if (!document.getElementById('vsLoader')) {
    document.write(loaderHTML);
  }
  
  let progress = 0;
  const updateProgress = (target) => {
    const bar = document.getElementById('vsProgressBar');
    if (bar) {
      progress = target;
      bar.style.width = `${progress}%`;
    }
  };

  // Simulate early loading stages
  const t1 = setTimeout(() => updateProgress(30), 80);
  const t2 = setTimeout(() => updateProgress(65), 250);
  const t3 = setTimeout(() => updateProgress(90), 500);

  window.addEventListener('load', () => {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    updateProgress(100);
    
    setTimeout(() => {
      const loader = document.getElementById('vsLoader');
      if (loader) {
        loader.classList.add('vs-loaded');
        document.body.classList.add('vs-site-ready');
      }
    }, 350);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 2. STICKY HEADER SCROLL TRANSITION ---------- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- 3. MOBILE TOGGLE MENU ---------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  /* ---------- 4. SMOOTH SCROLL ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      let href = this.getAttribute('href');
      // Resolve pages references
      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const id = href.substring(hashIndex + 1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // offset navbar height dynamically
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ---------- 5. MODERN DYNAMIC CURSOR (INTERACTIVE) ---------- */
  const initCustomCursor = () => {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return;

    const dot = document.createElement('div');
    const circle = document.createElement('div');
    dot.className = 'vs-cursor-dot';
    circle.className = 'vs-cursor-circle';
    document.body.appendChild(dot);
    document.body.appendChild(circle);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        dot.style.opacity = '1';
        circle.style.opacity = '1';
      }
    });

    const renderCursor = () => {
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      circleX += (mouseX - circleX) * 0.12;
      circleY += (mouseY - circleY) * 0.12;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Dynamic hover bindings using event delegation
    document.addEventListener('mouseover', (e) => {
      const activeElement = e.target.closest(
        'a, button, .svc-card, .proj-card, .wu-item, .ab-pillar-card, .ab-team-card, ' +
        '.ab-exp-card, .sv-card, .sv-benefit-card, .social-btn, .whatsapp-fab, ' +
        '[role="button"], input[type="submit"], input[type="button"], label'
      );
      if (activeElement) {
        document.body.classList.add('vs-cursor-hover');
      } else {
        document.body.classList.remove('vs-cursor-hover');
      }
    });
  };
  initCustomCursor();

  /* ---------- 6. HERO PARALLAX & MOUSE ENERGY EFFECT ---------- */
  const heroBgs = document.querySelectorAll('.ab-hero-bg, .sv-hero-bg');
  if (heroBgs.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBgs.forEach(bg => {
        bg.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0) scale(1.04)`;
      });
    }, { passive: true });
  }

  const heroSection = document.querySelector('.hero, .ab-hero, .sv-hero');
  const heroGlow = document.querySelector('.hero-glow');
  if (heroSection && heroGlow) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroGlow.style.left = `${x}px`;
      heroGlow.style.top = `${y}px`;
      heroGlow.style.transform = `translate(-50%, -50%) scale(1.2)`;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      heroGlow.style.left = '50%';
      heroGlow.style.top = '-200px';
      heroGlow.style.transform = `translateX(-50%) scale(1)`;
    });
  }

  /* ---------- 7. SCROLL REVEALS & AUTO-STAGGER ---------- */
  const grids = document.querySelectorAll(
    '.services-grid, .projects-track, .whyus-grid, .ab-pillars-grid, ' +
    '.ab-team-grid, .ab-exp-grid, .sv-cards-grid, .sv-benefits-grid, .sv-proj-grid'
  );
  
  grids.forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
      child.classList.add('stagger-reveal');
      child.style.setProperty('--stagger-delay', `${index * 0.08}s`);
    });
  });

  const animatedElements = document.querySelectorAll(
    '.scroll-reveal, .stagger-reveal, .svc-card, .proj-card, .wu-item, ' +
    '.ab-pillar-card, .ab-team-card, .ab-exp-card, .sv-card, .sv-benefit-card, ' +
    '.sv-proj-card, .sv-tl-item, .cta-card, .about-grid, .img-placeholder'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.classList.add('visible'); // keep class for old styles
        entry.target.classList.add('sv-visible'); // keep class for services page
        
        // Custom triggers inside reveal
        if (entry.target.classList.contains('ab-expertise')) {
          animateExpertiseGauges();
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1,
  });

  animatedElements.forEach(el => {
    // Add base class if not already present
    if (!el.classList.contains('stagger-reveal') && !el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }
    revealObserver.observe(el);
  });

  /* ---------- 8. COUNTER ANIMATION FOR STATISTICS ---------- */
  const statNums = document.querySelectorAll('.stat-num[data-target], .ab-exp-stat-num[data-target]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, 0, target, 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic timing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current.toLocaleString('fr-FR');
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ---------- 9. EXPERTISE PROGRESS BARS (ABOUT PAGE) ---------- */
  function animateExpertiseGauges() {
    document.querySelectorAll('.ab-exp-bar-fill[data-width]').forEach(el => {
      const w = el.getAttribute('data-width');
      el.style.width = w + '%';
    });
  }
  
  // Also observe about expertise page section directly
  const expertiseSection = document.querySelector('.ab-expertise');
  if (expertiseSection) {
    const expObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateExpertiseGauges();
          expObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    expObserver.observe(expertiseSection);
  }

  /* ---------- 10. SCROLL SPY ACTIVE NAVIGATION STATE ---------- */
  const navLinksList = document.querySelectorAll('.nav-links a');
  const spySections = document.querySelectorAll('section[id], header[id]');

  const scrollSpy = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // account for navbar height offset

    spySections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinksList.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href.endsWith(`#${currentId}`) || href === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };
  window.addEventListener('scroll', scrollSpy, { passive: true });

  /* ---------- 11. CONTACT FORM HANDLER ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Submit animation feedback
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Envoi en cours...';
      btn.style.opacity = '0.7';
      
      setTimeout(() => {
        btn.innerHTML = 'Message envoyé !';
        btn.style.backgroundColor = '#16A34A';
        btn.style.opacity = '1';
        
        setTimeout(() => {
          alert('Merci ! Votre message a été envoyé avec succès. Nous vous répondrons sous 24h.');
          contactForm.reset();
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
        }, 800);
      }, 1000);
    });
  }
});
