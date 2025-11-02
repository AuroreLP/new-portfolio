// SECTION INDICATOR (uniquement pour homepage)
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si on est sur la homepage
  const isHomepage = window.location.pathname.endsWith('/') || 
                     window.location.pathname.endsWith('index.html') ||
                     window.location.pathname === '/';
  
  if (!isHomepage) return; // Ne pas exécuter si pas sur homepage

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.section-indicator a');
  const icons = document.querySelectorAll('.section-icon');

  function updateSectionIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        if (icons[index]) {
          icons[index].classList.add('active');
          icons[index].setAttribute('name', 'star');
        }

        icons.forEach((icon, i) => {
          if (i !== index) {
            icon.classList.remove('active');
            icon.setAttribute('name', 'ellipse-outline');
          }
        });
      }
    });
  }

  // Scroll fluide vers la section correspondante
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', updateSectionIndicator);
  updateSectionIndicator();
});
