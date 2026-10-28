// Enlaces cortos (/ig y /tt): llevan a la página principal con el origen marcado para Analytics.
// Cada carpeta pasa su fuente y su medio en data-fuente y data-medio. Si el enlace corto trae ?v=algo
// (por ejemplo /tt?v=reel-audicion), va como utm_content para distinguir una publicación de otra.
(function () {
  var s = document.currentScript, q = new URLSearchParams();
  q.set('utm_source', s.dataset.fuente);
  q.set('utm_medium', s.dataset.medio);
  q.set('utm_campaign', 'kfestrd2026');
  var v = new URLSearchParams(location.search).get('v');
  if (v) q.set('utm_content', v);
  location.replace('/?' + q + location.hash);
})();
