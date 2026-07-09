/* =============================================
   JENIFFER ALENCAR NUTRICIONISTA
   Premium Interactions & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== HUB PREMIUM ====================
  const hubItems = document.querySelectorAll('.fade-in-item');
  const navbar = document.getElementById('navbar');
  const btnAcompanhamento = document.getElementById('btn-acompanhamento');

  // Fade-in sequencial na tela inicial
  hubItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, 100 + (index * 150));
  });

  // Scroll suave do Hub para o site
  if (btnAcompanhamento) {
    btnAcompanhamento.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#hero');
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  // Controle de visibilidade da Navbar baseado na rolagem
  let lastScroll = 0;
  const hubScreen = document.getElementById('hub-premium');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const hubHeight = hubScreen ? hubScreen.offsetHeight : 0;

    // Mostrar navbar apenas se rolar para baixo do hub
    if (currentScroll > hubHeight - 100) {
      navbar.classList.remove('hub-hidden');
    } else {
      navbar.classList.add('hub-hidden');
    }

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ==================== HAMBURGER MENU ====================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ==================== FLOATING CTA ====================
  const floatingCta = document.getElementById('floating-cta');

  const showFloating = () => {
    if (window.scrollY > window.innerHeight * 0.4) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', showFloating, { passive: true });

  // ==================== SCROLL REVEAL ====================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  // Stagger children in benefits grid and steps
  document.querySelectorAll('.benefit-card, .step-item').forEach((el, idx) => {
    el.dataset.delay = idx * 80;
  });

  document.querySelectorAll('[data-reveal], [data-reveal-right]').forEach(el => {
    revealObserver.observe(el);
  });

  // ==================== SMOOTH SCROLL FOR ANCHORS ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==================== TESTIMONIALS CAROUSEL ====================
  const track = document.getElementById('testimonials-track');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (track && cards.length > 0) {
    let current = 0;
    let autoPlay;
    let cardWidth = 0;
    let visibleCards = 1;

    const getCardWidth = () => {
      if (!cards[0]) return 0;
      const rect = cards[0].getBoundingClientRect();
      const style = window.getComputedStyle(cards[0]);
      const margin = parseFloat(style.marginRight) || 24;
      return rect.width + margin;
    };

    const getVisible = () => {
      const w = window.innerWidth;
      if (w >= 1100) return 2;
      if (w >= 700) return 1.5;
      return 1;
    };

    const totalSlides = () => Math.max(1, cards.length - Math.floor(getVisible()) + 1);

    // Create dots
    const createDots = () => {
      dotsContainer.innerHTML = '';
      const total = totalSlides();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const goTo = (idx) => {
      const total = totalSlides();
      current = Math.max(0, Math.min(idx, total - 1));
      cardWidth = getCardWidth();
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    };

    const next = () => {
      const total = totalSlides();
      goTo(current >= total - 1 ? 0 : current + 1);
    };

    const prev = () => {
      const total = totalSlides();
      goTo(current <= 0 ? total - 1 : current - 1);
    };

    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    const startAuto = () => {
      autoPlay = setInterval(next, 5000);
    };

    const resetAuto = () => {
      clearInterval(autoPlay);
      startAuto();
    };

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
    });

    const init = () => {
      createDots();
      goTo(0);
    };

    window.addEventListener('resize', () => {
      createDots();
      goTo(Math.min(current, totalSlides() - 1));
    });

    init();
    startAuto();
  }

  // ==================== GALLERY CAROUSEL ====================
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');

  if (gallerySlides.length > 0) {
    let currentSlide = 0;
    let galleryAuto;

    const showSlide = (idx) => {
      gallerySlides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
      });
      galleryThumbs.forEach((t, i) => {
        t.classList.toggle('active', i === idx);
      });
      currentSlide = idx;
    };

    galleryThumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        showSlide(parseInt(thumb.dataset.index));
        clearInterval(galleryAuto);
        galleryAuto = setInterval(nextSlide, 4000);
      });
    });

    const nextSlide = () => {
      showSlide((currentSlide + 1) % gallerySlides.length);
    };

    galleryAuto = setInterval(nextSlide, 4000);
  }

  // ==================== PARALLAX HERO ==================== 
  const heroPhoto = document.querySelector('.hero-photo-container');

  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const rate = scrollY * 0.08;
      heroPhoto.style.transform = `translateY(${-rate}px)`;
    }, { passive: true });
  }

  // ==================== CURSOR GLOW ON CARDS ====================
  document.querySelectorAll('.conversion-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ==================== ACTIVE NAV LINK ==================== 
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const activeLinkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--green-deep)' : '';
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach(s => activeLinkObserver.observe(s));

  // ==================== MICRO ANIMATION: STEP NUMBERS ==================== 
  const stepNumbers = document.querySelectorAll('.step-number');
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'none';
          entry.target.offsetHeight; // reflow
          entry.target.style.animation = 'stepPop 0.5s var(--ease-spring) forwards';
        }
      });
    },
    { threshold: 0.5 }
  );

  stepNumbers.forEach(n => stepObserver.observe(n));

  // Add keyframe for step pop
  const style = document.createElement('style');
  style.textContent = `
    @keyframes stepPop {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .conversion-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200,169,110,0.06) 0%, transparent 60%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .conversion-card:hover::before {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // ==================== COUNT-UP ANIMATION (subtle) ==================== 
  // Triggered when mini card enters viewport
  const miniCard = document.querySelector('.hero-mini-card');
  if (miniCard) {
    const miniObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            miniCard.style.animation = 'none';
            miniCard.offsetHeight;
            miniCard.style.animation = 'fadeSlideUp 0.8s var(--ease-spring) forwards';
            miniObserver.unobserve(miniCard);
          }
        });
      },
      { threshold: 0.8 }
    );
    miniObserver.observe(miniCard);
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(fadeStyle);
  }

  // ==================== PERFORMANCE: LAZY IMAGES ==================== 
  // Images with loading="lazy" are handled natively
  // Add fade-in effect when they load
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    if (img.complete) {
      img.style.opacity = '1';
    }
  });

});
