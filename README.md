# Linktree · Festival Coreano RD 2026

En línea: <https://linktree-festival-coreano.vercel.app>

Página de enlaces para la bio de Instagram y TikTok del Festival Coreano RD
(sábado 28 de noviembre de 2026, Explanada Fray Antonio de Montesinos, Malecón de Santo Domingo).

Arriba, el contador de días junto al logo, el titular y la fecha con el lugar. Los tres formularios van en un tambor:
el que queda en el centro se vuelve una etiqueta roja. Abajo, el precio de la entrada y las insignias de KFeel (App Store y Google Play).
El tambor está quieto y se mueve con el dedo, la rueda del mouse o las flechas del teclado.
La estética sigue las piezas de la campaña (marino liso, logo con contorno blanco, trazos rojos, etiqueta roja tipo sticker).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La página: contador, titular, fecha y lugar, tambor, entrada e insignias de KFeel. |
| `enlaces.js` | **Los 3 formularios** del tambor y **las 2 tiendas** de KFeel (texto, link e ícono), y el cierre de la audición de K-Pop. |
| `rueda.js` | El movimiento del tambor: giro automático, arrastre con inercia, rueda del mouse y teclado. |
| `comun.css` | Colores y tipografía del sistema visual. |
| `assets/` | Logo. |
| `iconos/` | Íconos de los botones, de las tiendas y el logo de KFeel. El puesto de expositores sale del ícono oficial de la marca; los logos de Apple y Android, de Simple Icons. |

## Cambiar un enlace

Edita `enlaces.js`. Cada botón tiene `titulo`, `detalle`, `url` e `icono`.
Después de editar `enlaces.js` o `rueda.js`, sube el número de versión en las dos líneas `import` de
`index.html` (`?v=1` → `?v=2`) para que los navegadores no usen la copia vieja guardada.

## Formularios

Los cinco botones tienen su link. Si alguno se deja sin link (con una `url` que empiece por `#formulario-…`),
al tocarlo aparece un aviso de que falta el formulario. Después del 20 de octubre de 2026 el botón de
K-Pop se ve atenuado (convocatoria cerrada).

## Google Analytics

La página usa la propiedad `G-Q073ND6GGD`. Cada vez que un toque abre un botón se envía el evento
`clic_boton` con los parámetros `boton` (el texto del botón) y `destino` (el link). Arrastrar la rueda no
cuenta. Para verlo por botón en los informes, registra en Analytics una dimensión personalizada de ámbito
Evento con el parámetro `boton`.

## Píxel de Meta

Píxel «Pixel Festival Coreano» (`1114796387611197`, portafolio ESD Corp). Envía `PageView` al cargar y, en
cada toque que abre un botón:

| Botón | Evento estándar | Evento propio |
|---|---|---|
| Formularios (Expositores, Voluntarios, K-Pop) | `Lead` | `ClicBoton` con `boton` y `destino` |
| KFeel en iPhone / KFeel Android | `InitiateCheckout` (ahí se compra la entrada) | `ClicBoton` con `boton` y `destino` |

## Verla en local

```bash
python3 -m http.server 8744
```

Luego abre <http://localhost:8744>. Hace falta un servidor (no funciona abriendo el archivo directo)
porque los scripts son módulos.

## Enlaces cortos por lugar

Cada lugar donde se publica el sitio tiene su enlace. Redirige a la página principal con la fuente y el medio
marcados (`utm_source`, `utm_medium`, `utm_campaign=kfestrd2026`), así Analytics sabe de dónde vino la visita
aunque la app no lo diga (TikTok nunca lo dice).

| Enlace | Para | Fuente / medio |
|---|---|---|
| `festivalcoreanord.com.do/ig` | Bio de Instagram | instagram / bio |
| `/ig-historias` | Historias de Instagram | instagram / historias |
| `/ig-ads` | Anuncios en Instagram | instagram / ads |
| `/tt` | TikTok: mensajes, videos, comentarios y bio | tiktok / social |
| `/tt-ads` | Anuncios en TikTok | tiktok / ads |
| `/fb` | Facebook | facebook / social |
| `/wa` | WhatsApp | whatsapp / mensaje |
| `/qr` | Códigos QR en piezas impresas | qr / impreso |

Para distinguir publicaciones, agrega `?v=` con un nombre corto: `/tt?v=reel-audicion` llega como `utm_content=reel-audicion`.
Para un lugar nuevo, copia una carpeta y cambia `data-fuente`, `data-medio` y la dirección del `meta refresh`.

El sitio manda además `red_origen` en todos sus eventos de Analytics, con la red detectada (de la etiqueta, del navegador
de la app o de la página de origen). Las tiendas mandan `kfeel_iphone` y `kfeel_android`.
Al llegar, cada visita manda una vez `llegada_<red>` (`llegada_tiktok`, `llegada_instagram`…): sirve para ver en el tiempo real
de Analytics, al instante, de dónde vino alguien, porque ahí no aparece la fuente de la visita.

## Publicar cambios

El sitio está en Vercel (equipo *esd-corp's projects*, proyecto `linktree-festival-coreano`), conectado a este repo:
cada cambio que se sube a la rama `main` se publica solo en <https://linktree-festival-coreano.vercel.app>
en unos segundos. Los cambios en otras ramas generan una vista previa aparte, sin tocar el sitio principal.
