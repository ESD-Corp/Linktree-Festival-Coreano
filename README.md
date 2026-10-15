# Linktree · Festival Coreano RD 2026

En línea: <https://linktree-festival-coreano.vercel.app>

Página de enlaces para la bio de Instagram y TikTok del Festival Coreano RD
(sábado 28 de noviembre de 2026, Explanada Fray Antón de Montesinos, Malecón de Santo Domingo).

Los cinco botones van en un tambor: el que queda en el centro se vuelve una etiqueta roja.
El tambor está quieto y se mueve con el dedo, la rueda del mouse o las flechas del teclado.
La estética sigue las piezas de la campaña (marino liso, nube crema, trazos rojos, etiqueta roja tipo sticker).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La página: estilos propios, titular, footer con fecha, lugar y precio. |
| `enlaces.js` | **Los 5 botones** (texto, link e ícono) y el aviso de cierre de la convocatoria de K-Pop. |
| `rueda.js` | El movimiento del tambor: giro automático, arrastre con inercia, rueda del mouse y teclado. |
| `comun.css` | Colores y tipografía del sistema visual. |
| `assets/` | Logo. |
| `iconos/` | Íconos de los botones y la nube (el puesto de expositores sale del ícono oficial de la marca). |

## Cambiar un enlace

Edita `enlaces.js`. Cada botón tiene `titulo`, `detalle`, `url` e `icono`.
Después de editar `enlaces.js` o `rueda.js`, sube el número de versión en las dos líneas `import` de
`index.html` (`?v=1` → `?v=2`) para que los navegadores no usen la copia vieja guardada.

## Pendiente

- Los formularios de Expositores y K-Pop dance crews todavía no tienen el link del Google Form:
  su `url` empieza por `#formulario-…`. Mientras tanto, al tocarlos aparece un aviso.
- Después del 20 de octubre de 2026 el botón de K-Pop se ve atenuado (convocatoria cerrada).

## Verla en local

```bash
python3 -m http.server 8744
```

Luego abre <http://localhost:8744>. Hace falta un servidor (no funciona abriendo el archivo directo)
porque los scripts son módulos.

## Publicar cambios

El sitio está en Vercel (equipo *esd-corp's projects*, proyecto `linktree-festival-coreano`), conectado a este repo:
cada cambio que se sube a la rama `main` se publica solo en <https://linktree-festival-coreano.vercel.app>
en unos segundos. Los cambios en otras ramas generan una vista previa aparte, sin tocar el sitio principal.
