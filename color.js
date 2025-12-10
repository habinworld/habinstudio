/* ---------------------------------------------------
   🎨 color.js v7.0 — Basic Color Picker Engine
   Ha-Bin Studio Editor
---------------------------------------------------- */

const ColorEngine = (() => {

  let popup = null;
  let currentMode = null;  // "text" or "bg"

  // 기본 색상 목록
  const COLORS = [
    "#000000", "#FF0000", "#FFA500", "#FFFF00",
    "#008000", "#00CED1", "#1E90FF", "#0000FF",
    "#800080", "#FF69B4", "#C0C0C0", "#FFFFFF"
  ];

  /* ----------------------------
       팝업 생성
  ----------------------------- */
  function createPopup() {
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "hb-color-popup";
    popup.className = "hb-color-popup";

    COLORS.forEach(color => {
      const btn = document.createElement("button");
      btn.className = "hb-color-item";
      btn.style.background = color;
      btn.dataset.color = color;

      btn.onclick = () => applyColor(color);

      popup.appendChild(btn);
    });

    document.body.appendChild(popup);
    return popup;
  }

  /* ----------------------------
       팝업 열기
  ----------------------------- */
  function openPopup(button, mode) {
    currentMode = mode;
    const p = createPopup();

    // 위치: 버튼 바로 아래
    const rect = button.getBoundingClientRect();
    p.style.display = "grid";
    p.style.left = `${rect.left}px`;
    p.style.top = `${rect.bottom + 8}px`;
  }

  /* ----------------------------
       팝업 닫기
  ----------------------------- */
  function closePopup() {
    if (popup) popup.style.display = "none";
  }

  /* ----------------------------
       색상 적용
  ----------------------------- */
  function applyColor(color) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const cmd = currentMode === "text" ? "foreColor" : "hiliteColor";
    document.execCommand(cmd, false, color);

    closePopup();
  }

  /* ----------------------------
       외부 클릭하면 닫힘
  ----------------------------- */
  document.addEventListener("click", e => {
    if (!popup) return;
    if (!popup.contains(e.target) &&
        !e.target.closest("#hb-color") &&
        !e.target.closest("#hb-bgcolor")) {
      closePopup();
    }
  });

  return {
    openPopup,
    closePopup
  };

})();

