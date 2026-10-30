// Appli installable : enregistre le service worker et affiche un bouton « Installer l'appli »
// dans la barre du haut.
// - Quand le navigateur propose l'installation (Chrome, Edge, Samsung Internet…), le bouton
//   l'ouvre directement. Sur Android hors Chrome, Google Play Protect peut afficher un
//   avertissement : choix assumé, l'installation reste possible et simple.
// - iPhone / iPad : explication de « Sur l'écran d'accueil ».
// - Android sans proposition d'installation : explication du raccourci.
(function () {
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('OneSignalSDKWorker.js', { scope: './' }).catch(() => {});
  }

  const dejaInstallee = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (dejaInstallee) return;

  const nav = document.querySelector('#topbar nav');
  if (!nav) return;
  const bouton = document.createElement('a');
  bouton.href = '#';
  bouton.textContent = '📲 Installer l\'appli';
  bouton.style.display = 'none';
  nav.appendChild(bouton);

  const android = /android/i.test(navigator.userAgent);
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (android || ios) bouton.style.display = '';

  let invite = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();   // pas de bandeau automatique : l'installation passe par le bouton
    invite = e;
    bouton.style.display = '';
  });
  window.addEventListener('appinstalled', () => { bouton.style.display = 'none'; });

  bouton.addEventListener('click', async e => {
    e.preventDefault();
    if (invite) {
      invite.prompt();
      await invite.userChoice;
      invite = null;
      bouton.style.display = 'none';
    } else if (ios) {
      alert('Pour installer l\'appli sur iPhone ou iPad :\n\n' +
            '1. Touchez le bouton Partager (carré avec une flèche vers le haut)\n' +
            '2. Choisissez « Sur l\'écran d\'accueil »\n' +
            '3. Touchez « Ajouter »');
    } else if (android) {
      alert('Pour avoir l\'appli sur votre écran d\'accueil :\n\n' +
            'ouvrez le menu du navigateur (⋮ ou ≡) puis « Installer l\'application », ' +
            '« Ajouter à l\'écran d\'accueil » ou « Ajouter la page à › Écran d\'accueil ».');
    }
  });
})();
