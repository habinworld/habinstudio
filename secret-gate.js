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

  function checkKey() {
    const key = input.value.trim().toLowerCase();

    if (key === '글진동' || key === 'rmfwlsehd') {
      
      msg.textContent = '관리자 모드 활성화!';
      msg.style.color = '#DAA520';
      msg.style.fontWeight = '700';

      // 🔥 GOLD 모드 적용
      logo.classList.remove('logo-off', 'logo-moon', 'logo-gold');
      logo.classList.add('logo-gold');

      setTimeout(() => {
        msg.textContent = '';
      }, 3000);

    } else {
      msg.textContent = '잘못된 키입니다.';
      msg.style.color = '#FF5050';
    }
  }

  btn.addEventListener('click', checkKey);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkKey();
  });

});

