/**
 * The Hair Addiction — script.js
 * Handles: sticky header, mobile menu, parallax hero,
 *          Intersection Observer reveals, counter animation,
 *          back-to-top button, smooth scroll, gallery lightbox hint
 */

(function () {
  'use strict';

  /* ── DOM References ─────────────────────────────────────── */
  const header     = document.getElementById('site-header');
  const hamburger  = document.getElementById('hamburger');
  const navMobile  = document.getElementById('nav-mobile');
  const heroBg     = document.getElementById('hero-bg');
  const backToTop  = document.getElementById('back-to-top');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  /* ── Sticky Header ──────────────────────────────────────── */
  function handleScroll() {
    const scrollY = window.scrollY;

    // Scrolled state
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Parallax hero background
    if (heroBg) {
      const offset = scrollY * 0.35;
      heroBg.style.transform = `scale(1.08) translateY(${offset}px)`;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ── Back to Top ────────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Mobile Menu ────────────────────────────────────────── */
  function closeMenu() {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('open');
    navMobile.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu on mobile link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (
      navMobile &&
      navMobile.classList.contains('open') &&
      !navMobile.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMobile && navMobile.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ── Intersection Observer — Reveal ─────────────────────── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Counter Animation ──────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased   = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = current.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.hasAttribute('data-target')) {
            animateCounter(el);
          }
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ── Smooth Scroll for Anchor Links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '76',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Active Nav Link on Scroll ──────────────────────────── */
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-desktop a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── Gallery: prevent right-click context on images ─────── */
  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  });

  /* ── Service card tilt effect on desktop ────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const rotX   = ((y - cy) / cy) * -4;
        const rotY   = ((x - cx) / cx) *  4;
        card.style.transform = `translateY(-3px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'all 0.4s ease';
      });

      card.addEventListener('mouseenter', function () {
        card.style.transition = 'box-shadow 0.35s ease, border-color 0.35s ease';
      });
    });
  }

  /* ── Testimonial card — subtle hover lift ───────────────── */
  document.querySelectorAll('.testimonial-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ── Lazy load fallback for older browsers ──────────────── */
  if ('loading' in HTMLImageElement.prototype === false) {
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.src = img.getAttribute('data-src') || img.src;
    });
  }

  /* ── Mark nav as active style ───────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-desktop a.active {
      color: #A3B18A !important;
    }
    .nav-desktop a.active::after {
      transform: scaleX(1) !important;
    }
    .site-header:not(.scrolled) .nav-desktop a.active {
      color: #c4d4ae !important;
    }
  `;
  document.head.appendChild(style);

  /* ── Console easter egg ─────────────────────────────────── */
  console.log(
    '%c The Hair Addiction \n%c Once you start, you can\'t stop.',
    'color: #A3B18A; font-size: 18px; font-weight: bold; font-family: Georgia, serif;',
    'color: #3D405B; font-size: 12px; font-family: sans-serif;'
  );

})();
