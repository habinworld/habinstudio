/* ==========================================================
   🎨 color-basic.js — BASIC Color Palette Engine (FINAL)
   ----------------------------------------------------------
   역할 (헌법 고정):
   ✔ BASIC 색상 선택 UI 렌더링
   ✔ 상단 버튼 3개 (색없슴 / 표준색 / 더보기…)
   ✔ 기본 10색 + 60색 사각 팔레트
   ✔ 값만 반환 (color | null | "__STANDARD__" | "__ADVANCED__")
   ❌ 팝업 열기/닫기 ❌ 상태 저장 ❌ 실행 ❌ 판단
========================================================== */

window.ColorBasicEngine = (function () {

  /* ======================================================
     기본 10색 (상단 1줄)
  ====================================================== */
  const STANDARD_COLORS = [
    "#000000", // 검정
    "#FFFFFF", // 흰색
    "#FF0000", // 빨강
    "#FF9900", // 주황
    "#FFFF00", // 노랑
    "#00CC00", // 초록
    "#00FFFF", // 하늘
    "#0000FF", // 파랑
    "#9900FF", // 보라
    "#FF00FF"  // 자홍
  ];

  /* ======================================================
     BASIC 60색 팔레트 (사각)
  ====================================================== */
  const COLORS = [
    "#000000","#111111","#222222","#333333","#444444","#555555",
    "#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB",

    "#4A0000","#7A0000","#B00000","#E00000","#FF3333","#FF6666",
    "#4A2A00","#7A4200","#B06000","#E08000","#FFA500","#FFB733",
    "#4A4A00","#7A7A00","#B0B000","#E0E000","#FFFF33","#FFFF66",

    "#004A1A","#007A2A","#00B040","#00E060","#33FF88","#66FFAA",
    "#001A4A","#002A7A","#0040B0","#0060E0","#3388FF","#66AAFF",

    "#2B0033","#4A0066","#6A0099","#8A33CC","#AA66EE","#CC99FF",
    "#7A003C","#A8004F","#D40063","#FF2E7E","#FF6FA6","#FF9FC5"
  ];

  /* ======================================================
     BASIC UI 렌더링
  ====================================================== */
  function render(popup, onSelect) {
    popup.innerHTML = "";

    /* ---------- 팝업 기본 스타일 ---------- */
    popup.style.padding = "10px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    popup.style.pointerEvents = "auto";

    /* ==================================================
       A) 상단 버튼 3개
    ================================================== */
    const topBar = document.createElement("div");
    topBar.style.display = "grid";
    topBar.style.gridTemplateColumns = "1fr 1fr 1fr";
    topBar.style.gap = "6px";

    const noneBtn = makeBtn("색없슴", () => onSelect(null));
    const standardBtn = makeBtn("표준색", () => onSelect("__STANDARD__"));
    const moreBtn = makeBtn("더보기…", () => onSelect("__ADVANCED__"));

    topBar.appendChild(noneBtn);
    topBar.appendChild(standardBtn);
    topBar.appendChild(moreBtn);

    popup.appendChild(topBar);
    popup.appendChild(makeDivider());

    /* ==================================================
       B) 기본 10색 (상단 1줄)
    ================================================== */
    const standardGrid = document.createElement("div");
    standardGrid.style.display = "grid";
    standardGrid.style.gridTemplateColumns = "repeat(10, 18px)";
    standardGrid.style.gap = "4px";

    STANDARD_COLORS.forEach(color => {
      const box = createColorBox(color, true);
      box.onclick = () => onSelect(color);
      standardGrid.appendChild(box);
    });

    popup.appendChild(standardGrid);
    popup.appendChild(makeDivider());

    /* ==================================================
       C) BASIC 60색 사각 팔레트
    ================================================== */
    const paletteGrid = document.createElement("div");
    paletteGrid.style.display = "grid";
    paletteGrid.style.gridTemplateRows = "repeat(6, 18px)";
    paletteGrid.style.gridAutoFlow = "column";
    paletteGrid.style.gridAutoColumns = "18px";
    paletteGrid.style.gap = "4px";

    COLORS.forEach(color => {
      const box = createColorBox(color, false);
      box.onclick = () => onSelect(color);
      paletteGrid.appendChild(box);
    });

    popup.appendChild(paletteGrid);
  }

  /* ======================================================
     공통 UI 파트
  ====================================================== */
  function makeBtn(text, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hb-btn";
    btn.textContent = text;
    btn.style.padding = "2px 6px";
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };
    return btn;
  }

  function createColorBox(color, isStandard) {
    const box = document.createElement("button");
    box.type = "button";
    box.style.width = "18px";
    box.style.height = "18px";
    box.style.background = color;
    box.style.border = isStandard ? "1px solid #000" : "1px solid #CCC";
    box.style.borderRadius = "3px";
    box.style.padding = "0";
    box.style.cursor = "pointer";
    return box;
  }

  function makeDivider() {
    const d = document.createElement("div");
    d.style.height = "1px";
    d.style.background = "#DDD";
    d.style.margin = "6px 0";
    return d;
  }

  /* ======================================================
     외부 API
  ====================================================== */
  return { render };

})();






