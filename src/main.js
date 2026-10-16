// Bintan — motion graphic: sastra & seni
// Canvas layered: sea, hills, mist, particles, parallax title reveal.
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

/* ---- layers ---- */
const layers = {
  sea:      { speed: 0.12, color: getComputedStyle(document.documentElement).getPropertyValue('--sea') },
  farHill:  { speed: 0.30, color: getComputedStyle(document.documentElement).getPropertyValue('--forest') },
  midHill:  { speed: 0.55 },
  closeHill:{ speed: 0.85 },
  mist:     { speed: 0.08, opacity: 0.15 }
};

/* ---- particles (senja motes) ---- */
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.1 + 0.3;
    this.s = Math.random() * 0.5 + 0.2;
  }
  upd() {
    this.y -= this.s * 0.3;
    if (this.y < 0) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245,240,230,0.6)';
    ctx.fill();
  }
}
const particles = Array.from({ length: 180 }, () => new Particle());

/* ---- hills as wave noise ---- */
function drawHill(yBase, amp, freq, speed, t, color) {
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) {
    const y = yBase + Math.sin((x / W) * Math.PI * freq + t * speed * 0.0015) * amp
                  + Math.cos((x / W) * Math.PI * freq * 0.5 + t * speed * 0.001) * (amp * .4);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  if (color) ctx.fillStyle = color;
  ctx.fill();
}

/* ---- title reveal progress ---- */
const titleEl = document.querySelector('.title h1');
let titleRevealed = false;

/* ---- main loop ---- */
let t = 0;
function loop() {
  t += 16; // ~ms

  // clear with sea
  ctx.clearRect(0, 0, W, H);

  // sea base (horizon parallax)
  ctx.fillStyle = layers.sea.color || '#0F3B5F';
  ctx.fillRect(0, H * 0.58, W, H * 0.42);

  // far hill — sea green layer
  drawHill(H * 0.5, 18, 1.6, layers.farHill.speed, t, '#1A532B');

  // mid hill
  drawHill(H * 0.46, 22, 2.1, layers.midHill.speed, t);

  // close hill — foreground
  drawHill(H * 0.44, 34, 2.8, layers.closeHill.speed, t, '#0D2E1F');

  // mist overlay
  ctx.fillStyle = 'rgba(245,240,230,' + layers.mist.opacity + ')';
  drawHill(H * 0.44, 14, 1.2, layers.mist.speed, t);

  // particles
  particles.forEach(p => { p.upd(); p.draw(); });

  // title reveal — scroll trigger or auto after 2.5s
  if (!titleRevealed && t > 2500) {
    titleRevealed = true;
    titleEl.style.opacity = '1';
    titleEl.style.transform = 'translateY(0)';
  }

  requestAnimationFrame(loop);
}

/* init title hidden, then animate in */
titleEl.style.opacity = '0';
titleEl.style.transform = 'translateY(18px)';
titleEl.style.transition = 'opacity 1.2s ease, transform 1.2s ease';

requestAnimationFrame(loop);
