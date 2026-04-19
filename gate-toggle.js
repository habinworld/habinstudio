/* -----------------------------------------------------
    Ha-Bin Studio  (gate-toggle.js)
   게이트 열기 / 닫기 전용
   2026.04.19
----------------------------------------------------- */
function initGateToggle() {
  const gatetoggle = document.getElementById("gate-toggle");
  const gatebox = document.getElementById("gate-box");

  if (!gatetoggle || !gatebox) return;

  const isAdmin = localStorage.getItem("habin_admin") === "true";

  // 처음 로딩 시 기본 상태 정리
  gatebox.style.display = "none";

  // 관리자 상태면 비밀문은 열리지 않게 유지
  if (isAdmin) return;

    gatetoggle.onclick = function () {
    const isOpen = gatebox.style.display === "block";
    gatebox.style.display = isOpen ? "none" : "block";
  };
}

