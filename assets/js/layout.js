// ==============================
// 🔍 Détection du bon chemin de base
// ==============================
function getBasePath() {
    const path = window.location.pathname;

    // Cas page d’accueil
    if (path.endsWith('/') || path.endsWith('index.html')) return './';

    // Cas sous-dossier (ex : /projects/xxx.html)
    if (path.includes('/projects/')) return '../';

    // Fallback par défaut
    return './';
}

// ==============================
// 🖼️ Met à jour les logos selon le thème
// ==============================
function updateAllLogos(isDark) {
    const basePath = getBasePath();
    const logoSrc = isDark
        ? `${basePath}assets/img/logo-AL-white.png`
        : `${basePath}assets/img/logo-AL-dark.png`;

    document.querySelectorAll('#logo-header, #logo-footer').forEach(logo => {
        if (logo) logo.src = logoSrc;
    });
}

// ==============================
// 🔗 Corrige les liens relatifs et les logos
// ==============================
function fixLinks() {
    const basePath = getBasePath();

    // Corrige les liens commençant par "./"
    document.querySelectorAll('a[href^="./"]').forEach(link => {
        const href = link.getAttribute('href');
        link.setAttribute('href', href.replace('./', basePath));
    });

    // Corrige les sources d’images
    document.querySelectorAll('#logo-header, #logo-footer').forEach(logo => {
        const src = logo.getAttribute('src');
        logo.setAttribute('src', src.replace('./', basePath));
    });
}

// ==============================
// ⭐ Affiche le section indicator uniquement sur la homepage
// ==============================
function showSectionIndicator() {
    const path = window.location.pathname;
    const isHomepage =
        window.location.pathname.endsWith('/') ||
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/';

    const sectionIndicator = document.querySelector('.section-indicator');
    if (sectionIndicator && isHomepage) {
        sectionIndicator.style.display = 'block';
    }
}

// ==============================
// 📍 Indique la section visible
// ==============================
function updateSectionIndicator() {
    const sections = document.querySelectorAll('section[id]');
    const indicators = document.querySelectorAll('.section-indicator a');

    if (!sections.length || !indicators.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Retirer la classe active de tous les indicateurs
                indicators.forEach(indicator => {
                    const icon = indicator.querySelector('.section-icon');
                    indicator.classList.remove('active');
                    if (icon) icon.setAttribute('name', 'ellipse-outline');
                });
                
                // Ajouter la classe active à l'indicateur correspondant
                const activeIndicator = document.querySelector(`.section-indicator a[data-section="${sectionId}"]`);
                if (activeIndicator) {
                    activeIndicator.classList.add('active');
                    const activeIcon = activeIndicator.querySelector('.section-icon');
                    if (activeIcon) activeIcon.setAttribute('name', 'star');
                }
            }
        });
    }, {
        threshold: 0.5 // La section doit être visible à 50% pour être considérée active
    });
    
    // Observer toutes les sections
    sections.forEach(section => observer.observe(section));
}

// ==============================
// 📥 Chargement du header
// ==============================
async function loadHeader() {
    const basePath = getBasePath();
    try {
        const response = await fetch(`${basePath}header.html`);
        const html = await response.text();
        document.getElementById('header-placeholder').outerHTML = html;
        
        fixLinks();
        showSectionIndicator();
        initializeHeaderEvents();
    } catch (error) {
        console.error('Erreur chargement header:', error);
    }
}

// ==============================
// 📥 Chargement du footer
// ==============================
async function loadFooter() {
    const basePath = getBasePath();
    try {
        const response = await fetch(`${basePath}footer.html`);
        const html = await response.text();
        document.getElementById('footer-placeholder').outerHTML = html;
        
        fixLinks();
    } catch (error) {
        console.error('Erreur chargement footer:', error);
    }
}

// ==============================
// 🌗 Applique le thème au chargement
// ==============================
function applyThemeOnLoad() {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    updateAllLogos(isDarkMode);
}

// ==============================
// 🎛️ Initialise les événements du header
// ==============================
function initializeHeaderEvents() {
    // BURGER MENU TOGGLE
    const burger = document.querySelector('.burger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-overlay a');

    if (burger && menuOverlay) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });

        // Keyboard navigation sur le burger (Enter et Space)
        burger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                burger.classList.toggle('active');
                menuOverlay.classList.toggle('active');
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                burger.classList.remove('active');
                menuOverlay.classList.remove('active');
            }
        });

        // Focus trap dans le menu (empêche de tabber en dehors)
        menuOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = menuOverlay.querySelectorAll(
                    'a[href], button:not([disabled])'
                );
                
                if (focusableElements.length === 0) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // Tab sur le dernier élément → retour au premier
                if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
                
                // Shift+Tab sur le premier élément → aller au dernier
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            }
        });

        // fermeture sur click des liens
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        });
    }

    // DARK MODE TOGGLE
    const darkBtn = document.getElementById('darkBtn');
    
    if (darkBtn) {
        const icon = darkBtn.querySelector('ion-icon');
        const savedTheme = localStorage.getItem('theme');
        const isDarkMode = savedTheme === 'dark';
        
        if (icon) {
            icon.setAttribute('name', isDarkMode ? 'sunny-outline' : 'moon-outline');
        }

        darkBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            if (icon) {
                icon.setAttribute('name', isDark ? 'sunny-outline' : 'moon-outline');
            }

            updateAllLogos(isDark);
        });
    }

    // SECTION INDICATOR
    updateSectionIndicator();
}

// ==============================
// 🚀 Exécution automatique
// ==============================
document.addEventListener('DOMContentLoaded', async () => {
    // Charger header et footer
    if (document.getElementById('header-placeholder')) await loadHeader();
    if (document.getElementById('footer-placeholder')) await loadFooter();
    
    // Appliquer le thème après chargement
    setTimeout(() => {
        applyThemeOnLoad();
    }, 100);
});