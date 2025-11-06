// SEND EMAIL FROM CONTACT FORM
const form = document.getElementById('contact-form');
const messageEl = document.getElementById('form-message');

if (form && messageEl) {
  const startField = document.getElementById('form_start');
  if (startField) startField.value = Date.now();

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

    // Empêche double clic
    submitBtn.disabled = true;

    // Envoi EmailJS
    emailjs.sendForm('service_l7c5sg4', 'template_bb4jbs8', this)
      .then(() => {
        messageEl.textContent = "✅ Message envoyé avec succès !";
        messageEl.className = "success visible";
        form.reset();
        setTimeout(() => messageEl.className = "hidden", 5000);
      })
      .catch(() => {
        messageEl.textContent = "❌ Erreur lors de l'envoi. Veuillez réessayer.";
        messageEl.className = "error visible";
        setTimeout(() => messageEl.className = "hidden", 5000);
      })
      .finally(() => {
        submitBtn.disabled = false; // réactive le bouton après l'envoi
        if (startField) startField.value = Date.now(); // remet à zéro le timer
      });
  });
}