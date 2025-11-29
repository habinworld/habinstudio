/* -----------------------------------------------------
   🔐 Ha-Bin Studio — secret-gate.js
   비밀의 문 (관리자 키)
----------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  const input = document.getElementById('secret-input');
  const btn = document.getElementById('secret-btn');
  const msg = document.getElementById('secret-msg');
  const logo = document.getElementById('main-logo');

  if (!input || !btn || !msg || !logo) return;

  /* ---------------------------------------------
     📌 관리자 키 체크 함수
  --------------------------------------------- */
  function checkKey() {
    const key = input.value.trim();
    const lower = key.toLowerCase();   // 대·소문자 무시

    if (lower === '글진동' || lower === 'rmfwlsehd') {
      
      msg.textContent = '관리자 모드 활성화!';
      msg.style.color = '#DAA520';
      msg.style.fontWeight = '700';

      // 🔥 로고 Gold 모드
      logo.classList.remove('logo-off', 'logo-moon');
      logo.classList.add('logo-gold');

      // 메시지 유지 후 흐려짐
      setTimeout(() => {
        msg.textContent = '';
      }, 3000);

    } else {
      msg.textContent = '잘못된 키입니다.';
      msg.style.color = '#d9534f';
    }
  }

  /* ---------------------------------------------
     📌 버튼 클릭
  --------------------------------------------- */
  btn.addEventListener('click', checkKey);

  /* ---------------------------------------------
     📌 엔터키 입력으로도 실행
  --------------------------------------------- */
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkKey();
  });

});

