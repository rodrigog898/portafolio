// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const body = document.body;

let isDark = true;

function applyTheme(dark) {
    body.classList.toggle('light', !dark);
    sunIcon.style.display = dark ? 'none' : 'block';
    moonIcon.style.display = dark ? 'block' : 'none';
}

applyTheme(isDark);

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme(isDark);
});

// ===== Header scroll effect =====
const siteHeader = document.getElementById('siteHeader');

function updateHeader() {
    siteHeader.classList.toggle('scrolled', window.scrollY > 20);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function getHeaderOffset() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
    return (parseInt(value, 10) || 68) + 40;
}

function updateActiveNav() {
    const fromTop = getHeaderOffset();
    let currentId = '';

    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= fromTop) {
            currentId = section.id;
        }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        currentId = sections[sections.length - 1].id;
    }

    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
}

let navTicking = false;

function onScrollNav() {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
        updateActiveNav();
        navTicking = false;
    });
}

updateActiveNav();
window.addEventListener('scroll', onScrollNav, { passive: true });
window.addEventListener('resize', updateActiveNav);

// ===== Fade-in Animations =====
const fadeEls = document.querySelectorAll(
    '.section-inner, .hero-content, .hero-aside, .profile-showcase, .exp-card, .project-card, .feature-card, .stack-group, .cert-card, .contact-cv-card, .contact-link'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// ===== Copy Discord username =====
const DISCORD_USERNAME = '.rodrigog';

document.querySelectorAll('[data-copy-discord]').forEach(trigger => {
    trigger.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(DISCORD_USERNAME);
        } catch {
            const input = document.createElement('textarea');
            input.value = DISCORD_USERNAME;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }

        if (trigger.classList.contains('contact-link')) {
            const label = trigger.querySelector('.contact-link-text span:last-child');
            if (label) {
                const original = label.textContent;
                label.textContent = 'Usuario copiado';
                trigger.classList.add('copied');
                setTimeout(() => {
                    label.textContent = original;
                    trigger.classList.remove('copied');
                }, 1800);
            }
        } else {
            trigger.setAttribute('aria-label', 'Usuario de Discord copiado');
            setTimeout(() => trigger.setAttribute('aria-label', 'Copiar usuario de Discord'), 1800);
        }
    });
});
