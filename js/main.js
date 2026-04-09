/* ==========================================================================
   GIACOMO ZENI — TEMPORARY MANAGER
   Main JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- DOM REFERENCES ---------- */
  const navbar       = document.getElementById('navbar');
  const navToggle    = document.getElementById('navToggle');
  const navMenu      = document.getElementById('navMenu');
  const navLinks     = document.querySelectorAll('.navbar__link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');
  const heroContent  = document.querySelector('.hero__content');
  const heroBg       = document.querySelector('.hero__bg-shapes');


  /* ---------- NAVBAR: SCROLL EFFECT ---------- */
  var lastScroll = 0;

  function handleNavbarScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ---------- HERO PARALLAX ---------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleHeroParallax() {
    if (prefersReducedMotion) return;
    var scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    var offset = scrollY * 0.3;
    var opacity = 1 - (scrollY / (window.innerHeight * 0.8));

    if (heroContent) {
      heroContent.style.transform = 'translateY(' + offset + 'px)';
      heroContent.style.opacity = Math.max(opacity, 0);
    }

    if (heroBg) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    }
  }

  window.addEventListener('scroll', handleHeroParallax, { passive: true });


  /* ---------- MOBILE MENU ---------- */
  function toggleMenu() {
    var isOpen = navMenu.classList.toggle('navbar__menu--open');
    navToggle.classList.toggle('navbar__toggle--open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navMenu.classList.remove('navbar__menu--open');
    navToggle.classList.remove('navbar__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('navbar__menu--open')) {
      closeMenu();
      navToggle.focus();
    }
  });


  /* ---------- SCROLL TO TOP BUTTON ---------- */
  function handleScrollTopVisibility() {
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- INTERSECTION OBSERVER: SCROLL ANIMATIONS ---------- */
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ---------- ANIMATED COUNTERS ---------- */
  var statNumbers = document.querySelectorAll('.stat__number[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    statNumbers.forEach(function (el) {
      el.textContent = el.getAttribute('data-target');
    });
  }


  /* ---------- TIMELINE LINE FILL ---------- */
  var timelineFill = document.querySelector('.timeline__line-fill');

  if (timelineFill && 'IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          timelineFill.style.height = '100%';
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineObserver.observe(timelineFill.parentElement);
  }


  /* ---------- FORM VALIDATION ---------- */
  var validationRules = {
    nome:       { required: true, message: 'Inserisci il tuo nome.' },
    email:      { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Inserisci un indirizzo email valido.' },
    telefono:   { required: false, pattern: /^[+]?[\d\s\-().]{7,20}$/, message: 'Inserisci un numero di telefono valido.' },
    messaggio:  { required: true, message: 'Inserisci un messaggio.' },
    privacy:    { required: true, message: 'Devi accettare l\'informativa sulla privacy.' }
  };

  function validateField(field) {
    var name = field.name || field.id;
    var rules = validationRules[name];
    if (!rules) return true;

    var value = field.type === 'checkbox' ? field.checked : field.value.trim();
    var errorEl = field.closest('.form__group') ?
      field.closest('.form__group').querySelector('.form__error') :
      field.parentElement.querySelector('.form__error');

    if (rules.required && !value) {
      showFieldError(field, errorEl, rules.message);
      return false;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      showFieldError(field, errorEl, rules.message);
      return false;
    }

    clearFieldError(field, errorEl);
    return true;
  }

  function showFieldError(field, errorEl, message) {
    if (field.classList) field.classList.add('form__input--error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('form__error--visible');
    }
  }

  function clearFieldError(field, errorEl) {
    if (field.classList) field.classList.remove('form__input--error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('form__error--visible');
    }
  }

  // Live validation on blur
  if (contactForm) {
    var formFields = contactForm.querySelectorAll('.form__input, .form__checkbox');

    formFields.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });

      field.addEventListener('input', function () {
        var name = field.name || field.id;
        var rules = validationRules[name];
        if (!rules) return;
        var value = field.type === 'checkbox' ? field.checked : field.value.trim();
        if (value) {
          var errorEl = field.closest('.form__group') ?
            field.closest('.form__group').querySelector('.form__error') :
            field.parentElement.querySelector('.form__error');
          clearFieldError(field, errorEl);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var firstInvalid = null;

      formFields.forEach(function (field) {
        var name = field.name || field.id;
        if (validationRules[name]) {
          if (!validateField(field)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        }
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Submit to Formspree
      submitBtn.classList.add('btn--loading');
      submitBtn.disabled = true;

      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
        if (response.ok) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('form__success--visible');
        } else {
          alert('Si è verificato un errore. Riprova più tardi.');
        }
      }).catch(function () {
        submitBtn.classList.remove('btn--loading');
        submitBtn.disabled = false;
        alert('Errore di connessione. Controlla la tua rete e riprova.');
      });
    });
  }


  /* ---------- CAROUSEL DOTS & SCROLL AFFORDANCE ---------- */
  (function () {
    var grid = document.querySelector('.pp-grid');
    var wrap = document.querySelector('.pp-grid-wrap');
    var dotsContainer = document.querySelector('.pp-dots');
    if (!grid || !dotsContainer) return;

    var cards = grid.querySelectorAll('.pp-card');
    if (!cards.length) return;

    // Build dots
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'pp-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Vai alla card ' + (i + 1));
      dot.addEventListener('click', function () {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });

    var dots = dotsContainer.querySelectorAll('.pp-dot');

    // Update active dot & gradient on scroll
    grid.addEventListener('scroll', function () {
      var scrollLeft = grid.scrollLeft;
      var cardWidth = cards[0].offsetWidth + 12; // gap ~.75rem
      var activeIndex = Math.round(scrollLeft / cardWidth);
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === activeIndex);
      });

      // Hide gradient when scrolled to end
      if (wrap) {
        var atEnd = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 10;
        wrap.classList.toggle('scrolled-end', atEnd);
      }
    }, { passive: true });
  })();


  /* ---------- LIGHTBOX MODAL ---------- */
  var awardModal   = document.getElementById('awardModal');
  var modalImg     = document.getElementById('modalImg');
  var modalTitle   = document.getElementById('modalTitle');
  var modalText    = document.getElementById('modalText');
  var modalClose   = document.getElementById('modalClose');
  var lightboxCards = document.querySelectorAll('[data-lightbox]');

  function openLightbox(card) {
    var img   = card.querySelector('img');
    var title = card.querySelector('.pp-featured__title, .pp-card__title');
    var text  = card.querySelector('.pp-featured__text, .pp-card__text');

    modalImg.src = img.src;
    modalImg.alt = img.alt || (title ? title.textContent : '');
    modalTitle.textContent = title ? title.textContent : '';
    modalText.textContent  = text  ? text.textContent  : '';

    awardModal.hidden = false;
    awardModal.offsetHeight;
    awardModal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    awardModal.classList.remove('modal--open');
    document.body.style.overflow = '';
    setTimeout(function () {
      awardModal.hidden = true;
    }, 350);
  }

  lightboxCards.forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  modalClose.addEventListener('click', closeLightbox);

  awardModal.querySelector('.modal__overlay').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && awardModal.classList.contains('modal--open')) {
      closeLightbox();
    }
  });


  /* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
  var sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('navbar__link--active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('navbar__link--active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

})();
