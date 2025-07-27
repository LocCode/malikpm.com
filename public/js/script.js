const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');
const contactLinks = document.querySelector('.contact_links');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.textContent = '☀️';
    label.textContent = 'Light Mode';
}

// Toggle theme
toggleButton.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');

    icon.classList.add('animate');
    icon.textContent = isDark ? '☀️' : '🌙';
    label.textContent = isDark ? 'Light Mode' : 'Dark Mode';

    setTimeout(() => icon.classList.remove('animate'), 400);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// === Scroll-based Mobile Contact Links Toggle === //
let lastScrollY = window.scrollY;

function isMobile() {
    return window.innerWidth <= 768;
}

// Initial setup: hide the panel on load if mobile
if (isMobile() && contactLinks) {
    contactLinks.style.transform = 'translateY(100%)';
}

// Scroll behavior
window.addEventListener('scroll', () => {
    if (!isMobile() || !contactLinks) return;

    if (window.scrollY > lastScrollY) {
        // Scrolling down
        contactLinks.style.transform = 'translateY(0)';
    } else {
        // Scrolling up
        contactLinks.style.transform = 'translateY(100%)';
    }

    lastScrollY = window.scrollY;
});

// Resize handler (e.g. switching between mobile and desktop)
window.addEventListener('resize', () => {
    if (!contactLinks) return;

    if (!isMobile()) {
        contactLinks.style.transform = 'translateY(0)';
    } else {
        contactLinks.style.transform = 'translateY(100%)';
    }
});
