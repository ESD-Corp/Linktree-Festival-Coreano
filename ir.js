// Enlaces cortos (/ig y /tt): llevan a la página principal con el origen marcado para Analytics.
// Cada carpeta pasa su fuente y su medio en data-fuente y data-medio. Si el enlace corto trae ?v=algo
// (por ejemplo /tt?v=reel-audicion), va como utm_content para distinguir una publicación de otra.
// Los anuncios (p. ej. TikTok Ads con utm_medium=paid) pueden apuntar al enlace corto con sus propios parámetros:
// llegan con medio «paid» y el nombre de su campaña pasa a utm_content (utm_campaign queda en kfestrd2026 para
// que salga la llegada). Las etiquetas que Instagram pone solo en la bio (ig / social / link_in_bio) no cambian
// nada. Los demás parámetros (utm_id, ttclid, fbclid…) se pasan tal cual, para que los píxeles atribuyan el clic.
(function () {
  var s = document.currentScript, entra = new URLSearchParams(location.search), q = new URLSearchParams();
  entra.forEach(function (valor, clave) {
    if (clave !== 'v' && !/^utm_(source|medium|campaign|content)$/.test(clave)) q.set(clave, valor);
  });
  var pauta = /^(paid|cpc|ppc|ads?)$/i.test(entra.get('utm_medium') || '');
  q.set('utm_source', s.dataset.fuente);
  q.set('utm_medium', pauta ? 'paid' : s.dataset.medio);
  q.set('utm_campaign', 'kfestrd2026');
  var contenido = entra.get('v') || (pauta && (entra.get('utm_content') || entra.get('utm_campaign')));
  if (contenido) q.set('utm_content', contenido);
  location.replace('/?' + q + location.hash);
})();
