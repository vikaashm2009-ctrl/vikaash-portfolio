/* ============================================================
   VIKAASH M — PORTFOLIO SCRIPT
   Plain, commented JS. No frameworks, no build step.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero entrance: staggered reveal ---------- */
  // Elements are marked with data-reveal="n" and start hidden via CSS.
  // We just add a class after a short delay per element, staggering them.
  const heroRevealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    heroRevealEls.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('.reveal-line span').forEach((span) => {
      span.style.transform = 'none';
    });
  } else {
    heroRevealEls.forEach((el) => {
      const step = parseInt(el.getAttribute('data-reveal'), 10) || 1;
      const delay = step * 110; // ms between each element

      setTimeout(() => {
        el.classList.add('is-visible');

        // If this element is (or contains) a reveal-line, animate the inner span up.
        const lineSpan = el.classList.contains('reveal-line')
          ? el.querySelector('span')
          : el.querySelector('.reveal-line span');

        if (lineSpan) {
          lineSpan.style.transition = 'transform 0.9s cubic-bezier(0.19, 1, 0.22, 1)';
          lineSpan.style.transform = 'translateY(0)';
        }

        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });

    // Hero name lines live inside reveal-line wrappers; animate their spans directly too,
    // since .hero__name is not itself a [data-reveal] target's line span in all cases.
    document.querySelectorAll('.reveal-line').forEach((line) => {
      const step = parseInt(line.getAttribute('data-reveal'), 10) || 2;
      const delay = step * 110;
      const span = line.querySelector('span');
      if (span) {
        setTimeout(() => {
          span.style.transition = 'transform 0.9s cubic-bezier(0.19, 1, 0.22, 1)';
          span.style.transform = 'translateY(0)';
        }, delay);
      }
    });
  }

  /* ---------- Scroll reveals for section content ---------- */
  const scrollRevealEls = document.querySelectorAll('.reveal-up');

  if (prefersReducedMotion) {
    scrollRevealEls.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // reveal once, then leave it alone
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    scrollRevealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for very old browsers: just show everything.
    scrollRevealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[data-nav]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('data-nav') === id);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Hero background: quiet animated grid ---------- */
  const canvas = document.getElementById('heroGrid');

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let width, height, dpr;
    let offset = 0;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const spacing = 64;
      ctx.strokeStyle = 'rgba(77, 255, 160, 0.05)';
      ctx.lineWidth = 1;

      // Vertical lines, slowly drifting sideways for a subtle sense of motion.
      const shift = offset % spacing;
      for (let x = -spacing + shift; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines, static — keeps the grid feeling architectural, not busy.
      ctx.strokeStyle = 'rgba(233, 239, 233, 0.03)';
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      offset += 0.08; // very slow drift
      requestAnimationFrame(draw);
    }

    resize();
    draw();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    });
  }

});
