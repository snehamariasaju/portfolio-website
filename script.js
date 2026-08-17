/* ==========================================================================
   SNEHA MARIA SAJU — PORTFOLIO SCRIPT
   Plain vanilla JS. Each block below handles ONE small interaction.
   Read the comments — this file is written to be easy to explain.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Respect the visitor's OS-level "reduce motion" setting everywhere below
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     0a. SCROLL PROGRESS BAR
     Sets the bar's width to how far down the page the visitor has
     scrolled, as a percentage.
  ------------------------------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = percent + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------------------------------
     0b. TYPEWRITER EFFECT — hero tagline
     Types the tagline out one character at a time on page load.
  ------------------------------------------------------------------ */
  const tagline = document.querySelector('.hero-tagline');
  if (tagline && !prefersReducedMotion) {
    const fullText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid var(--indigo)';
    let i = 0;
    setTimeout(function typeNext() {
      if (i <= fullText.length) {
        tagline.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeNext, 38);
      } else {
        tagline.style.borderRight = 'none';
      }
    }, 550); // wait for the hero entrance animation to mostly finish first
  }

  /* ------------------------------------------------------------------
     0c. RIPPLE EFFECT ON BUTTON CLICK
     Adds a small circle at the click point that expands and fades.
     Works on any element with class "btn" or "demo-btn".
  ------------------------------------------------------------------ */
  document.querySelectorAll('.btn, .demo-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  });

  /* ------------------------------------------------------------------
     0d. MAGNETIC BUTTONS
     The main call-to-action buttons drift slightly toward the cursor
     while hovered, then spring back on mouseleave.
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.35 - 2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     0e. CURSOR TILT
     The hero photo and project screenshots gently tilt in 3D toward
     wherever the cursor is over them.
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.photo-frame, .placeholder-project').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (y * -8).toFixed(2);
        const rotateY = (x * 8).toFixed(2);
        el.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

/* ------------------------------------------------------------------
   MOMENTS
   Double-click / double-tap → open image popup
   Close popup → flip the same card
------------------------------------------------------------------ */

const momentLightbox =
  document.getElementById('moment-lightbox');

const lightboxImage =
  document.getElementById('lightbox-image');

const lightboxClose =
  document.getElementById('lightbox-close');

let activeMomentTile = null;


/* Open the large image */
function openMomentImage(image, tile) {

  if (!momentLightbox || !lightboxImage) return;

  // Remember which card opened the popup
  activeMomentTile = tile;

  // Put image into popup
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  // Show popup
  momentLightbox.classList.add('is-open');
  momentLightbox.setAttribute('aria-hidden', 'false');

  // Prevent page scrolling
  document.body.style.overflow = 'hidden';
}


/* Close popup and flip the card */
function closeMomentImage() {

  if (!momentLightbox) return;

  // Close popup
  momentLightbox.classList.remove('is-open');
  momentLightbox.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';

  // Flip the SAME card that opened the popup
  if (activeMomentTile) {

    activeMomentTile.classList.add('is-flipped');

    activeMomentTile = null;
  }

  // Clear popup image
  setTimeout(function () {

    if (lightboxImage) {
      lightboxImage.src = '';
    }

  }, 300);
}


/* ---------------------------------------------------------------
   DOUBLE CLICK / DOUBLE TAP
---------------------------------------------------------------- */

document.querySelectorAll('.moment-tile').forEach(function (tile) {

  let lastTap = 0;

  /* Desktop: double-click */
  tile.addEventListener('dblclick', function (e) {

    e.preventDefault();

    const image =
      tile.querySelector('.moment-image');

    if (!image) return;

    openMomentImage(image, tile);

  });


  /* Mobile: double-tap */
  tile.addEventListener('touchend', function (e) {

    const currentTime = new Date().getTime();

    const tapLength = currentTime - lastTap;

    if (tapLength < 350 && tapLength > 0) {

      e.preventDefault();

      const image =
        tile.querySelector('.moment-image');

      if (!image) return;

      openMomentImage(image, tile);

    }

    lastTap = currentTime;

  });

});


/* ---------------------------------------------------------------
   CLOSE BUTTON
---------------------------------------------------------------- */

if (lightboxClose) {

  lightboxClose.addEventListener(
    'click',
    closeMomentImage
  );

}


/* ---------------------------------------------------------------
   CLICK OUTSIDE IMAGE = CLOSE
---------------------------------------------------------------- */

if (momentLightbox) {

  momentLightbox.addEventListener(
    'click',
    function (e) {

      if (e.target === momentLightbox) {
        closeMomentImage();
      }

    }
  );

}


/* ---------------------------------------------------------------
   ESCAPE KEY = CLOSE
---------------------------------------------------------------- */

document.addEventListener(
  'keydown',
  function (e) {

    if (
      e.key === 'Escape' &&
      momentLightbox &&
      momentLightbox.classList.contains('is-open')
    ) {

      closeMomentImage();

    }

  }
);
/* ---------------------------------------------------------------
   TAP / CLICK TITLE ON BACK → FLIP CARD BACK TO FRONT
---------------------------------------------------------------- */

document.querySelectorAll('.moment-tile').forEach(function (tile) {

  const backTitle = tile.querySelector('.moment-back .moment-title');

  if (backTitle) {

    backTitle.addEventListener('click', function (e) {

      e.preventDefault();
      e.stopPropagation();

      tile.classList.remove('is-flipped');

    });

  }

});
/* ---------------------------------------------------------------
   CLICK BACK SIDE → RETURN TO ORIGINAL IMAGE
---------------------------------------------------------------- */

document.querySelectorAll('.moment-tile').forEach(function (tile) {

  const back = tile.querySelector('.moment-back');

  if (back) {

    back.addEventListener('click', function (e) {

      e.preventDefault();
      e.stopPropagation();

      // Flip back to the original image
      tile.classList.remove('is-flipped');

    });

  }

});
  /* ------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     Toggles the nav open/closed and updates the hamburger icon + aria.
  ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the menu automatically when a link is tapped
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     2. SCROLL REVEAL
     Adds a "reveal" class to key elements, then uses IntersectionObserver
     to fade + slide them in the first time they enter the viewport.
  ------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll(
    '.section-head, .project, .lab-card, .moment-tile, .timeline-item, .experience-block, .about-grid'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback for very old browsers: just show everything
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------
     3. PROJECT DETAIL MODAL
     Clicking "View Project" fills the modal with that project's
     content (pulled from a small local data object) and opens it.
  ------------------------------------------------------------------ */
  const projectData = {
    stroke: {
      question: '"What if technology could help identify risk earlier?"',
      title: 'AI Stroke Detection',
      desc: 'I explored how machine learning could be used to predict stroke risk from health and lifestyle information, and built a system around that idea — including a preventive alert concept with personalized recommendations.',
      stack: 'Python · Machine Learning · Classification'
    },
    travel: {
      question: '"Planning a trip, without planning everything yourself."',
      title: 'AI Travel Planner',
      desc: 'Built during the IBM SkillsBuild AI & Cloud internship. An AI-powered travel planner that takes a user\u2019s preferences and turns them into a more personalized travel experience.',
      stack: 'AI · Web Development · Recommendation Logic'
    }
  };

  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalQuestion = document.getElementById('modal-question');
  const modalDesc = document.getElementById('modal-desc');
  const modalStack = document.getElementById('modal-stack');

  function openModal(key) {
    const data = projectData[key];
    if (!data || !modalOverlay) return;
    modalQuestion.textContent = data.question;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalStack.textContent = data.stack;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-view').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(btn.dataset.project);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  


  /* ------------------------------------------------------------------
     9. SITE-WIDE DARK / LIGHT MODE
     Controls the whole site via [data-theme] on <html>. The initial
     theme is already set by the inline script in <head> (to avoid a
     flash of the wrong theme) — this block only wires up the button
     and keeps localStorage in sync from here on.
  ------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('site-theme-toggle');

  function updateThemeButton() {
    if (!themeToggleBtn) return;
    const isLight = document.documentElement.dataset.theme === 'light';

    themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');

    const icon = themeToggleBtn.querySelector('.theme-icon');
    const label = themeToggleBtn.querySelector('.theme-label');
    if (icon) icon.textContent = isLight ? '🌙' : '☀️';
    if (label) label.textContent = isLight ? 'Dark' : 'Light';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = document.documentElement.dataset.theme;
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('portfolio-theme', next);
      updateThemeButton();
    });

    updateThemeButton();
  }

});

