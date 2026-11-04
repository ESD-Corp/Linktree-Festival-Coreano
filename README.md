# Linktree · Festival Coreano RD 2026

En línea: <https://festivalcoreanord.com.do>

Página de enlaces para la bio de Instagram y TikTok del Festival Coreano RD
(sábado 28 de noviembre de 2026, Explanada Fray Antonio de Montesinos, Malecón de Santo Domingo).

Arriba, el contador de días junto al logo, el titular y la fecha. Debajo, tres tarjetas grandes con foto
del festival 2025: el formulario de Expositores, KFeel en iPhone (App Store) y KFeel en Android (Google Play).
Al final, el lugar y el precio de la entrada. Las tarjetas se reparten el alto de la pantalla, así que todo cabe sin hacer scroll.
La estética sigue las piezas de la campaña (marino liso, logo con contorno blanco, trazos rojos, etiqueta roja tipo sticker).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La página: contador, titular, fecha, tarjetas con foto, lugar y precio de la entrada. |
| `enlaces.js` | **El formulario** de Expositores y **las 2 tiendas** de KFeel (texto, link, ícono y foto de cada tarjeta). |
| `fotos/` | Las fotos de las tarjetas (webp de 1200 px, del fotógrafo del festival 2025). |
| `comun.css` | Colores y tipografía del sistema visual. |
| `assets/` | Logo y la textura de papel arrugado del fondo (`papel.webp`, se multiplica sobre el marino). |
| `iconos/` | Íconos de los botones, de las tiendas y el logo de KFeel. El puesto de expositores sale del ícono oficial de la marca; los logos de Apple y Android, de Simple Icons. |

## Cambiar un enlace

Edita `enlaces.js`. Cada tarjeta tiene `titulo` (el nombre que llega a los píxeles), `arriba` y `nombre`
(lo que se lee en la tarjeta; las tiendas llevan además `rotulo`, el texto tal cual se ve, «KFEEL en iPhone»), `url`, `icono`, `foto` (archivo en `fotos/`, sin extensión) y `encuadre`
(qué parte de la foto se ve, como `object-position`).
Después de editar `enlaces.js`, sube el número de versión en la línea `import` de
`index.html` (`?v=14` → `?v=15`) para que los navegadores no usen la copia vieja guardada.

## Formularios

Desde el 2 de noviembre de 2026 solo queda el de Expositores; los de Voluntarios y Audición grupos K-Pop se quitaron.
Si una tarjeta se deja sin link (con una `url` que empiece por `#formulario-…`), al tocarla aparece un aviso de que
falta el formulario. Si un formulario lleva `cierra: 'AAAA-MM-DD'` en `enlaces.js`, su tarjeta se ve atenuada después de esa fecha.

## Google Analytics

La página usa la propiedad `G-Q073ND6GGD` y solo manda cuatro cosas (desde el 29 oct; ver «Eventos»):
visitas, llegadas por `/ig` y por `/tt`, y toques en las tiendas de KFeel. Los toques en los formularios
se miden solo en los píxeles de Meta y TikTok.

## Píxel de Meta

Píxel «Pixel Festival Coreano» (`1114796387611197`, portafolio ESD Corp). Envía `PageView` al cargar,
`Permanencia1s` (evento propio, solo en las visitas que llegaron por `/ig`) una vez por carga de página cuando la página ya terminó de cargar (evento `load`)
y lleva 1 s a la vista (el reloj se pausa si la persona cambia de app o de pestaña; reemplazó el 4 nov a
`Permanencia2s`, que pedía 2 s desde antes de terminar de cargar) y, en cada toque que abre un botón:

| Botón | Evento estándar | Evento propio |
|---|---|---|
| Formulario Expositores | `Lead` | `ClicBoton` con `boton` y `destino` |
| KFeel en iPhone / KFeel Android | `InitiateCheckout` (ahí se compra la entrada) | `ClicBoton` con `boton` y `destino` |

## Píxel de TikTok

Píxel del Festival Coreano RD (`DBH21A3C77U8I4RJ18D0`). El código base va en el `<head>`, junto al de Google
Analytics y al de Meta, y envía `Pageview` al cargar. En cada toque que abre un botón manda los mismos dos
momentos que Meta, con los nombres del catálogo de TikTok:

| Botón | Evento estándar | Evento propio |
|---|---|---|
| Formulario Expositores | `Lead` | `ClicBoton` con `content_name`, `description` y `red_origen` |
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

## Enlaces y eventos

| Enlace | Origen | Evento en Analytics |
|---|---|---|
| `festivalcoreanord.com.do` | Todas las visitas | `page_view` (automático): el total de visitas |
| `festivalcoreanord.com.do/ig` | Instagram | `llegada_instagram`, una vez por visita |
| `festivalcoreanord.com.do/tt` | TikTok | `llegada_tiktok`, una vez por visita |

`/ig` y `/tt` redirigen a la página principal con `utm_source`, `utm_medium` y `utm_campaign=kfestrd2026`; el
evento solo sale cuando la dirección trae esa campaña. Quien entra por la página principal (aunque venga de la
bio de Instagram sin `/ig`) no manda evento de origen: cuenta solo como `page_view`.
Para distinguir publicaciones, agrega `?v=` con un nombre corto: `/tt?v=reel-audicion` llega como `utm_content=reel-audicion`.
Los anuncios también van al enlace corto (TikTok Ads → `/tt` con los parámetros sugeridos por TikTok): si traen
`utm_medium=paid` llegan con medio `paid` y el nombre de la campaña en `utm_content`, y la llegada sale igual.
`utm_id`, `ttclid`, `fbclid` y cualquier otro parámetro pasan tal cual. Las etiquetas que Instagram agrega a la bio
(`ig` / `social` / `link_in_bio`) no cambian nada.

| Evento | Cuándo |
|---|---|
| `kfeel_android` | Cada toque en la insignia de Google Play (sin parámetros) |
| `kfeel_iphone` | Cada toque en la insignia de App Store (sin parámetros) |

Los dos son eventos clave en Analytics. Hasta el 28 oct también existían `clic_boton`, `toque_<botón>_<origen>`,
`llegada_directo` y el parámetro `red_origen`; se quitaron para simplificar.

**Medir en tiempo real:** Analytics → Informes → Tiempo real → tarjeta «Recuento de eventos por nombre del evento».

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
