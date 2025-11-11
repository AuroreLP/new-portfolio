// FILTER PROJECTS
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = Array.from(document.querySelectorAll('.project-card'));

filterButtons.forEach(button => {
  const applyFilter = () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const match = filter === 'all' || tags.includes(filter);

      if (match) {
        showCard(card);
      } else {
        hideCard(card);
      }
    });
  };

  button.addEventListener('click', applyFilter);

  // Keyboard navigation (Enter et Space)
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      // Réutilise EXACTEMENT la même logique que le click
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const match = filter === 'all' || tags.includes(filter);

        if (match) {
          showCard(card);
        } else {
          hideCard(card);
        }
      });
    }

    // Navigation avec flèches (bonus, optionnel)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const buttons = Array.from(filterButtons);
      const currentIndex = buttons.indexOf(button);
      
      let nextIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % buttons.length;
      } else {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      }
      
      buttons[nextIndex].focus();
    }
  });
});


function showCard(card) {
  if (!card.classList.contains('hidden') && !card.classList.contains('hiding')) return;
  card.classList.remove('hidden');
  void card.offsetWidth;
  card.classList.remove('hiding');
}

function hideCard(card) {
  if (card.classList.contains('hiding') || card.classList.contains('hidden')) {
    return;
  }

  const onTransitionEnd = (e) => {
    if (e.propertyName !== 'opacity') return;
    card.removeEventListener('transitionend', onTransitionEnd);
    card.classList.add('hidden');
    card.classList.remove('hiding');
  };

  card.addEventListener('transitionend', onTransitionEnd);

  requestAnimationFrame(() => {
    card.classList.add('hiding');
  });
}