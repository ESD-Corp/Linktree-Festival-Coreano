// Los botones de la rueda (formularios).
export const BOTONES = [
  { titulo: 'Formulario Expositores', detalle: 'Registro para tener un puesto', url: 'https://docs.google.com/forms/d/e/1FAIpQLSeBt7U1_kzhP4jhPNDD34wx-xxohwMS4JyMyS2vKqWPGKdEZA/viewform', icono: 'puesto.png' },
  { titulo: 'Formulario Voluntarios', detalle: 'Logística, prensa o atención', url: 'https://docs.google.com/forms/d/e/1FAIpQLScb_STZoVUkmY5LVGDxjxt8ojrgZl0zchC12yaxvfW9-xwvDw/viewform', icono: 'hand-heart' },
  { titulo: 'Audición grupos K-Pop', detalle: 'Videos hasta el 31 de octubre', url: 'https://docs.google.com/forms/d/e/1FAIpQLSenH1oB6EPAzSZaOwbWKwLs5yh4_4wBGweBWPvAqOtrShM6Ig/viewform', icono: 'microphone', cierra: '2026-10-31' },
];

// Las dos tiendas de KFeel, fuera de la rueda, como insignias debajo de ella.
// «titulo» es el nombre que llega a Analytics y Meta (el mismo de antes, para no cortar los informes).
export const TIENDAS = [
  { titulo: 'KFeel en iPhone', arriba: 'Descárgalo en el', abajo: 'App Store', url: 'https://apps.apple.com/do/app/kfeel/id6810140328', icono: 'apple' },
  { titulo: 'KFeel Android', arriba: 'Disponible en', abajo: 'Google Play', url: 'https://play.google.com/store/apps/details?id=app.kfeel', icono: 'googleplay' },
];

export function externo(e) {
  return /^https?:/.test(e.url) ? ' target="_blank" rel="noopener"' : '';
}

// Cuenta los días que faltan para el cierre de una convocatoria (en días de calendario, hora local)
export function plazo(e, hoy = new Date()) {
  if (!e.cierra) return null;
  const [a, m, d] = e.cierra.split('-').map(Number);
  const dias = Math.round((new Date(a, m - 1, d) - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 864e5);
  if (dias < 0) return { texto: 'Convocatoria cerrada', cerrado: true };
  if (dias === 0) return { texto: 'Cierra hoy', dias };
  if (dias === 1) return { texto: 'Cierra mañana', dias };
  return { texto: `Cierra en ${dias} días`, dias };
}

// Una vibración muy corta cuando la rueda encaja en otro botón, solo mientras la persona la mueve
export function vibrarAlCambiar(obtenerRueda, N) {
  let anterior = null;
  return p => {
    const i = ((Math.round(p) % N) + N) % N;
    if (i === anterior) return;
    const r = obtenerRueda();
    if (anterior !== null && r && r.modo === 'arrastre' && navigator.vibrate) navigator.vibrate(6);
    anterior = i;
  };
}

// Si algún botón vuelve a quedar sin link (url "#formulario-…"), tocarlo muestra un aviso en vez de no hacer nada
export function avisarPendientes() {
  let aviso, t;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#formulario"]');
    if (!a || e.defaultPrevented) return;
    e.preventDefault();
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.setAttribute('role', 'status');
      Object.assign(aviso.style, {
        position: 'fixed', left: '0', right: '0', bottom: '24px', zIndex: 50, margin: '0 auto',
        width: 'max-content', maxWidth: 'calc(100vw - 40px)', padding: '12px 18px', borderRadius: '14px',
        background: '#23315b', color: '#fff', border: '2px solid #f2dcad',
        font: '600 14px/1.35 var(--letra)', textAlign: 'center',
        transition: 'opacity 200ms ease, translate 260ms cubic-bezier(0.23, 1, 0.32, 1)',
      });
      document.body.append(aviso);
    }
    aviso.textContent = `«${a.querySelector('b')?.textContent ?? 'Este botón'}» todavía no tiene el link del formulario`;
    aviso.style.opacity = '1'; aviso.style.translate = '0 0';
    clearTimeout(t);
    t = setTimeout(() => { aviso.style.opacity = '0'; aviso.style.translate = '0 8px'; }, 2600);
  });
}
