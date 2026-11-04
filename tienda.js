// Enlaces de pauta a las tiendas de KFeel: /android, /iphone y /app.
// Meta no acepta un anuncio de Tráfico que apunte directo a Google Play o a App Store (lo pasa a modo app y pide
// el ID de la app), así que los anuncios apuntan aquí, a nuestro dominio, y esta página manda a la tienda.
// Antes de saltar cargan Analytics y los píxeles de Meta y TikTok: el PageView del píxel es la «vista de la página
// de destino» con la que Meta optimiza, y Analytics guarda la visita con las etiquetas utm del anuncio (no se
// reescriben: así la pauta no se mezcla con /ig y /tt en el río del tablero).
// Cada página dice su tienda en data-tienda: «android», «iphone» o «auto» (/app, según el teléfono; una computadora
// va a la página principal). Google Play recibe además las etiquetas del anuncio en «referrer», para sus informes.
import { TIENDAS } from './enlaces.js?v=14';

const ESPERA = 300, TOPE = 1500; // ms después de cargar los píxeles, y como máximo desde que abre la página

const q = new URLSearchParams(location.search);
const ua = navigator.userAgent;
const telefono = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iphone'
  : /Android/.test(ua) ? 'android' : '';
const pedida = document.querySelector('script[data-tienda]').dataset.tienda;
const tienda = pedida === 'auto' ? telefono : pedida;
const t = TIENDAS.find(x => x.evento === 'kfeel_' + tienda);

let destino = '/' + location.search;
if (t) {
  const u = new URL(t.url);
  if (u.hostname === 'play.google.com') {
    const r = new URLSearchParams();
    for (const c of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) if (q.get(c)) r.set(c, q.get(c));
    if ([...r].length) u.searchParams.set('referrer', r.toString());
  }
  destino = u.toString();
}
document.querySelector('a').href = destino;

// Google Analytics
window.dataLayer = window.dataLayer || [];
window.gtag = function () { dataLayer.push(arguments); };
gtag('js', new Date());
gtag('config', 'G-Q073ND6GGD');
if (t) gtag('event', 'salto_tienda', { tienda, transport_type: 'beacon' });
cargar('https://www.googletagmanager.com/gtag/js?id=G-Q073ND6GGD');

// Píxel de Meta
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1114796387611197');
fbq('track', 'PageView');
if (t) fbq('trackCustom', 'SaltoTienda', { tienda });

// Píxel de TikTok
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('DBH21A3C77U8I4RJ18D0');
  ttq.page();
}(window, document, 'ttq');

function cargar(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

// El salto: cuando ya cargaron los scripts de Analytics y de los píxeles (evento load) más una pausa corta para que
// alcancen a mandar, y nunca después de TOPE aunque algún script no cargue.
let saltado = false;
function saltar() {
  if (saltado) return;
  saltado = true;
  location.replace(destino);
}
setTimeout(saltar, TOPE);
if (document.readyState === 'complete') setTimeout(saltar, ESPERA);
else addEventListener('load', () => setTimeout(saltar, ESPERA));
