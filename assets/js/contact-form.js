// SEND EMAIL FROM CONTACT FORM
const form = document.getElementById('contact-form');
const messageEl = document.getElementById('form-message');

if (form && messageEl) {
  const startField = document.getElementById('form_start');
  if (startField) startField.value = Date.now();

  const RATE_LIMIT_KEY = 'form_submissions';
  const MAX_SUBMISSIONS = 3;
  const TIME_WINDOW = 3600000; // 1 heure en ms

  // -----------------------------
  // Fonctions utilitaires
  // -----------------------------

  // Affichage des erreurs / succès
  function showMessage(text, type = 'error') {
    messageEl.textContent = text;
    messageEl.className = `${type} visible`;
    setTimeout(() => (messageEl.className = 'hidden'), 5000);
  }

  // Validation email
  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com',
      'mailinator.com', 'throwaway.email'
    ];
    const domain = email.split('@')[1];

    if (!regex.test(email)) {
      return { valid: false, error: 'Format email invalide' };
    }
    if (disposableDomains.includes(domain)) {
      return { valid: false, error: 'Emails jetables non acceptés' };
    }
    return { valid: true };
  }

  // Sanitization des champs
  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    let sanitized = div.innerHTML
      .replace(/[<>]/g, '')
      .trim();

    const MAX_LENGTH = 5000;
    if (sanitized.length > MAX_LENGTH) {
      sanitized = sanitized.substring(0, MAX_LENGTH);
    }
    return sanitized;
  }

  // Rate limiting localStorage
  function checkRateLimit() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');

    // Garder seulement celles dans la fenêtre de temps
    submissions = submissions.filter(time => now - time < TIME_WINDOW);

    if (submissions.length >= MAX_SUBMISSIONS) {
      const retryMinutes = Math.ceil((TIME_WINDOW - (now - submissions[0])) / 60000);
      return {
        allowed: false,
        message: `Trop de soumissions. Réessayez dans ${retryMinutes} minute(s).`
      };
    }

    submissions.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    return { allowed: true };
  }

  // -----------------------------
  // Gestion du formulaire
  // -----------------------------

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const honeypot = document.getElementById('company');
    const submitBtn = form.querySelector("button[type=submit]");
    const startTime = parseInt(startField.value, 10);
    const elapsed = Date.now() - startTime;

    // Protection anti-bot : honeypot rempli ?
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Bot détecté (honeypot rempli)");
      return;
    }

    // Protection : temps de remplissage trop court (<2s)
    if (elapsed < 2000) {
      console.warn("Bot détecté (trop rapide)");
      return;
    }

    // Rate limiting
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      showMessage(rateLimit.message, 'error');
      return;
    }

    // Validation email
    const emailValidation = validateEmail(form.email.value);
    if (!emailValidation.valid) {
      showMessage(emailValidation.error, 'error');
      return;
    }

    // Vérifier que reCAPTCHA est validé
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      showMessage("⚠️ Veuillez cocher la case 'Je ne suis pas un robot'", 'error');
      return;
    }

    // 🧼 Nettoyage & préparation des données
    const templateParams = {
      name: sanitizeInput(form.name.value),
      email: sanitizeInput(form.email.value),
      message: sanitizeInput(form.message.value),
      'g-recaptcha-response': recaptchaResponse
    };

    // 🔒 Empêche le double clic
    submitBtn.disabled = true;

    // -----------------------------
    // Envoi via EmailJS
    // -----------------------------
    emailjs.sendForm('service_l7c5sg4', 'template_bb4jbs8', this)
      .then(() => {
        showMessage("✅ Message envoyé avec succès !", 'success');
        form.reset();
        grecaptcha.reset();
      })
      .catch(() => {
        showMessage("❌ Erreur lors de l'envoi. Veuillez réessayer.", 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        if (startField) startField.value = Date.now();
      });
  });
}