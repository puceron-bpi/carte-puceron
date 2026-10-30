// Appli installable : enregistre le service worker et affiche un bouton « Installer l'appli »
// dans la barre du haut quand c'est possible.
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

  // Chrome, Edge, Android : le navigateur fournit la fenêtre d'installation
  let invite = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    invite = e;
    bouton.style.display = '';
  });
  window.addEventListener('appinstalled', () => { bouton.style.display = 'none'; });

  // iPhone / iPad (Safari) : pas de fenêtre d'installation, on explique la manipulation
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) bouton.style.display = '';

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
    }
  });
})();
