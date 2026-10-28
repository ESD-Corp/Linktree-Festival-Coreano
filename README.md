# Linktree · Festival Coreano RD 2026

En línea: <https://festivalcoreanord.com.do>

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
al tocarlo aparece un aviso de que falta el formulario. Después del 31 de octubre de 2026 el botón de
K-Pop se ve atenuado (convocatoria cerrada); la fecha sale de `cierra` en `enlaces.js`.

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

## Píxel de TikTok

Píxel del Festival Coreano RD (`DBH21A3C77U8I4RJ18D0`). El código base va en el `<head>`, junto al de Google
Analytics y al de Meta, y envía `Pageview` al cargar. En cada toque que abre un botón manda los mismos dos
momentos que Meta, con los nombres del catálogo de TikTok:

| Botón | Evento estándar | Evento propio |
|---|---|---|
| Formularios (Expositores, Voluntarios, K-Pop) | `Lead` | `ClicBoton` con `content_name`, `description` y `red_origen` |
| KFeel en iPhone / KFeel Android | `InitiateCheckout` (ahí se compra la entrada) | `ClicBoton` con `content_name`, `description` y `red_origen` |

Los eventos estándar son los que las campañas de TikTok pueden usar para optimizar: sin ellos, un anuncio
solo sabe optimizar hacia clics. Los nombres terminan siendo los mismos que en Meta, así que el `ClicBoton`
y los dos estándar se pueden cruzar botón por botón entre los tres sistemas.

En la documentación de TikTok el evento de los formularios aparece como `SubmitForm`, pero su SDK lo traduce
a `Lead` antes de enviarlo (así se ve en el Events Manager). Por eso el código manda `Lead` directo.

## Verla en local

```bash
python3 -m http.server 8744
```

Luego abre <http://localhost:8744>. Hace falta un servidor (no funciona abriendo el archivo directo)
porque los scripts son módulos.

## Tres orígenes de tráfico

| Enlace | Origen | En Analytics |
|---|---|---|
| `festivalcoreanord.com.do` | Tráfico directo (y todo lo que no sea Instagram ni TikTok) | `red_origen = directo` |
| `festivalcoreanord.com.do/ig` | Instagram | `utm_source=instagram`, `red_origen = instagram` |
| `festivalcoreanord.com.do/tt` | TikTok | `utm_source=tiktok`, `red_origen = tiktok` |

`/ig` y `/tt` redirigen a la página principal con `utm_source`, `utm_medium` y `utm_campaign=kfestrd2026`.
Si alguien abre la página principal desde el navegador interno de Instagram o TikTok, también se reconoce el origen.
Para distinguir publicaciones, agrega `?v=` con un nombre corto: `/tt?v=reel-audicion` llega como `utm_content=reel-audicion`.

## Eventos por botón

| Evento | Cuándo | Para qué |
|---|---|---|
| `clic_boton` | Cualquier botón (parámetros `boton`, `destino`, `red_origen`) | Informes y exploraciones |
| `kfeel_iphone` / `kfeel_android` | Tiendas de KFeel (parámetro `red_origen`) | Eventos clave |
| `llegada_directo` / `llegada_instagram` / `llegada_tiktok` | Una vez por visita | Tiempo real: de dónde llega la gente |
| `toque_<botón>_<origen>` | Cada botón | Tiempo real: qué botón tocan y desde dónde |

Botones: `expositores`, `voluntarios`, `kpop`, `kfeel_iphone`, `kfeel_android`. Ejemplos: `toque_kpop_tiktok`,
`toque_kfeel_android_instagram`, `toque_voluntarios_directo`.

**Medir en tiempo real:** Analytics → Informes → Tiempo real → tarjeta «Recuento de eventos por nombre del evento».
Los `llegada_…` dicen cuántas visitas llegan de cada origen y los `toque_…` qué botón tocan desde cada origen.
El tiempo real no muestra la fuente de la visita ni los parámetros, por eso el origen va en el nombre del evento.

## Publicar cambios

**El sitio sale de la rama `produccion`, no de `main`.** Subir algo a `main` no publica nada.

Cada push a `produccion` dispara `.github/workflows/deploy-produccion.yml`, que primero abre la página en un
navegador de verdad (Playwright): si hay errores de JavaScript, archivos que faltan o la página no muestra
enlaces, el deploy se detiene ahí y no toca el servidor. Si pasa la prueba, sube los archivos por rsync a
`/var/www/linktree/` en el servidor (nginx) que responde en <https://festivalcoreanord.com.do>, y al final
comprueba que el sitio responda. La subida usa `--delay-updates`, así que si falla a mitad el sitio queda como estaba.
El `README.md`, `.github/` y `.gitignore` no se suben.

Lo de siempre: trabajar en `main` y, cuando está listo, llevarlo a producción.

```bash
git push origin main:produccion
```

El workflow también se puede correr a mano desde la pestaña Actions de GitHub (*Run workflow*).
Para volver atrás, revertir el commit en `produccion` y subirlo.

### Vercel

El proyecto `linktree-festival-coreano` (equipo *esd-corp's projects*) sigue conectado a la rama `main`, pero
**está pausado**: <https://linktree-festival-coreano.vercel.app> devuelve `503 DEPLOYMENT_PAUSED`. Quedó de
cuando el sitio vivía ahí. Si alguna vez hace falta esa URL, hay que despausar el proyecto desde el panel de Vercel.
