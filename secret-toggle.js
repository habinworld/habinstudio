/* -----------------------------------------------------
   Ha-Bin Studio — secret-toggle.js
   비밀문 열기/닫기 기능 (2026.01.09)
----------------------------------------------------- */
function initSecretToggle() {
  const toggle = document.getElementById("secret-toggle");
  const box = document.getElementById("secret-box");

  if (!toggle || !box) return;

  toggle.onclick = () => {
    if (localStorage.getItem("habin_admin") === "true") return;

    box.style.display =
      box.style.display === "block" ? "none" : "block";
  };
}


