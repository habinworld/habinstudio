/* -----------------------------------------------------
   🔐 Ha-Bin Studio — etc-toggle.js
   비밀문 열기 / 닫기 전용
   2026.04.14
----------------------------------------------------- */
function initSecretToggle() {
  const toggle = document.getElementById("etc-toggle");
  const box = document.getElementById("etc-box");

  if (!toggle || !box) return;

  const isAdmin = localStorage.getItem("habin_admin") === "true";

  // 처음 로딩 시 기본 상태 정리
  box.style.display = "none";

  // 관리자 상태면 비밀문은 열리지 않게 유지
  if (isAdmin) return;

  toggle.onclick = function () {
    const isOpen = box.style.display === "block";
    box.style.display = isOpen ? "none" : "block";
  };
}

