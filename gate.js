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
 
  const isAdmin = document.body.dataset.isAdmin === "true"; 
    // 관리자 UI 반영
  if (adminLink) adminLink.style.display = isAdmin ? "inline-flex" : "none";
  if (cleanLink) cleanLink.style.display = isAdmin ? "inline-flex" : "none";
   
  // 서버 기준이므로 입력 버튼은 안내만
  gatebtn.onclick = function () {
    if (!isAdmin) {
      gatemsg.textContent = "";
      return;
    }

    gatemsg.textContent = "서버 관리자 연결 상태입니다.";
    gatemsg.style.color = "#DAA520";
    gatemsg.style.fontWeight = "700";

    if (gatebox) gatebox.style.display = "none";

    setTimeout(() => {
      gatemsg.textContent = "";
    }, 1500);
  };

  gateinput.onkeydown = function (e) {
    if (e.key === "Enter") {
      gatebtn.click();
    }
  };

  if (typeof hbApplyLogoMode === "function") {
    hbApplyLogoMode();
  }
}
