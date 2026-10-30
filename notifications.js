// Notifications OneSignal : bouton « M'avertir » dans la barre du haut.
// Ne fonctionne que sur le site en ligne (OneSignal refuse les autres adresses).
(function () {
  const APP_ID = 'd6c71484-69c4-4fe8-9cc5-e823ed698e26';
  if (location.hostname !== 'puceron-bpi.github.io') return;

  const nav = document.querySelector('#topbar nav');
  if (!nav) return;
  const bouton = document.createElement('a');
  bouton.href = '#';
  bouton.style.display = 'none';
  nav.appendChild(bouton);

  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const installee = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
  script.defer = true;
  document.head.appendChild(script);

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function (OneSignal) {
    await OneSignal.init({
      appId: APP_ID,
      serviceWorkerPath: 'carte-puceron/OneSignalSDKWorker.js',
      serviceWorkerParam: { scope: '/carte-puceron/' }
    });

    const abonne = () => OneSignal.User.PushSubscription.optedIn;
    const maj = () => {
      bouton.textContent = abonne() ? '🔕 Ne plus m\'avertir' : '🔔 M\'avertir des mises à jour';
      bouton.style.display = '';
    };
    OneSignal.User.PushSubscription.addEventListener('change', maj);
    maj();

    bouton.addEventListener('click', async e => {
      e.preventDefault();
      if (abonne()) {
        await OneSignal.User.PushSubscription.optOut();
      } else if (ios && !installee) {
        alert('Sur iPhone et iPad, les notifications ne fonctionnent que depuis l\'appli installée.\n\n' +
              '1. Touchez le bouton Partager (carré avec une flèche vers le haut)\n' +
              '2. Choisissez « Sur l\'écran d\'accueil »\n' +
              '3. Ouvrez l\'appli « Pucerons BPI » et touchez « M\'avertir »');
        return;
      } else if (!OneSignal.Notifications.isPushSupported()) {
        alert('Ce navigateur ne permet pas de recevoir les notifications.');
        return;
      } else {
        await OneSignal.User.PushSubscription.optIn();
      }
      maj();
    });
  });
})();
