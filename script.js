const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav && !nav.classList.contains('nav-static')) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const topbar = document.querySelector('.topbar');
    const offset = topbar ? topbar.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    nav?.classList.remove('is-open');
  });
});

const sectionLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = [...document.querySelectorAll('main section[id]')];

if (sectionLinks.length && sections.length) {
  const activateNav = () => {
    let currentId = sections[0].id;
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= 140) currentId = section.id;
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  activateNav();
  window.addEventListener('scroll', activateNav, { passive: true });
}

// ── Resume Modal ─────────────────────────────────────────────────
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    openProjectModal('Resume.pdf');
  });
}

// ── Project Modal ────────────────────────────────────────────────
const projectModalOverlay = document.getElementById('project-modal-overlay');
const projectModalClose   = document.getElementById('project-modal-close');

function openProjectModal(url) {
  const frame = document.getElementById('project-modal-frame');
  frame.src = url;
  projectModalOverlay.classList.add('is-open');
  document.body.classList.add('modal-open');
  projectModalClose.focus();
}

function closeProjectModal() {
  projectModalOverlay.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    document.getElementById('project-modal-frame').src = 'about:blank';
  }, 300);
}

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}

if (projectModalOverlay) {
  projectModalOverlay.addEventListener('click', (e) => {
    if (e.target === projectModalOverlay) closeProjectModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModalOverlay?.classList.contains('is-open')) {
    closeProjectModal();
  }
});

// ── Image Lightbox ────────────────────────────────────────────────
const lightbox = document.createElement('div');
lightbox.className = 'img-lightbox';
lightbox.innerHTML = '<button class="img-lightbox-close" aria-label="Close image">✕</button><img src="" alt="" />';
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  document.body.classList.add('modal-open');
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  lightboxImg.src = '';
}

lightbox.addEventListener('click', (e) => {
  if (e.target !== lightboxImg) closeLightbox();
});

lightbox.querySelector('.img-lightbox-close').addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
});

document.addEventListener('click', (e) => {
  const img = e.target.closest('.project-media img');
  if (img) openLightbox(img.src, img.alt);
});

// Intercept all project-card links on the main page
document.querySelectorAll('.project-card a[href]').forEach((link) => {
  if (/projects\//.test(link.getAttribute('href'))) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(link.href);
    });
  }
});
