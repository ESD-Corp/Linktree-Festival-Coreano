// Los 5 botones del linktree. Los "#formulario-…" esperan el link real del Google Form.
export const BOTONES = [
  { titulo: 'Formulario Expositores', detalle: 'Registro para tener un puesto', url: '#formulario-expositores', icono: 'puesto.png' },
  { titulo: 'Formulario Voluntarios', detalle: 'Logística, prensa o atención', url: 'https://docs.google.com/forms/d/e/1FAIpQLScb_STZoVUkmY5LVGDxjxt8ojrgZl0zchC12yaxvfW9-xwvDw/viewform', icono: 'hand-heart' },
  { titulo: 'Formulario K-Pop dance crews', detalle: 'Videos hasta el 20 de octubre', url: '#formulario-kpop-dance-crews', icono: 'microphone', cierra: '2026-10-20' },
  { titulo: 'KFeel App Store', detalle: 'Tu entrada al festival, para iPhone', url: 'https://apps.apple.com/do/app/kfeel/id6810140328', icono: 'love-kpop' },
  { titulo: 'KFeel Google Play', detalle: 'Tu entrada al festival, para Android', url: 'https://play.google.com/store/apps/details?id=app.kfeel', icono: 'love-kpop' },
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

// Mientras falten los links de los Google Forms, tocar esos botones muestra un aviso en vez de no hacer nada
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
