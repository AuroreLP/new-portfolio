// BURGER MENU TOGGLE
const burger = document.querySelector('.burger');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-overlay a');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
});

// DARK MODE TOGGLE
const darkBtn = document.getElementById('darkBtn');
const icon = darkBtn.querySelector('ion-icon');

darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Changer l'icône selon le thème
    icon.setAttribute('name', isDarkMode ? 'sunny-outline' : 'moon-sharp');
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        icon.setAttribute('name', 'sunny-outline');
    } else {
        icon.setAttribute('name', 'moon-sharp');
    }
});
