/* ════════════════════════════════════════
   ✦ Propuesta Mágica — script.js ✦
   ════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   ★ PERSONALIZA AQUÍ TUS FOTOS ★
   Agrega el nombre de cada foto que pusiste en la carpeta /fotos/
   y escribe la leyenda que quieres que aparezca debajo de cada una.
   Ejemplo:  { src: "fotos/foto01.jpg", caption: "Nuestro primer día 💜" }
══════════════════════════════════════════════════════════ */
const PHOTOS = [
  { src: "fotos/foto01.jpg", caption: "Nuestro primer momento juntos 💜" },
  { src: "fotos/foto02.jpg", caption: "Un día para recordar siempre ✨" },
  { src: "fotos/foto03.jpg", caption: "Contigo todo es más bonito 🌟" },
  { src: "fotos/foto04.jpg", caption: "Mi persona favorita en el mundo 👑" },
  { src: "fotos/foto05.jpg", caption: "Escribiendo nuestra historia 💫" },
  { src: "fotos/foto06.jpg", caption: "Cada sonrisa tuya es mi favorita 🌙" },
  { src: "fotos/foto07.jpg", caption: "Un recuerdo que guardo en el corazón 🌸" },
  { src: "fotos/foto08.jpg", caption: "Juntos somos la mejor historia 💎" },
  { src: "fotos/foto09.jpg", caption: "El momento en que supe que eras tú ✦" },
  { src: "fotos/foto10.jpg", caption: "Nuestro final feliz apenas comienza 🏰" },
];
/* ══════════════════════════════════════════════════════════ */

/* ── Estado del carrusel ── */
let current     = 0;
let autoPlay    = null;
let isAnimating = false;
const total     = PHOTOS.length;

/* ── DOM ── */
const trackEl   = document.getElementById('cine-track');
const dotsEl    = document.getElementById('cine-dots');
const counterEl = document.getElementById('cine-counter');

/* ════════════════════════════════════════
   ESTRELLAS Y DESTELLOS
════════════════════════════════════════ */
const canvas = document.getElementById('stars');
const ctx    = canvas.getContext('2d');
let stars    = [];
let sparkles = [];
let animT    = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.007 + 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    const a = 0.25 + 0.55 * Math.sin(t * s.speed + s.phase);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,170,255,${a})`;
    ctx.fill();
  });
  sparkles.forEach(sp => {
    sp.life--; sp.y -= 1.4; sp.x += sp.vx;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(249,196,255,${sp.life / 55})`;
    ctx.fill();
  });
  sparkles = sparkles.filter(s => s.life > 0);
}

function animLoop() {
  animT++;
  drawStars(animT);
  requestAnimationFrame(animLoop);
}

function burst(x, y, count = 16) {
  for (let i = 0; i < count; i++) {
    sparkles.push({
      x, y,
      r:    Math.random() * 2.8 + 0.8,
      vx:   (Math.random() - 0.5) * 3.5,
      life: 55,
    });
  }
}

/* ════════════════════════════════════════
   CARRUSEL CINEMATOGRÁFICO
════════════════════════════════════════ */
function relPos(index) {
  let diff = index - current;
  const half = Math.floor(total / 2);
  if (diff >  half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

function buildCard(index) {
  const card = document.createElement('div');
  card.className        = 'cine-card';
  card.dataset.index    = index;

  const photo = PHOTOS[index];
  card.innerHTML = `
    <img src="${photo.src}" alt="Foto ${index + 1}" draggable="false" />
    <div class="cine-caption">${photo.caption}</div>`;

  card.addEventListener('click', () => {
    const pos = parseInt(card.dataset.pos || '0');
    if (pos !== 0) goTo(index);
  });

  return card;
}

function renderCards() {
  trackEl.innerHTML = '';
  dotsEl.innerHTML  = '';

  PHOTOS.forEach((_, i) => {
    const card = buildCard(i);
    const pos  = relPos(i);
    if (Math.abs(pos) > 3) {
      card.dataset.hidden = 'true';
    } else {
      card.dataset.pos = pos;
    }
    trackEl.appendChild(card);

    const dot = document.createElement('div');
    dot.className = 'cine-dot' + (i === current ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  updateCounter();
}

function updatePositions() {
  trackEl.querySelectorAll('.cine-card').forEach(card => {
    const i   = parseInt(card.dataset.index);
    const pos = relPos(i);
    if (Math.abs(pos) > 3) {
      delete card.dataset.pos;
      card.dataset.hidden = 'true';
    } else {
      delete card.dataset.hidden;
      card.dataset.pos = pos;
    }
  });

  dotsEl.querySelectorAll('.cine-dot').forEach((dot, i) => {
    dot.className = 'cine-dot' + (i === current ? ' active' : '');
  });

  updateCounter();
}

function updateCounter() {
  if (counterEl) counterEl.textContent = `${current + 1} / ${total}`;
}

function goTo(index) {
  if (isAnimating || index === current) return;
  isAnimating = true;
  current = ((index % total) + total) % total;
  updatePositions();
  setTimeout(() => { isAnimating = false; }, 560);
  resetAutoPlay();
}

function prevSlide() { goTo(current - 1); }
function nextSlide() { goTo(current + 1); }

function startAutoPlay() {
  if (total > 1) autoPlay = setInterval(nextSlide, 4000);
}
function resetAutoPlay() {
  clearInterval(autoPlay);
  startAutoPlay();
}

/* ── Swipe táctil ── */
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 45) dx < 0 ? nextSlide() : prevSlide();
});

/* ── Teclado ── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft')  prevSlide();
});

/* ════════════════════════════════════════
   MÚSICA
════════════════════════════════════════ */

/* ── Cambia aquí los nombres de tus archivos MP3 ──
   Ponlos en la misma carpeta que index.html       */
const SONG_MAIN        = 'cancion_principal.mp3';   // suena en la página principal
const SONG_CELEBRATION = 'cancion_si.mp3';          // suena al aceptar

let audioMain = null;
let audioCeleb = null;

function initAudio() {
  /* Solo se crea el audio principal aquí. El de celebración se crea
     de forma perezosa (ver ensureCelebAudio) para no competir por el
     "gesto de usuario" justo en el momento crítico de desbloquear
     el audio principal en móviles Android. */
  audioMain        = new Audio(SONG_MAIN);
  audioMain.loop   = true;
  audioMain.volume = 0.5;
}

function ensureCelebAudio() {
  if (!audioCeleb) {
    audioCeleb        = new Audio(SONG_CELEBRATION);
    audioCeleb.loop   = true;
    audioCeleb.volume = 0.5;
  }
}

let musicStarted = false;

function switchToCelebrationMusic() {
  if (audioMain) {
    audioMain.pause();
    audioMain.currentTime = 0;
  }
  ensureCelebAudio();
  audioCeleb.currentTime = 0;
  audioCeleb.play().catch((err) => console.warn('No se pudo reproducir la música de celebración:', err));
}

/* ════════════════════════════════════════
   BOTONES DE RESPUESTA
════════════════════════════════════════ */
function sayYes() {
  switchToCelebrationMusic();

  for (let i = 0; i < 3; i++) {
    setTimeout(() => burst(
      80 + Math.random() * (window.innerWidth - 160),
      80 + Math.random() * (window.innerHeight * 0.5),
      24
    ), i * 150);
  }
  setTimeout(() => {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('celebration').classList.add('show');
    clearInterval(autoPlay);
    for (let i = 0; i < 10; i++) {
      setTimeout(() => burst(
        80 + Math.random() * (window.innerWidth - 160),
        60 + Math.random() * 220,
        20
      ), i * 200);
    }
  }, 300);
}

/* ── Botón "no sé" ── */
let noClicks = 0;

let escapeLock = false;

function escapeBtn(e) {
  /* Evita que el toque en móvil propague y dispare otro evento */
  if (e) { e.preventDefault(); e.stopPropagation(); }

  /* Evita doble conteo si touchstart y mouseover/click disparan casi juntos */
  if (escapeLock) return;
  escapeLock = true;
  setTimeout(() => { escapeLock = false; }, 300);

  noClicks++;
  const btn = document.getElementById('btn-no');

  /* Margen seguro para que no salga fuera de pantalla */
  const margin = 16;
  const maxX   = window.innerWidth  - btn.offsetWidth  - margin;
  const maxY   = window.innerHeight - btn.offsetHeight - margin;
  const nx     = margin + Math.random() * maxX;
  const ny     = margin + Math.random() * maxY;

  btn.style.position = 'fixed';
  btn.style.left     = nx + 'px';
  btn.style.top      = ny + 'px';
  btn.style.zIndex   = '999';

  if (noClicks >= 4) btn.style.display = 'none';
}

/* ════════════════════════════════════════
   PANTALLA DE INTRO → desbloquea audio
════════════════════════════════════════ */
let introOpened = false;

function openSurprise() {
  /* Guardián: evita que se ejecute dos veces (y se dupliquen los
     objetos Audio) si el navegador dispara más de un evento
     (por ejemplo touchstart + click sintético) por el mismo toque. */
  if (introOpened) return;
  introOpened = true;

  /* Este gesto directo (clic/touch sobre el botón) es suficiente
     para desbloquear audio en iOS Safari, Android Chrome y todos
     los navegadores móviles modernos.                           */
  initAudio();
  const playPromise = audioMain.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch((err) => {
      console.warn('No se pudo reproducir el audio automáticamente:', err);
      showRetryAudioButton();
    });
  }
  musicStarted = true;

  /* Oculta la pantalla de intro con fade */
  const intro = document.getElementById('intro-screen');
  intro.classList.add('hidden');

  /* Destellos de bienvenida */
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => burst(
        80 + Math.random() * (window.innerWidth - 160),
        60 + Math.random() * 200,
        18
      ), i * 120);
    }
  }, 100);
}

/* ── Botón de reintento si el navegador bloqueó el audio ── */
function showRetryAudioButton() {
  if (document.getElementById('retry-audio-btn')) return; /* ya existe */
  const btn = document.createElement('button');
  btn.id = 'retry-audio-btn';
  btn.textContent = '🔊 Toca para activar la música';
  btn.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 0.8rem 1.6rem; border-radius: 50px;
    border: 2px solid #c084fc; background: #1a0f3a; color: #fff;
    font-family: 'Cinzel Decorative', cursive; font-size: 0.85rem;
    cursor: pointer; box-shadow: 0 0 20px #c084fc77;
  `;
  btn.addEventListener('click', () => {
    audioMain.play().then(() => btn.remove()).catch((err) => {
      console.warn('Reintento fallido:', err);
    });
  });
  document.body.appendChild(btn);
}

/* ════════════════════════════════════════
   INICIO
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  initStars();
  animLoop();

  window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

  /* Botón de intro — único punto de entrada para el audio.
     Se usa solo 'click': en navegadores móviles modernos el toque
     genera un evento click de forma fiable y evita que se disparen
     dos veces (touchstart + click) creando audio duplicado. */
  const introBtn = document.getElementById('intro-btn');
  introBtn.addEventListener('click', openSurprise);

  /* Destellos al tocar la escena (sin afectar audio) */
  document.querySelector('.scene').addEventListener('click', e => {
    burst(e.clientX, e.clientY, 10);
  });

  /* Botón "no sé" — separar hover (desktop) de touch (móvil) */
  const btnNo = document.getElementById('btn-no');
  btnNo.addEventListener('touchstart', escapeBtn, { passive: false });
  btnNo.addEventListener('mouseover',  escapeBtn);

  renderCards();
  startAutoPlay();
});