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

  function navigateToSection(link) {
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      });
    }
  }

  function navigateSections(direction) {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentIndex = 0;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
            
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentIndex = index;
        }
    });

    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < sections.length) {
        sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
    }
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

    // Keyboard navigation (Enter et Space)
    link.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateToSection(link);
        }
    });
  });

  // Navigation avec flèches haut/bas entre sections
    document.addEventListener('keydown', (e) => {
        // Seulement si aucun input n'est focus
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateSections(e.key === 'ArrowDown' ? 1 : -1);
        }
    });


  window.addEventListener('scroll', updateSectionIndicator);
  updateSectionIndicator();
});
