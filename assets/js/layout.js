// Détecte le bon chemin de base selon la profondeur du fichier
function getBasePath() {
    const path = window.location.pathname;
    // Si on est sur la racine (index.html ou /)
    if (path.endsWith('/') || path.endsWith('index.html')) return './';
    // Sinon on est dans un sous-dossier (ex: /projects/memorygame.html)
    return '../';
}

// Fonction pour charger le header
function loadHeader() {
    const basePath = getBasePath();
    // Détecte si on est sur la homepage
    const isHomepage =
        window.location.pathname.endsWith('/') ||
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/';
    
    // Section indicator uniquement pour la homepage
    const sectionIndicator = isHomepage ? `
    <div class="section-indicator">
        <a href="#hero" aria-label="Go to hero section"><ion-icon class="section-icon" name="ellipse-outline"></ion-icon></a>
        <a href="#projects" aria-label="Go to projects section"><ion-icon class="section-icon" name="ellipse-outline"></ion-icon></a>
        <a href="#about" aria-label="Go to about section"><ion-icon class="section-icon" name="ellipse-outline"></ion-icon></a>
        <a href="#contact" aria-label="Go to contact section"><ion-icon class="section-icon" name="ellipse-outline"></ion-icon></a>
    </div>` : '';
    
    // Structure du header
    const headerHTML = `
    <header class="navbar">
        <div class="top-nav">
            <a href="${basePath}index.html#hero" class="logo">
                <img id="logo" src="${basePath}assets/img/logo-AL-dark.png" alt="Logo" loading="lazy">
            </a>
            <button class="burger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>
    
    <div class="menu-overlay">
        <ul>
            <li><a href="${basePath}index.html#hero">Home</a></li>
            <li><a href="${basePath}index.html#projects">Projects</a></li>
            <li><a href="${basePath}index.html#about">About</a></li>
            <li><a href="${basePath}index.html#contact">Contact</a></li>
        </ul>
    </div>
    
    <div class="section-socials">
        <div class="github"><a href="https://github.com/AuroreLP" target="_blank" aria-label="GitHub"><ion-icon class="socials-logo" name="logo-github"></ion-icon></a></div>
        <div class="linkedin"><a href="https://www.linkedin.com/in/aurore-le-perff/" target="_blank" aria-label="LinkedIn"><ion-icon class="socials-logo" name="logo-linkedin"></ion-icon></a></div>
        <div id="darkBtn">
            <ion-icon class="socials-logo darkBtn" name="moon-outline" aria-label="Darkor Light mode"></ion-icon>
        </div>
    </div>
    ${sectionIndicator}`;
    
    // Injection du header dans le DOM
    document.getElementById('header-placeholder').outerHTML = headerHTML;

    // 🔥 Initialisation des événements (menu + dark mode)
    initializeHeaderEvents();
}

// Fonction pour charger le footer
function loadFooter() {
    const basePath = getBasePath();
    const footerHTML = `
    <footer>
        <div class="footer-elements">
            <div class="footer-logo">
                <a href="${basePath}index.html#hero" class="logo">
                    <img id="logo" src="${basePath}assets/img/logo-AL-dark.png" alt="Logo" loading="lazy">
                </a>
            </div>
            <div class="footer-links">
                <a href="${basePath}index.html#projects">Projects</a>
                <a href="${basePath}index.html#about">About</a>
                <a href="${basePath}index.html#contact">Contact</a>
            </div>
            <div class="footer-legal">
                <a href="${basePath}legal-notices.html">Legal Notices</a> 
                <a href="${basePath}privacy-policy.html">Privacy Policy</a>
            </div>
            <div class="footer-legal">
                <p>© Aurore Le Perff 2025</p>
            </div>
        </div>
    </footer>`;
    
    document.getElementById('footer-placeholder').outerHTML = footerHTML;
}


// Fonction pour initialiser les événements du header après son chargement
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
        const logo = document.getElementById('logo');
        
        // Appliquer le thème sauvegardé au chargement
        const savedTheme = localStorage.getItem('theme');
        const isDarkMode = savedTheme === 'dark';

        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if (icon) icon.setAttribute('name', 'sunny-outline');
        } else {
            if (icon) icon.setAttribute('name', 'moon-outline');
            if (logo) logo.src = `${getBasePath()}assets/img/logo-AL-dark.png`;
        }

        // Gérer le clic
        darkBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Changer l'icône selon le thème
            if (icon) {
                icon.setAttribute('name', isDark ? 'sunny-outline' : 'moon-outline');
            }

                        // 🔥 Changer le logo selon le thème
            if (logo) {
                logo.src = isDark
                    ? `${getBasePath()}assets/img/logo-AL-white.png`
                    : `${getBasePath()}assets/img/logo-AL-dark.png`;
            }
        });
    }
}


// Exécution automatique après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('header-placeholder')) loadHeader();
    if (document.getElementById('footer-placeholder')) loadFooter();
});