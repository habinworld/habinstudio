/* -----------------------------------------------------
   Ha-Bin Studio — secret-toggle.js
   비밀문 열기/닫기 기능 (2025 공식 결계)
----------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById('secret-toggle');  // 문장
  const box = document.getElementById('secret-box');        // 숨김 박스

  if (!toggle || !box) return;

  toggle.addEventListener('click', () => {
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
  });

});

