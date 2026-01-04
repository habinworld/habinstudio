/* ==========================================================
   🎨 color-basic.js — BASIC + STANDARD(256) Color Engine
   ----------------------------------------------------------
   ✔ 단일 파일
   ✔ View 전환 방식 (엑셀식)
   ✔ BASIC : 10색 + 60색
   ✔ STANDARD : 256 
   ✔ ADVANCED 연결용 신호만 반환
========================================================== */

window.ColorBasicEngine = (function () {

  /* ======================================================
     상태 (단 하나)
  ====================================================== */
  let view = "BASIC"; // "BASIC" | "STANDARD_256"
  let baseColor = "#000000";

  /* ======================================================
     BASIC : 기본 10색
  ====================================================== */
  const STANDARD_COLORS = [
    "#000000","#FFFFFF","#FF0000","#FF9900","#FFFF00",
    "#00CC00","#00FFFF","#0000FF","#9900FF","#FF00FF"
  ];

  /* ======================================================
     BASIC : 60색 사각 팔레트
  ====================================================== */
  const COLORS_60 = [
    "#000000","#111111","#222222","#333333","#444444","#555555",
    "#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB",
    "#4A0000","#7A0000","#B00000","#E00000","#FF3333","#FF6666",
    "#4A2A00","#7A4200","#B06000","#E08000","#FFA500","#FFB733",
    "#4A4A00","#7A7A00","#B0B000","#E0E000","#FFFF33","#FFFF66",
    "#004A1A","#007A2A","#00B040","#00E060","#33FF88","#66FFAA",
    "#00384A","#005E7A","#0086B0","#00B0F0","#33C8FF","#66DAFF",
    "#001A4A","#002A7A","#0040B0","#0060E0","#3388FF","#66AAFF",
    "#2B0033","#4A0066","#6A0099","#8A33CC","#AA66EE","#CC99FF",
    "#7A003C","#A8004F","#D40063","#FF2E7E","#FF6FA6","#FF9FC5"
  ];

  /* ======================================================  
           STANDARD 256 팔레트
  ====================================================== */
function buildStandard256() {
  const colors = [];
  const v = i => Math.round((255 * i) / 15); // 0~255

  /* ===== 상단 2줄 : 무채 ===== */

  // 1줄: 검정 → 회색 → 흰색
  for (let i = 0; i < 16; i++) {
    const g = v(i);
    colors.push(`rgb(${g},${g},${g})`);
  }

  // 2줄: 진회색 → 연회색
  for (let i = 0; i < 16; i++) {
    const g = Math.round(40 + (200 * i) / 15);
    colors.push(`rgb(${g},${g},${g})`);
  }

  /* ===== 아래 14줄 : 유채 ===== */

  // 3줄: 빨강
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,${v(i)},${v(i)})`);

  // 4줄: 주황
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,${v(i)},0)`);

  // 5줄: 노랑
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,255,${v(i)})`);

  // 6줄: 연두
  for (let i = 0; i < 16; i++) colors.push(`rgb(${v(i)},255,0)`);

  // 7줄: 초록
  for (let i = 0; i < 16; i++) colors.push(`rgb(${v(i)},255,${v(i)})`);

  // 8줄: 청록
  for (let i = 0; i < 16; i++) colors.push(`rgb(0,255,${v(i)})`);

  // 9줄: 하늘
  for (let i = 0; i < 16; i++) colors.push(`rgb(0,${v(i)},255)`);

  // 10줄: 파랑
  for (let i = 0; i < 16; i++) colors.push(`rgb(${v(i)},${v(i)},255)`);

  // 11줄: 남색
  for (let i = 0; i < 16; i++) colors.push(`rgb(0,${v(i)},180)`);

  // 12줄: 보라
  for (let i = 0; i < 16; i++) colors.push(`rgb(180,${v(i)},255)`);

  // 13줄: 자주
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,0,${v(i)})`);

  // 14줄: 핑크
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,${v(i)},180)`);

  // 15줄: 살구
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,${v(i)},120)`);

  // 16줄: 아이보리
  for (let i = 0; i < 16; i++) colors.push(`rgb(255,255,${v(i)})`);

  return colors; // 정확히 256개
}

 
  /* ======================================================
     외부 진입점
  ====================================================== */
  function render(popup, onSelect) {
    popup.innerHTML = "";
    if (view === "BASIC") {
      renderBasicView(popup, onSelect);
      return;
    }
    if (view === "STANDARD_256") {
      renderStandard256View(popup, onSelect);
      return;
    }
  }

  function setView(v) {
    view = v;
  }

  /* ======================================================
     BASIC VIEW
  ====================================================== */
  function renderBasicView(popup, onSelect) {

    baseStyle(popup);

    /* ---------- 상단 버튼 ---------- */
    const top = gridBar(3);
    top.appendChild(makeBtn("색없슴", () => onSelect(null)));
    top.appendChild(makeBtn("표준색", () => {
      view = "STANDARD_256";
      render(popup, onSelect);
    }));
    top.appendChild(makeBtn("더보기…", () => onSelect("__ADVANCED__")));

    popup.appendChild(top);
    popup.appendChild(divider());

    /* ---------- 기본 10색 ---------- */
    const row10 = gridRow(10);
    STANDARD_COLORS.forEach(c => {
      row10.appendChild(colorBox(c, true, () => onSelect(c)));
    });
    popup.appendChild(row10);
    popup.appendChild(divider());

    /* ---------- 60색 사각 ---------- */
    const grid60 = document.createElement("div");
    grid60.style.display = "grid";
    grid60.style.gridTemplateRows = "repeat(6, 18px)";
    grid60.style.gridAutoFlow = "column";
    grid60.style.gridAutoColumns = "18px";
    grid60.style.gap = "4px";

    COLORS_60.forEach(c => {
      grid60.appendChild(colorBox(c, false, () => onSelect(c)));
    });

    popup.appendChild(grid60);
  }

  /* ======================================================
     STANDARD 256 VIEW 
     ====================================================== */
  function renderStandard256View(popup, onSelect) {
    baseStyle(popup);
   
    /* ---------- 상단 ---------- */
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.marginBottom = "8px";

    const title = document.createElement("div");
    title.textContent = "표준색";
    title.style.fontWeight = "600";

    const backBtn = makeBtn("뒤로", () => {
      view = "BASIC";
      render(popup, onSelect);
    });

    top.appendChild(title);
    top.appendChild(backBtn);
    popup.appendChild(top);

    /* ---------- 사각형 ---------- */
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(16, 13px)";
    grid.style.columnGap = "1px"; // 가로만
    grid.style.rowGap = "0px";    // 세로는 제거
    grid.style.justifyContent = "center";

    const colors = buildStandard256();
     
    colors.forEach((c) => {
  const cell = document.createElement("div");
  cell.style.width = "16px";
  cell.style.height = "13px";
  cell.style.background = c;
  cell.style.border = "1px solid #E0E0E0";
  cell.style.cursor = "pointer";

  cell.onclick = () => {
  previewRGBA = c;
  cur.chip.style.background = previewRGBA;
};

  grid.appendChild(cell);
});

    popup.appendChild(grid);

   /* ==================================================
   하단: 기준색 / 현재색 / 적용  (Advanced 완전 복사)
================================================== */
const panel = document.createElement("div");
panel.style.display = "flex";
panel.style.alignItems = "center";
panel.style.gap = "20px";

function makeChip(label, color) {
  const wrap = document.createElement("div");
  wrap.style.textAlign = "center";

  const chip = document.createElement("div");
  chip.style.width = "60px";
  chip.style.height = "25px";
  chip.style.border = "1px solid #CCC";
  chip.style.borderRadius = "6px";
  chip.style.background = color;

  const text = document.createElement("div");
  text.textContent = label;
  text.style.fontSize = "15px";
  text.style.fontWeight = "600";
  text.style.marginTop = "4px";
  text.style.color = (label === "현재색") ? "#00CC00" : "#333";

  wrap.appendChild(chip);
  wrap.appendChild(text);
  return { wrap, chip };
}

/* Advanced와 동일한 의미 */
let currentRGBA = baseColor;   // 기준색 (열릴 때)
let previewRGBA = baseColor;   // 현재색 (선택 중)

const base = makeChip("기준색", currentRGBA);
const cur  = makeChip("현재색", previewRGBA);

panel.appendChild(base.wrap);
panel.appendChild(cur.wrap);

const footer = document.createElement("div");
footer.style.display = "flex";
footer.style.alignItems = "center";
footer.style.justifyContent = "space-between";
footer.style.marginTop = "12px";

const applyBtn = document.createElement("button");
applyBtn.className = "hb-btn";
applyBtn.textContent = "적용";
applyBtn.style.color = "#FF0000";

applyBtn.onclick = () => {
  onSelect && onSelect(previewRGBA);
};

footer.appendChild(panel);
footer.appendChild(applyBtn);
popup.appendChild(footer);
}
  /* ======================================================
     공통 UI
  ====================================================== */
  function baseStyle(popup) {
    popup.style.padding = "10px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  }

  function makeBtn(text, fn) {
    const b = document.createElement("button");
    b.className = "hb-btn";
    b.textContent = text;
    b.onclick = fn;
    return b;
  }

  function colorBox(color, strong, fn) {
    const b = document.createElement("button");
    b.style.width = "18px";
    b.style.height = "18px";
    b.style.background = color;
    b.style.border = strong ? "1px solid #000" : "1px solid #CCC";
    b.style.borderRadius = "3px";
    b.onclick = fn;
    return b;
  }

  function gridBar(n) {
    const d = document.createElement("div");
    d.style.display = "grid";
    d.style.gridTemplateColumns = `repeat(${n},1fr)`;
    d.style.gap = "6px";
    return d;
  }

  function gridRow(n) {
    const d = document.createElement("div");
    d.style.display = "grid";
    d.style.gridTemplateColumns = `repeat(${n},18px)`;
    d.style.gap = "4px";
    return d;
  }

  function divider() {
    const d = document.createElement("div");
    d.style.height = "1px";
    d.style.background = "#DDD";
    d.style.margin = "6px 0";
    return d;
  }

  function chip(label, color) {
    const w = document.createElement("div");
    w.style.textAlign = "center";
    const b = document.createElement("div");
    b.style.width = "48px";
    b.style.height = "22px";
    b.style.border = "1px solid #CCC";
    b.style.borderRadius = "6px";
    b.style.background = color;
    const t = document.createElement("div");
    t.textContent = label;
    t.style.fontSize = "12px";
    w.appendChild(b);
    w.appendChild(t);
    return w;
  }

  /* ======================================================
     공개 API
  ====================================================== */
  return {
    render,
    setView
  };

})();






