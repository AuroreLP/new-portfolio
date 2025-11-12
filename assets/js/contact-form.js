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

  // Affichage des messages
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

  // Nettoyage des champs
  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    let sanitized = div.innerHTML.replace(/[<>]/g, '').trim();
    const MAX_LENGTH = 5000;
    return sanitized.length > MAX_LENGTH ? sanitized.substring(0, MAX_LENGTH) : sanitized;
  }

  // Rate limiting localStorage
  function checkRateLimit() {
    const now = Date.now();
    let submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
    submissions = submissions.filter(time => now - time < TIME_WINDOW);

    if (submissions.length >= MAX_SUBMISSIONS) {
      const retryMinutes = Math.ceil((TIME_WINDOW - (now - submissions[0])) / 60000);
      return { allowed: false, message: `Trop de soumissions. Réessayez dans ${retryMinutes} minute(s).` };
    }

    submissions.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    return { allowed: true };
  }

  // -----------------------------
  // Gestion du formulaire
  // -----------------------------
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const honeypot = document.getElementById('website_url'); // ✅ champ honeypot
      const submitBtn = form.querySelector("button[type=submit]");
      const startTime = parseInt(startField.value, 10);
      const elapsed = Date.now() - startTime;

      // 🪤 Honeypot
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn("Bot détecté (honeypot rempli)");
        return;
      }

      // ⏱️ Temps de remplissage trop court
      if (elapsed < 2000) {
        console.warn("Bot détecté (trop rapide)");
        return;
      }

      // 🔁 Rate limiting
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        showMessage(rateLimit.message, 'error');
        return;
      }

      // 📧 Validation email
      const emailValidation = validateEmail(form.email.value);
      if (!emailValidation.valid) {
        showMessage(emailValidation.error, 'error');
        return;
      }

      // 🧠 Vérification reCAPTCHA
      if (typeof grecaptcha === 'undefined') {
        showMessage("Erreur : reCAPTCHA non chargé. Veuillez recharger la page.", 'error');
        return;
      }

      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        showMessage("⚠️ Veuillez cocher la case 'Je ne suis pas un robot'", 'error');
        return;
      }

      // 🧼 Nettoyage & préparation des données
      const templateParams = {
        firstname: sanitizeInput(form.firstname.value),
        lastname: sanitizeInput(form.lastname.value),
        email: sanitizeInput(form.email.value),
        subject: sanitizeInput(form.subject.value),
        message: sanitizeInput(form.message.value),
        'g-recaptcha-response': recaptchaResponse
      };

      // 🔒 Empêche le double clic
      submitBtn.disabled = true;

      // 📤 Envoi via EmailJS
      await emailjs.send('service_l7c5sg4', 'template_bb4jbs8', templateParams);

      showMessage("✅ Message envoyé avec succès !", 'success');
      form.reset();
      grecaptcha.reset();

    } catch (err) {
      console.error("Erreur inattendue :", err);
      showMessage("❌ Une erreur interne est survenue. Veuillez réessayer plus tard.", 'error');
    } finally {
      const submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = false;

      // 🕒 Réinitialiser le timer après un court délai
      setTimeout(() => {
        if (startField) startField.value = Date.now();
      }, 1000);
    }
  });
}
