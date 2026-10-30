// Appli installable : enregistre le service worker et affiche un bouton « Installer l'appli »
// dans la barre du haut.
// - Ordinateur (Chrome, Edge) : fenêtre d'installation du navigateur.
// - Android : on n'utilise PAS l'installation du navigateur, qui fabrique un paquet Android
//   que Google Play Protect bloque avec un avertissement inquiétant. On explique plutôt
//   comment créer un raccourci sur l'écran d'accueil (même résultat, sans avertissement).
// - iPhone / iPad : explication de « Sur l'écran d'accueil ».
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

  // Ordinateur : le navigateur fournit la fenêtre d'installation.
  // On l'intercepte aussi sur Android pour que Chrome ne propose pas lui-même l'installation.
  let invite = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    if (android) return;
    invite = e;
    bouton.style.display = '';
  });
  window.addEventListener('appinstalled', () => { bouton.style.display = 'none'; });

  bouton.addEventListener('click', async e => {
    e.preventDefault();
    if (android) {
      alert('Pour ajouter l\'appli sur votre téléphone :\n\n' +
            '1. Ouvrez ce site dans Chrome\n' +
            '2. Touchez le menu ⋮ (en haut à droite)\n' +
            '3. Choisissez « Ajouter à l\'écran d\'accueil »\n' +
            '4. Si on vous propose « Installer » ou « Créer un raccourci », choisissez « Créer un raccourci »\n\n' +
            'L\'icône « Pucerons BPI » apparaît alors sur votre écran d\'accueil.');
    } else if (ios) {
      alert('Pour installer l\'appli sur iPhone ou iPad :\n\n' +
            '1. Touchez le bouton Partager (carré avec une flèche vers le haut)\n' +
            '2. Choisissez « Sur l\'écran d\'accueil »\n' +
            '3. Touchez « Ajouter »');
    } else if (invite) {
      invite.prompt();
      await invite.userChoice;
      invite = null;
      bouton.style.display = 'none';
    }
  });
})();
