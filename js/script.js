/* =============================================
   CARNAVAL DE BADAJOZ — JavaScript
   Author: Ángel Galea Anisa | TFG 2025/2026
   ============================================= */

// ---- NAVBAR: Scroll effect ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- CONFETTI ----
const CONFETTI_COLORS = [
  '#7c3aed', '#a855f7', '#f59e0b', '#fcd34d',
  '#ef4444', '#ec4899', '#3b82f6', '#10b981',
  '#f97316', '#06b6d4'
];

function createConfetti() {
  const container = document.getElementById('confetti-container');
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 8;
    const delay = Math.random() * 10;
    const size = 6 + Math.random() * 8;
    const isCircle = Math.random() > 0.5;

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${isCircle ? size : size * 1.6}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      border-radius: ${isCircle ? '50%' : '2px'};
      opacity: 0;
    `;

    container.appendChild(piece);
  }
}
createConfetti();

// ---- SCROLL REVEAL (Simple AOS-like) ----
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
initScrollReveal();

// ---- SMOOTH ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// Active nav style injection
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-links a.active { color: var(--purple-light) !important; }`;
document.head.appendChild(styleEl);

// ---- COUNTER ANIMATION (hero stats) ----
// Simple parallax tilt on hero orbs
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.hero-orb');
  const x = (e.clientX / window.innerWidth - 0.5);
  const y = (e.clientY / window.innerHeight - 0.5);

  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 18;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});
