/* -----------------------------------------------------
   🔐 Ha-Bin Studio — secret-gate.js
   비밀의 문 (관리자 키) 2026.04.12
----------------------------------------------------- */
function initSecretGate() {
  const toggle = document.getElementById("secret-toggle");
  const input = document.getElementById("secret-input");
  const btn = document.getElementById("secret-btn");
  const msg = document.getElementById("secret-msg");
  const logo = document.getElementById("main-logo");
  const box = document.getElementById("secret-box");
  const adminLink = document.getElementById("admin-mode");
  const cleanLink = document.getElementById("admin-clean");
   
  if (!input || !btn || !msg || !logo) return;

  function checkKey() {
    const key = input.value.trim().toLowerCase();

    if (key === "글진동" || key === "rmfwlsehd") {
      localStorage.setItem("habin_admin", "true");

      localStorage.setItem("habin_admin", "true");
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

    localStorage.removeItem("habin_admin");
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

