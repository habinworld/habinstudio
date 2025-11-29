/* -----------------------------------------------------
   🍃 Ha-Bin Studio — particles.js
   사계절 입자 효과 (Spring / Summer / Autumn / Winter)
----------------------------------------------------- */

let particles = [];
let ctx, canvasWidth, canvasHeight;

/* -----------------------------------------------------
   📌 캔버스 초기화
----------------------------------------------------- */
function initCanvas() {
  const canvas = document.getElementById("season-canvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
}

/* -----------------------------------------------------
   📌 캔버스 크기 재조정
----------------------------------------------------- */
function resizeCanvas() {
  const canvas = document.getElementById("season-canvas");
  if (!canvas) return;

  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
}

/* -----------------------------------------------------
   📌 파티클 생성 (공용)
----------------------------------------------------- */
function createParticles(count, shape, color, sizeRange, speedRange) {
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * speedRange,
    vy: Math.random() * speedRange + 0.3,
    size: Math.random() * sizeRange + 2,
    shape,
    color
  }));
}

/* -----------------------------------------------------
   📌 벚꽃 입자(봄)
----------------------------------------------------- */
function springParticles() {
  createParticles(
    35,
    'petal',
    'rgba(255,182,193,0.85)',  // 연핑크
    4,
    1.2
  );
}

/* -----------------------------------------------------
   📌 초록잎(여름)
----------------------------------------------------- */
function summerParticles() {
  createParticles(
    30,
    'leaf',
    'rgba(120,200,120,0.85)',  // 초록잎
    5,
    1.4
  );
}

/* -----------------------------------------------------
   📌 낙엽(가을)
----------------------------------------------------- */
function autumnParticles() {
  createParticles(
    30,
    'leaf',
    'rgba(255,165,0,0.85)', // 가을 낙엽 오렌지
    6,
    1.0
  );
}

/* -----------------------------------------------------
   📌 눈(겨울)
----------------------------------------------------- */
function winterParticles() {
  createParticles(
    50,
    'snow',
    'rgba(255,255,255,0.9)', // 순백 눈송이
    3,
    0.8
  );
}

/* -----------------------------------------------------
   📌 파티클 그리기
----------------------------------------------------- */
function drawParticle(p) {
  ctx.beginPath();

  if (p.shape === 'petal') {
    ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
  } else if (p.shape === 'leaf') {
    ctx.ellipse(p.x, p.y, p.size * 0.7, p.size, 0, 0, Math.PI * 2);
  } else {
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  }

  ctx.fillStyle = p.color;
  ctx.fill();
}

/* -----------------------------------------------------
   📌 파티클 업데이트
----------------------------------------------------- */
function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.y > canvasHeight) p.y = -10;
    if (p.x > canvasWidth) p.x = -10;
    if (p.x < -10) p.x = canvasWidth + 10;
  });
}

/* -----------------------------------------------------
   📌 루프
----------------------------------------------------- */
function animateParticles() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach(drawParticle);
  updateParticles();

  requestAnimationFrame(animateParticles);
}

/* -----------------------------------------------------
   📌 외부 호출: 계절에 따라 자동 실행
----------------------------------------------------- */
function startParticles(season) {
  initCanvas();

  if (season === 'spring') springParticles();
  else if (season === 'summer') summerParticles();
  else if (season === 'autumn') autumnParticles();
  else if (season === 'winter') winterParticles();

  animateParticles();
}

