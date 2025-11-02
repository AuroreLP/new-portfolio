// SEND EMAIL FROM CONTACT FORM
const form = document.getElementById('contact-form');
const messageEl = document.getElementById('form-message');

if (form && messageEl) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('service_l7c5sg4', 'template_bb4jbs8', this)
      .then(() => {
        messageEl.textContent = "✅ Message envoyé avec succès !";
        messageEl.className = "success visible";
        form.reset();
        setTimeout(() => messageEl.className = "hidden", 5000);
      }, (error) => {
        messageEl.textContent = "❌ Erreur lors de l'envoi. Veuillez réessayer.";
        messageEl.className = "error visible";
        setTimeout(() => messageEl.className = "hidden", 5000);
      });
  });
}