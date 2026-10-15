# Linktree · Festival Coreano RD 2026

Página de enlaces para la bio de Instagram y TikTok del Festival Coreano RD
(sábado 28 de noviembre de 2026, Explanada Fray Antón de Montesinos, Malecón de Santo Domingo).

Los cinco botones giran en un tambor: el que queda en el centro se vuelve una etiqueta roja.
Giran solos, se detienen al tocarlos y se mueven con el dedo, la rueda del mouse o las flechas del teclado.
La estética sigue las piezas de la campaña (marino, nubes crema, trazos rojos, olas sobre blanco).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La página: estilos propios, titular, footer con fecha, lugar y precio. |
| `enlaces.js` | **Los 5 botones** (texto, link e ícono) y el aviso de cierre de la convocatoria de K-Pop. |
| `rueda.js` | El movimiento del tambor: giro automático, arrastre con inercia, rueda del mouse y teclado. |
| `comun.css` | Colores y tipografía del sistema visual. |
| `assets/` | Logo, textura marino y banda de olas. |
| `iconos/` | Íconos del set del festival que usan los botones y las nubes. |

## Cambiar un enlace

Edita `enlaces.js`. Cada botón tiene `titulo`, `detalle`, `url` e `icono`.
Después de editar `enlaces.js` o `rueda.js`, sube el número de versión en las dos líneas `import` de
`index.html` (`?v=1` → `?v=2`) para que los navegadores no usen la copia vieja guardada.

## Pendiente

- Los tres formularios (Expositores, Voluntarios y K-Pop dance crews) todavía no tienen el link del Google Form:
  su `url` empieza por `#formulario-…`. Mientras tanto, al tocarlos aparece un aviso.
- El botón de K-Pop muestra "Cierra en N días" hasta el 20 de octubre de 2026 y después "Convocatoria cerrada".

## Verla en local

```bash
python3 -m http.server 8744
```

Luego abre <http://localhost:8744>. Hace falta un servidor (no funciona abriendo el archivo directo)
porque los scripts son módulos.
