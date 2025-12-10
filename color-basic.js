/* -----------------------------------------------------
   🎨 color-basic.js v8.0 — Basic Color Picker Module
   Ha-Bin Studio Editor
------------------------------------------------------ */

const ColorBasic = (() => {

  let popup = null;
  let mode = null;      // "text" | "bg"
  let openedBy = null;  // 버튼 참조 저장


  /* =====================================================
       1) 기본 색상 목록 (12~18개 확장 가능)
  ===================================================== */
  const COLORS = [
    "#000000", "#FF0000", "#FF7F00", "#FFFF00",
    "#00A000", "#00CED1", "#1E90FF", "#0000FF",
    "#800080", "#FF69B4", "#808080", "#FFFFFF"
  ];


  /* =====================================================
       2) 팝업 DOM 생성
  ===================================================== */
  function createPopup() {
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "hb-color-basic-popup";
    popup.className = "hb-color-basic-popup";

    const grid = document.createElement("div");
    grid.className = "hb-color-basic-grid";

    COLORS.forEach(c => {
      const b = document.createElement("button");
      b.className = "hb-color-basic-item";
      b.style.background = c;
      b.dataset.color = c;

      b.onclick = () => applyColor(c);

      grid.appendChild(b);
    });

    popup.appendChild(grid);
    document.body.appendChild(popup);
    return popup;
  }


  /* =====================================================
       3) 팝업 열기 (버튼 바로 아래 위치)
  ===================================================== */
  function open(button, _mode) {
    mode = _mode;        // text | bg
    openedBy = button;

    const p = createPopup();

    const rect = button.getBoundingClientRect();

    p.style.display = "grid";
    p.style.left = `${rect.left}px`;
    p.style.top = `${rect.bottom + 6}px`;
  }


  /* =====================================================
       4) 팝업 닫기
  ===================================================== */
  function close() {
    if (popup) popup.style.display = "none";
  }


  /* =====================================================
       5) 색상 적용
  ===================================================== */
  function applyColor(color) {
    if (mode === "text") {
      EditorCore.setColor(color);
    } else {
      EditorCore.setBgColor(color);
    }
    close();
  }


  /* =====================================================
       6) 바깥 클릭 시 닫힘
  ===================================================== */
  document.addEventListener("click", e => {
    if (!popup) return;

    // 팝업 내부 클릭은 무시
    if (popup.contains(e.target)) return;

    // 자신을 연 버튼 재클릭도 무시
    if (e.target === openedBy) return;

    close();
  });


  /* =====================================================
       7) 외부 인터페이스
  ===================================================== */
  return {
    open,
    close
  };

})();



