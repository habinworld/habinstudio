/* ==========================================================
   🎨 color-basic.js — Basic Color Palette Engine (FINAL)
   ----------------------------------------------------------
   역할 (헌법 고정):
   ✔ BASIC 색상 선택 UI 렌더링만 담당
   ✔ 값(color | null | "__ADVANCED__")만 반환
   ❌ 팝업 열기/닫기 ❌ 상태 저장 ❌ 판단 ❌ 실행
========================================================== */

window.ColorBasicEngine = (function () {

  /* ======================================================
     1) 표준 원색 10 (즉시 선택용)
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
     2) 질서 있는 60색 팔레트 (기준표)
  ====================================================== */
  const COLORS = [
    // BLACK (6)
     "#000000","#111111","#222222","#333333","#444444","#555555",
    // GRAY (6)
     "#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB",
    // RED (6)
    "#4A0000","#7A0000","#B00000","#E00000","#FF3333","#FF6666",
   // ORANGE (6)
    "#4A2A00","#7A4200","#B06000","#E08000","#FFA500","#FFB733",
    // YELLOW (6)
    "#4A4A00","#7A7A00","#B0B000","#E0E000","#FFFF33","#FFFF66",
    // GREEN (6)
    "#004A1A","#007A2A","#00B040","#00E060","#33FF88","#66FFAA",
    // BLUE (6)
    "#001A4A","#002A7A","#0040B0","#0060E0","#3388FF","#66AAFF", 
    // NAVY (6)
     "#0A1A2F","#102A44","#1A3A5F","#2A4F7A","#4A6FA5","#6F8FC4",
     // PURPLE (6)
    "#2B0033","#4A0066","#6A0099","#8A33CC","#AA66EE","#CC99FF",
     // DEEP PINK (6)
     "#7A003C","#A8004F","#D40063","#FF2E7E","#FF6FA6","#FF9FC5",
     
  ];

  /* ======================================================
     3) BASIC UI 렌더링
     - popup: 이미 열린 팝업 컨테이너
     - onSelect(value): color | null | "__ADVANCED__"
  ====================================================== */
  function render(popup, onSelect) {
    popup.innerHTML = "";

       /* ---------- 팝업 기본 스타일 (컨테이너 전용) ---------- */
   popup.style.padding = "10px";
   popup.style.background = "#FFFFFF";
   popup.style.border = "1px solid #D0D0D0";
   popup.style.borderRadius = "8px";
   popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
   popup.style.display = "block";        // ❗ grid 사용 금지
   popup.style.pointerEvents = "auto";
   /* ---------- 색상 팔레트 전용 Grid ---------- */
const paletteGrid = document.createElement("div");
paletteGrid.style.display = "grid";
paletteGrid.style.gridTemplateRows = "repeat(6, 18px)"; // 세로 6개
paletteGrid.style.gridAutoFlow = "column";              // 세로 우선
paletteGrid.style.gridAutoColumns = "18px";
paletteGrid.style.gap = "4px";
paletteGrid.style.marginTop = "8px";

popup.appendChild(paletteGrid);
     
     
    /* ==================================================
       A) 상단 명령 버튼
       [ 색없슴 ] [ 더보기… ]
    ================================================== */
    const topBar = document.createElement("div");
    topBar.style.gridColumn = "span 10";
    topBar.style.display = "grid";
    topBar.style.gridTemplateColumns = "1fr 1fr";
    topBar.style.gap = "6px";

    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.className = "hb-btn";
    noneBtn.textContent = "색없슴";
    noneBtn.onclick = () => {
      onSelect && onSelect(null);
    };

    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "hb-btn";
    moreBtn.textContent = "더보기…";
    moreBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect && onSelect("__ADVANCED__");
    };

    topBar.appendChild(noneBtn);
    topBar.appendChild(moreBtn);
    popup.appendChild(topBar);

    /* ---------- 구분선 ---------- */
    popup.appendChild(makeDivider());

    /* ==================================================
       B) 표준 원색 10
    ================================================== */
    STANDARD_COLORS.forEach(color => {
      const box = createColorBox(color, true);
      box.onclick = () => {
        onSelect && onSelect(color);
      };
      popup.appendChild(box);
    });

    /* ---------- 구분선 ---------- */
    popup.appendChild(makeDivider());

    /* ==================================================
   C) 질서 있는 60색 팔레트 (세로 6단 기준 렌더)
================================================== */
const ROWS = 10; // 명도 단계
const COLS = 6;  // 색상 계열 수

for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const index = col * ROWS + row;
    const color = COLORS[index];
    if (!color) continue;

    const box = createColorBox(color, false);
    box.onclick = () => {
      onSelect && onSelect(color);
    };
    popup.appendChild(box);
  }
}
}
  /* ======================================================
     공통: 색상 셀 생성
  ====================================================== */
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

  /* ======================================================
     공통: 구분선
  ====================================================== */
  function makeDivider() {
    const d = document.createElement("div");
    d.style.gridColumn = "span 10";
    d.style.height = "1px";
    d.style.background = "#DDD";
    d.style.margin = "6px 0";
    return d;
  }

  /* ======================================================
     외부 공개 API
  ====================================================== */
  return {
    render
  };

})();





