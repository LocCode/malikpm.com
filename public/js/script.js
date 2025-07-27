const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const icon = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');

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
