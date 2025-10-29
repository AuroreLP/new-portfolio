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