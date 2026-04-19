/* -----------------------------------------------------
    Ha-Bin Studio  (gate-toggle.js)
   게이트 열기 / 닫기 전용
   2026.04.19
----------------------------------------------------- */
function initGateToggle() {
  const gateToggle = document.getElementById("gate-toggle");
  const gateBox = document.getElementById("gate-box");

  if (!gateToggle || !gateBox) return;

  const isAdmin = document.body.dataset.isAdmin === "true";

  // 처음엔 닫기
  gateBox.style.display = "none";

  gateToggle.onclick = function () {
    if (!isAdmin) return;

    const isOpen = gateBox.style.display === "block";
    gateBox.style.display = isOpen ? "none" : "block";
  };
}

