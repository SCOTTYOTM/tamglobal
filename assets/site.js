gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 18);
});

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.classList.toggle('open', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });
}

if (!prefersReducedMotion) {
  gsap.utils.toArray('.fade-up').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: i * 0.02,
      scrollTrigger: {
        trigger: el,
        start: 'top 86%'
      }
    });
  });
} else {
  document.querySelectorAll('.fade-up').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

const cards = gsap.utils.toArray('.stack-card');
cards.forEach((card) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActive(card),
    onEnterBack: () => setActive(card)
  });
});

function setActive(activeCard) {
  cards.forEach((card) => card.classList.toggle('active', card === activeCard));
}

const teamCards = document.querySelectorAll('.team-reveal-card');
if (!prefersReducedMotion) {
  teamCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--reveal-x', `${x}%`);
      card.style.setProperty('--reveal-y', `${y}%`);

      const rotateY = ((x - 50) / 50) * 4;
      const rotateX = -((y - 50) / 50) * 4;
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
      card.style.setProperty('--reveal-x', '50%');
      card.style.setProperty('--reveal-y', '50%');
    });
  });
}

teamCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (window.innerWidth > 640) return;
    const isExpanded = card.classList.contains('is-expanded');
    teamCards.forEach((item) => item.classList.remove('is-expanded'));
    if (!isExpanded) card.classList.add('is-expanded');
  });
});

const ecosystemOrbit = document.querySelector('.ecosystem-orbit');
const ecosystemTooltip = document.getElementById('ecosystem-tooltip');
const ecosystemNodes = document.querySelectorAll('.ecosystem-node');

if (ecosystemTooltip && ecosystemNodes.length) {
  const defaultTooltip = `<strong>TAM Global</strong><span class="ecosystem-caption-description">An ecosystem of specialized companies designed to move in concert across science, medicine, diagnostics, data, and therapeutic execution.</span>`;

  ecosystemNodes.forEach((node) => {
    const setTooltip = () => {
      ecosystemNodes.forEach((item) => item.classList.remove('active'));
      node.classList.add('active');
      if (ecosystemOrbit) ecosystemOrbit.classList.add('node-hover');
      const title = node.dataset.company || node.textContent.trim();
      const description = node.dataset.description || '';
      ecosystemTooltip.innerHTML = `<strong>${title}</strong><span class="ecosystem-caption-description">${description}</span>`;
      ecosystemTooltip.style.opacity = '1';
    };

    const clearTooltip = () => {
      node.classList.remove('active');
      if (ecosystemOrbit) ecosystemOrbit.classList.remove('node-hover');
      ecosystemTooltip.innerHTML = defaultTooltip;
      ecosystemTooltip.style.opacity = '0';
    };

    node.addEventListener('mouseenter', setTooltip);
    node.addEventListener('focus', setTooltip);
    node.addEventListener('mouseleave', clearTooltip);
    node.addEventListener('blur', clearTooltip);
  });
}

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.play().catch(() => {
    heroVideo.setAttribute('controls', 'controls');
  });
}

const contactModal = document.getElementById('contact-modal');
const openContactButtons = document.querySelectorAll('[data-open-contact]');
const closeContactButtons = document.querySelectorAll('[data-close-contact]');

if (contactModal) {
  const setContactOpen = (open) => {
    contactModal.classList.toggle('open', open);
    contactModal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  openContactButtons.forEach((button) => button.addEventListener('click', () => setContactOpen(true)));
  closeContactButtons.forEach((button) => button.addEventListener('click', () => setContactOpen(false)));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setContactOpen(false);
  });
}

const closingVideo = document.querySelector('.closing-video');
if (closingVideo) {
  if (!prefersReducedMotion) {
    const syncClosingVideo = () => {
      const section = document.querySelector('.closing');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const rawProgress = (viewport - rect.top) / (viewport * 0.12);
      const progress = Math.min(1, Math.max(0, rawProgress));
      if (closingVideo.duration && Number.isFinite(closingVideo.duration)) {
        const target = closingVideo.duration * progress;
        if (Math.abs(closingVideo.currentTime - target) > 0.03) {
          closingVideo.currentTime = target;
        }
      }
    };

    const bootstrapClosingVideo = () => {
      closingVideo.play().catch(() => {
        closingVideo.setAttribute('controls', 'controls');
      });
      syncClosingVideo();
    };

    closingVideo.addEventListener('loadedmetadata', bootstrapClosingVideo, { once: true });
    window.addEventListener('scroll', syncClosingVideo, { passive: true });
    window.addEventListener('resize', syncClosingVideo, { passive: true });
  } else {
    closingVideo.play().catch(() => {
      closingVideo.setAttribute('controls', 'controls');
    });
  }
}
