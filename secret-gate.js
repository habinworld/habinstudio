/* -----------------------------------------------------
   🔐 Ha-Bin Studio — secret-gate.js
   비밀의 문 (관리자 키) 2026.01.09
----------------------------------------------------- */
function initSecretGate() {
  const input = document.getElementById("secret-input");
  const btn = document.getElementById("secret-btn");
  const msg = document.getElementById("secret-msg");
  const logo = document.getElementById("main-logo");
  const box = document.getElementById("secret-box");

  if (!input || !btn || !msg || !logo) return;

  function checkKey() {
    const key = input.value.trim().toLowerCase();

    if (key === "글진동" || key === "rmfwlsehd") {
      localStorage.setItem("habin_admin", "true");

      logo.classList.remove("logo-off", "logo-moon", "logo-gold");
      logo.classList.add("logo-gold");

      msg.textContent = "관리자 모드 활성화!";
      msg.style.color = "#DAA520";
      msg.style.fontWeight = "700";

      if (box) box.style.display = "none";

      setTimeout(() => (msg.textContent = ""), 2000);
    } else {
      msg.textContent = "잘못된 키입니다.";
      msg.style.color = "#FF5050";
    }
  }

  btn.onclick = checkKey;
  input.onkeydown = (e) => {
    if (e.key === "Enter") checkKey();
  };
}
;

