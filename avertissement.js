// Bandeau d'avertissement refermable. Une fois fermé, il reste masqué 30 jours sur cet appareil,
// puis réapparaît pour rappeler que les données sont passées.
(function () {
  const bandeau = document.getElementById('avertissement');
  if (!bandeau) return;
  const CLE = 'pucerons-avertissement-ferme';
  const DUREE = 30 * 24 * 3600 * 1000;

  let fermeLe = 0;
  try { fermeLe = Number(localStorage.getItem(CLE)) || 0; } catch (e) {}
  if (Date.now() - fermeLe < DUREE) {
    bandeau.style.display = 'none';
    return;
  }

  const bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'fermer-avertissement';
  bouton.setAttribute('aria-label', 'Fermer l\'avertissement');
  bouton.textContent = '✕';
  bandeau.appendChild(bouton);

  bouton.addEventListener('click', () => {
    bandeau.style.display = 'none';
    try { localStorage.setItem(CLE, String(Date.now())); } catch (e) {}
    // La carte et le graphique reprennent la place libérée
    window.dispatchEvent(new Event('resize'));
  });
})();
