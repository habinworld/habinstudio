/* -----------------------------------------------------
   🌙✨ Ha-Bin Studio — main.js (전면개편판)
----------------------------------------------------- */

/* --------------------------------------------
  📌 2) 접이식 메뉴 (사이드바 메뉴)
--------------------------------------------- */
const menuToggle = document.getElementById('menu-toggle');
const sidebarMenu = document.getElementById('sidebar-menu');

if (menuToggle && sidebarMenu) {
  menuToggle.addEventListener('click', () => {
    if (sidebarMenu.style.display === 'none' || sidebarMenu.style.display === '') {
      sidebarMenu.style.display = 'block';
      menuToggle.textContent = '접이식 메뉴 ▲';
    } else {
      sidebarMenu.style.display = 'none';
      menuToggle.textContent = '접이식 메뉴 ▼';
    }
  });
}

/* --------------------------------------------
  📌 3) 날짜·시간 자동 업데이트
--------------------------------------------- */
function updateDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();

  let hour = now.getHours();
  let minute = now.getMinutes().toString().padStart(2, '0');

  const ampm = hour < 12 ? '오전' : '오후';
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  const dateStr = `${year}년 ${month}월 ${date}일`;
  const timeStr = `${ampm} ${hour}시 ${minute}분`;

  const box = document.getElementById('datetime');
  if (box) box.innerHTML = `${dateStr} · ${timeStr}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();


/* --------------------------------------------
  📌 5) 낮/밤 자동 테마 + 로고 3단 모드
--------------------------------------------- */
function applyThemeByTime() {
  const hour = new Date().getHours();
  const body = document.body;
  const logo = document.getElementById('main-logo');

  if (hour >= 20 || hour < 6) {
    // 🌙 night-mode
    body.classList.add('night');

    if (logo) {
      logo.classList.remove('logo-off', 'logo-gold');
      logo.classList.add('logo-moon'); // moonlight glow
    }

  } else {
    // ☀ daytime
    body.classList.remove('night');

    if (logo) {
      logo.classList.remove('logo-gold', 'logo-moon');
      logo.classList.add('logo-off'); // orange OFF mode
    }
  }
}

applyThemeByTime();
setInterval(applyThemeByTime, 60000);

/* --------------------------------------------
  📌 6) 계절 자동 감지 후 particles.js 실행
--------------------------------------------- */
function getSeason(m) {
  if (m >= 3 && m <= 5) return 'spring';   // 벚꽃
  if (m >= 6 && m <= 8) return 'summer';   // 초록잎
  if (m >= 9 && m <= 11) return 'autumn';  // 낙엽
  return 'winter';                         // 눈
}

const season = getSeason(new Date().getMonth() + 1);

// 🔥 여기에 붙인다!
if (season === 'winter') {
  document.body.classList.add('winter-day');
} else {
  document.body.classList.add(season);
}

if (typeof startParticles === 'function') {
  startParticles(season);
}

/* --------------------------------------------
  📌 7) weather.js (햇살결계)
--------------------------------------------- */
if (typeof startWeather === 'function') {
  startWeather();
}

