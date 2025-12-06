/* -----------------------------------------------------
   Ha-Bin Studio — secret-toggle.js
   비밀문 열기/닫기 기능 (2025 공식 결계)
----------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  const toggle = document.getElementById('secret-toggle');  // 문장
  const box = document.getElementById('secret-box');        // 숨김 박스

  if (!toggle || !box) return;

  toggle.addEventListener('click', () => {
     /* ⭐ 관리자면 비밀문 절대 안 열림 */
    if (localStorage.getItem("habin_admin") === "true") {
      return;   // ← 클릭 무시 (열리지 않음) 
       }
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
  });

});

