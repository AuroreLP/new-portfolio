// FILTER PROJECTS
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = Array.from(document.querySelectorAll('.project-card'));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const match = filter === 'all' || tags.includes(filter);

      // Si la carte doit être visible -> show
      if (match) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
  });
});

function showCard(card) {
  // Si elle est déjà visible, rien à faire
  if (!card.classList.contains('hidden') && !card.classList.contains('hiding')) return;

  // Retirer la classe hidden (qui met display:none)
  card.classList.remove('hidden');

  // Forcer un reflow pour que la suppression de display:none soit prise en compte
  // (permet ensuite d'animer la suppression de la classe .hiding si elle existait)
  void card.offsetWidth;

  // Retirer l'état "hiding" pour animer l'entrée (CSS gère transition)
  card.classList.remove('hiding');
}

function hideCard(card) {
  // Si elle est déjà en train de se cacher ou déjà cachée, on ne ré-attache pas plusieurs handlers
  if (card.classList.contains('hiding') || card.classList.contains('hidden')) {
    // si déjà hiding, on s'assure qu'un handler est présent (ou pas)
    return;
  }

  // Ajout d'une seule fonction de gestion de fin de transition (on la stocke pour pouvoir la supprimer)
  const onTransitionEnd = (e) => {
    // on vérifie la propriété pour éviter les multiples appels (transform & opacity)
    if (e.propertyName !== 'opacity') return;

    // retirer l'écouteur
    card.removeEventListener('transitionend', onTransitionEnd);

    // une fois la transition finie, retirer du flux
    card.classList.add('hidden');

    // s'assurer que l'état hiding est bien retiré
    card.classList.remove('hiding');
  };

  // attacher le handler
  card.addEventListener('transitionend', onTransitionEnd);

  // déclencher l'animation de sortie (dans la frame suivante pour être sûr)
  requestAnimationFrame(() => {
    card.classList.add('hiding');
  });

}

// SECTION INDICATOR
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.section-indicator a');
const icons = document.querySelectorAll('.section-icon');

function updateSectionIndicator() {
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Active cette icône
      icons[index].classList.add('active');
      icons[index].setAttribute('name', 'star');

      // Désactive les autres
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
