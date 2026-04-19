/* -----------------------------------------------------
    Ha-Bin Studio  (gate-toggle.js)
   게이트 열기 / 닫기 전용
   2026.04.19
----------------------------------------------------- */
function initGateToggle() {
  const gatetoggle = document.getElementById("gate-toggle");
  const gatebox = document.getElementById("gate-box");

  if (!gatetoggle || !gatebox) return;

  const isAdmin = document.body.dataset.isAdmin === "true";

  // 처음엔 닫기
  gatebox.style.display = "none";

  gatetoggle.onclick = function () {
    if (!isAdmin) return;

    const isOpen = gatebox.style.display === "block";
    gatebox.style.display = isOpen ? "none" : "block";
  };
}

