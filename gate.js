/* -----------------------------------------------------
    Ha-Bin Studio (gate.js)
   게이트 (관리자 키) 2026.04.19
----------------------------------------------------- */
function initGate() {
  const gatetoggle = document.getElementById("gate-toggle");
  const gateinput = document.getElementById("gate-input");
  const gatebtn = document.getElementById("gate-btn");
  const gatemsg = document.getElementById("gate-msg");
  const logo = document.getElementById("main-logo");
  const gatebox = document.getElementById("gate-box");
  const adminLink = document.getElementById("admin-mode");
  const cleanLink = document.getElementById("admin-clean");
   
  if (!gateinput || !gatebtn || !gatemsg || !logo) return;
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

      gatemsg.textContent = "관리자 모드 활성화!";
      gatemsg.style.color = "#DAA520";
      gatemsg.style.fontWeight = "700";

      if (gatebox) gatebox.style.display = "none";

      setTimeout(() => (msg.textContent = ""), 2000);
       return;
  }
     // ✅ 관리자 OFF 추가 (여기!)
  if (key === "종료" || key === "exit") {
    localStorage.removeItem("habin_admin");
    if (adminLink) adminLink.style.display = "none";
    if (cleanLink) cleanLink.style.display = "none";   
     hbApplyLogoMode();

    gatemsg.textContent = "관리자 모드 해제";
    gatemsg.style.color = "#999";

    setTimeout(() => (msg.textContent = ""), 2000);
    return;
  }
    // ❌ 실패
      gatemsg.textContent = "잘못된 키입니다.";
      gatemsg.style.color = "#FF5050";
    }
  
  gatebtn.onclick = checkKey;
  gateinput.onkeydown = (e) => {
    if (e.key === "Enter") checkKey();
  };
}
;

