fetch("sidebar.html")
  .then(res => res.text())
  .then(html => {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    container.innerHTML = html;
    hbInitSidebar();
  });

function hbInitSidebar() {

  if (typeof startDateTimeClock === "function") {
    startDateTimeClock();
  }

  if (typeof startWeather === "function") {
    startWeather();
  }

  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("sidebar-menu");

  if (menuToggle && menu) {
    // 🔥 기본 상태 (닫힘)
    menu.style.display = "none";
    menuToggle.onclick = () => {
      menu.style.display =
        menu.style.display === "block" ? "none" : "block";
    };
  }
  // 게이트 호출
  if (typeof initGateToggle === "function") {
    initGateToggle();
  }
  if (typeof initGate === "function") {
    initGate();
  }
}

