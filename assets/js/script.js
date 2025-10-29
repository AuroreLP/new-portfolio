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

// SECTION INDICATOR UPDATE
const sections = document.querySelectorAll('section');
const sectionIndicator = document.querySelector('.section-indicator');

function updateSectionIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            sectionIndicator.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        }
    });
}

window.addEventListener('scroll', updateSectionIndicator);
updateSectionIndicator();