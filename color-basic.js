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
     STANDARD : 256색 (Excel Color Cube)
  ====================================================== */
  function buildColors256() {
  const list = [];
  const steps = [0, 51, 102, 153, 204, 255];

  // 1) 216 color cube
  for (let g of steps)
    for (let r of steps)
      for (let b of steps)
        list.push(`rgb(${r},${g},${b})`);

  // 2) 40 grayscale
  for (let i = 0; i < 40; i++) {
    const v = Math.round((255 * i) / 39);
    list.push(`rgb(${v},${v},${v})`);
  }

  return list; // 정확히 256
}
/* ======================================================
   🔧 정렬 유틸
====================================================== */
 function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}  
   /* =======================
   🔧 GRAY ROWS (상단 2줄)
======================= */
function buildGrayRowBlack() {
  const row = [];
  for (let i = 0; i < 16; i++) {
    const v = Math.round((200 * i) / 15); // 0 → 200
    row.push(`rgb(${v},${v},${v})`);
  }
  return row;
}

function buildGrayRowDark() {
  const row = [];
  for (let i = 0; i < 16; i++) {
    const v = Math.round(60 + ((200 - 60) * i) / 15); // 60 → 200
    row.push(`rgb(${v},${v},${v})`);
  }
  return row;
}

/* =======================
   🔧 COLOR SORT (아래 14줄)
======================= */
function sortColorsForGrid(colors) {
  const buckets = Array.from({ length: 14 }, () => []);

  colors.forEach(c => {
    const [r, g, b] = c.match(/\d+/g).map(Number);
    if (r === g && g === b) return; // 회색 제외

    const { h, l } = rgbToHsl(r, g, b);
    const row = Math.min(13, Math.floor(l * 14));
    buckets[row].push({ c, h });
  });

  return buckets.flatMap(row =>
    row.sort((a, b) => a.h - b.h).map(v => v.c)
  );
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

    const grayRow1 = buildGrayRowBlack();   // 1줄: 검정 → 연회색
    const grayRow2 = buildGrayRowDark();    // 2줄: 진그레이 → 연회색
    
const colors = [
  ...grayRow1,
  ...grayRow2,
  ...colorPart
];
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






