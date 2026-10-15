// Motor compartido de la rueda: una posición continua `p` (en unidades de botón) que da la vuelta
// sin fin. Cada versión solo decide cómo se coloca un botón según su distancia `d` al centro.
//
// - Gira sola despacio; se detiene al tocar, pasar el mouse o enfocar con teclado, y vuelve a los 3.5 s.
// - Arrastre 1:1 con el dedo, inercia proyectada y muelle críticamente amortiguado al soltar.
// - Rueda del mouse / trackpad, flechas del teclado y Tab (cada enlace enfocado viene al centro).
// - Con "reducir movimiento" no gira sola y los saltos son instantáneos.

const reducir = matchMedia('(prefers-reduced-motion: reduce)');

export function crearRueda({
  escenario,          // elemento que recibe arrastre
  items,              // <a class="item"> en orden
  colocar,            // (el, d, i) => aplica transform/opacity
  alCuadro = () => {},// (p) => extras por cuadro (anillos, leyendas…)
  paso = 64,          // px de arrastre que equivalen a un botón
  giro = 0.14,        // botones por segundo del giro automático
  toqueDirecto = Infinity, // |d| máximo para abrir con un toque; más lejos, el toque lo trae al centro
  sentido = () => 1,  // permite invertir el arrastre según dónde empieza (órbita)
  respuesta = 0.45,   // s, como la "response" de los muelles de Apple
  inicio = -2.5,      // desde dónde arranca el giro de entrada
}) {
  const N = items.length;
  const envolver = x => (((x + N / 2) % N) + N) % N - N / 2;
  let p = reducir.matches ? 0 : inicio, v = 0, objetivo = 0, modo = 'quieto';
  let raf = 0, ultimo = 0, reanudar = 0, ruedaT = 0;
  let encima = false, enfocado = false, arrastre = null, arrastro = false;

  function pintar() {
    for (let i = 0; i < N; i++) {
      const el = items[i], d = envolver(i - p);
      colocar(el, d, i);
      const activo = Math.abs(d) < 0.5;
      if (el._activo !== activo) { el._activo = activo; el.classList.toggle('activo', activo); }
    }
    alCuadro(p);
  }

  function cuadro(t) {
    const dt = Math.min(0.05, ultimo ? (t - ultimo) / 1000 : 0);
    ultimo = t;
    if (modo === 'auto') {
      v += (giro - v) * Math.min(1, dt * 1.5);
      p += v * dt;
    } else if (modo === 'muelle') {
      const k = (2 * Math.PI / respuesta) ** 2, c = 4 * Math.PI / respuesta; // amortiguación = 1
      for (let s = dt; s > 0; s -= 1 / 240) {
        const h = Math.min(s, 1 / 240);
        v += (-k * (p - objetivo) - c * v) * h;
        p += v * h;
      }
      if (Math.abs(p - objetivo) < 5e-4 && Math.abs(v) < 5e-3) {
        p = objetivo; v = 0; modo = 'quieto'; programarReanudar();
      }
    }
    pintar();
    raf = modo === 'quieto' || modo === 'arrastre' ? 0 : requestAnimationFrame(cuadro);
  }

  function arrancar() { if (!raf) { ultimo = 0; raf = requestAnimationFrame(cuadro); } }

  function irA(t, vel = v) {
    clearTimeout(reanudar);
    objetivo = t;
    if (reducir.matches) { p = t; v = 0; modo = 'quieto'; pintar(); programarReanudar(); return; }
    v = vel; modo = 'muelle'; arrancar();
  }

  // El entero más cercano a p que corresponde al botón i
  const destinoDe = i => Math.round(p) + Math.round(envolver(i - Math.round(p)));

  function programarReanudar() {
    clearTimeout(reanudar);
    if (!giro || reducir.matches) return;
    reanudar = setTimeout(() => {
      if (encima || enfocado || arrastre) return programarReanudar();
      modo = 'auto'; v = 0; arrancar();
    }, 3500);
  }

  function frenar() {
    clearTimeout(reanudar);
    if (modo === 'auto') irA(Math.round(p + v * 0.4));
  }

  // ---- Arrastre ----
  escenario.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    clearTimeout(reanudar);
    // Se agarra en pleno vuelo: queda donde está, sin salto
    if (modo === 'auto' || modo === 'muelle') { modo = 'quieto'; v = 0; }
    arrastre = { y0: e.clientY, p0: p, id: e.pointerId, s: sentido(e), muestras: [[e.timeStamp, p]], activo: false };
    arrastro = false;
  });

  escenario.addEventListener('pointermove', e => {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    if (!arrastre.activo) {
      if (Math.abs(e.clientY - arrastre.y0) < 6) return; // histéresis antes de comprometer el arrastre
      arrastre.activo = true; arrastro = true; modo = 'arrastre';
      arrastre.y0 = e.clientY; arrastre.p0 = p;
      escenario.setPointerCapture(e.pointerId);
    }
    p = arrastre.p0 - arrastre.s * (e.clientY - arrastre.y0) / paso;
    const m = arrastre.muestras;
    m.push([e.timeStamp, p]);
    while (m.length > 2 && e.timeStamp - m[0][0] > 100) m.shift();
    pintar();
  });

  function soltar(e) {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    const a = arrastre; arrastre = null;
    if (!a.activo) { if (p !== Math.round(p)) irA(Math.round(p), 0); else programarReanudar(); return; }
    const m = a.muestras, [t0, p0] = m[0], dt = (e.timeStamp - t0) / 1000;
    const vel = dt > 0 ? (p - p0) / dt : 0;
    const proyeccion = Math.max(-N, Math.min(N, vel * 0.35)); // a dónde va el gesto, no dónde se soltó
    irA(Math.round(p + proyeccion), vel);
  }
  escenario.addEventListener('pointerup', soltar);
  escenario.addEventListener('pointercancel', soltar);

  // Un toque tras arrastrar no abre el enlace; un toque lejos del centro lo trae primero
  escenario.addEventListener('click', e => {
    if (arrastro) { e.preventDefault(); e.stopPropagation(); arrastro = false; return; }
    const el = e.target.closest('.item');
    if (!el) return;
    const i = items.indexOf(el);
    if (Math.abs(envolver(i - p)) > toqueDirecto) { e.preventDefault(); irA(destinoDe(i), 0); }
  }, true);

  // ---- Mouse encima: se queda quieta para poder leer ----
  escenario.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { encima = true; frenar(); } });
  escenario.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { encima = false; programarReanudar(); } });

  // ---- Rueda del mouse y trackpad (en toda la página, que no tiene scroll propio) ----
  addEventListener('wheel', e => {
    e.preventDefault();
    clearTimeout(reanudar);
    const unidad = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? escenario.clientHeight : 1;
    if (modo !== 'muelle') objetivo = p;
    objetivo += e.deltaY * unidad / paso;
    if (reducir.matches) { p = objetivo; pintar(); }
    else { modo = 'muelle'; arrancar(); }
    clearTimeout(ruedaT);
    ruedaT = setTimeout(() => irA(Math.round(objetivo)), 140);
  }, { passive: false });

  // ---- Teclado ----
  items.forEach((el, i) => {
    el.setAttribute('draggable', 'false');
    el.addEventListener('focus', () => { enfocado = true; if (el.matches(':focus-visible')) irA(destinoDe(i), 0); });
    el.addEventListener('blur', () => { enfocado = false; programarReanudar(); });
  });
  addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const base = modo === 'muelle' ? objetivo : Math.round(p);
    irA(base + (e.key === 'ArrowDown' ? 1 : -1), 0);
  });

  // ---- Entrada: un giro corto que enseña que la rueda se mueve ----
  pintar();
  if (!reducir.matches) setTimeout(() => irA(0, 0), 420);
  else programarReanudar();

  return { irA, destinoDe, get p() { return p; }, get modo() { return modo; } };
}
