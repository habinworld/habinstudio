/* -----------------------------------------------------
   🔐 Ha-Bin Studio (gate.js)
   비밀의 문 (관리자 키) 2026.04.12
----------------------------------------------------- */
function initSecretGate() {
  const toggle = document.getElementById("gate-toggle");
  const input = document.getElementById("gate-input");
  const btn = document.getElementById("gate-btn");
  const msg = document.getElementById("gate-msg");
  const logo = document.getElementById("main-logo");
  const box = document.getElementById("gate-box");
  const adminLink = document.getElementById("admin-mode");
  const cleanLink = document.getElementById("admin-clean");
   
  if (!input || !btn || !msg || !logo) return;
 // 처음 로딩 시 관리자 상태 반영
  if (localStorage.getItem("habin_admin") === "true") {
    if (adminLink) adminLink.style.display = "inline-flex";
    if (cleanLink) cleanLink.style.display = "inline-flex";
  } else {
    if (adminLink) adminLink.style.display = "none";
    if (cleanLink) cleanLink.style.display = "none";
  }
  function checkKey() {
    const key = input.value.trim().toLowerCase();

    if (key === "글진동" || key === "rmfwlsehd") {
      localStorage.setItem("habin_admin", "true");
      if (adminLink) adminLink.style.display = "inline-flex";
      if (cleanLink) cleanLink.style.display = "inline-flex"; 
      hbApplyLogoMode();

      msg.textContent = "관리자 모드 활성화!";
      msg.style.color = "#DAA520";
      msg.style.fontWeight = "700";

      if (box) box.style.display = "none";

      setTimeout(() => (msg.textContent = ""), 2000);
       return;
  }
     // ✅ 관리자 OFF 추가 (여기!)
  if (key === "종료" || key === "exit") {
    localStorage.removeItem("habin_admin");
    if (adminLink) adminLink.style.display = "none";
    if (cleanLink) cleanLink.style.display = "none";   
     hbApplyLogoMode();

    msg.textContent = "관리자 모드 해제";
    msg.style.color = "#999";

    setTimeout(() => (msg.textContent = ""), 2000);
    return;
  }
    // ❌ 실패
      msg.textContent = "잘못된 키입니다.";
      msg.style.color = "#FF5050";
    }
  
  btn.onclick = checkKey;
  input.onkeydown = (e) => {
    if (e.key === "Enter") checkKey();
  };
}
;

