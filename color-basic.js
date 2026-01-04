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
           STANDARD 256 팔레트(고정 HEX · 수동 관리)
  ====================================================== */
const COLORS_256 = [
  /* ===== 1줄 : BLACK / GRAY ===== */
  "#000000","#080808","#101010","#181818","#202020","#282828","#303030","#383838",
  "#404040","#484848","#505050","#666666","#808080","#9A9A9A","#C0C0C0","#FFFFFF",

  /* =====  2줄 : RED GRAY ===== */
   "#120D0D","#1A1414","#221B1B","#2A2222","#322929","#3A3030","#423737","#4A3E3E",
   "#524545","#5A4C4C","#6A5A5A","#7A6868","#9A8282", "#B39C9C","#D0BABA","#F2EAEA",
 
 /* =====  3줄 : RED   ===== */
  "#2A0000","#4A0000","#630000","#7A0000","#960000","#B00000","#C80000","#E00000",
  "#F00000","#FF1A1A","#FF3333","#FF4D4D","#FF6666","#FF8080","#FF9999","#FFB3B3",
   
  /* ===== 4줄 : BROWN ===== */
   "#42302A","#4A3630","#523C36","#5A423C","#624A43","#6A524A","#726058","#7A6258",
   "#8A7268","#9A7F74","#A58C82","#B39A8E","#C2AA9F","#D0B8AA","#E3B896","#F2E6DC",

  /* ===== 5줄 : ORANGE ===== */
   "#2A1800","#4A2A00","#633700","#7A4200","#965200","#B06000","#C87000","#E08000",
   "#F09000","#FFA500","#FFAF1A","#FFB733","#FFC14D","#FFCC66","#FFD580","#FFE0A3",

  /* ===== 6줄 : YELLOW ===== */
   "#2A2A00","#4A4A00","#636300","#7A7A00","#969600","#B0B000","#C8C800","#E0E000",
   "#F0F000","#FFFF1A","#FFFF33","#FFFF4D","#FFFF66","#FFFF80","#FFFF99","#FFFFB3",
   
  /* ===== 7줄 : YELLOW-GREEN ===== */
   "#2A4A00","#4A7A00","#6BA000","#8FC000","#A8D800","#BEE800","#D4F000","#E8F800",
   "#F0FF1A","#E6FF33","#CCFF33","#B3FF4D","#99FF66","#80FF80","#66FF99","#66FFAA",

  /* ===== 8줄 : GREEN ===== */
   "#002A10","#004A1A","#006323","#007A2A","#009634","#00B040","#00C84C","#00E060",
   "#00F070","#1AFF80","#33FF88","#4DFF99","#66FFAA","#80FFBB","#99FFCC","#B3FFDD",
   
  /* ===== 9줄 : Teal / Cyan-Green ===== */
   "#003333","#005555","#007777","#009999","#00AAAA","#00BBBB","#00CCCC","#00DDDD",
   "#00EEEE","#1AFFFF","#33FFFF","#4DFFFF","#66FFFF","#80FFFF","#99FFFF","#B3FFFF",
   
  /* ===== 10줄 : SKY BLUE ===== */
   "#001E2A","#00384A","#004F63","#005E7A","#007094","#0086B0","#009ED0","#00B0F0",
   "#00C0FF","#1AC8FF","#33C8FF","#4DD2FF","#66DAFF","#80E3FF","#99ECFF","#B3F4FF",
   
  /* ===== 11줄 : BLUE ===== */
   "#00224A","#003366","#004080","#004C99","#0059B3","#0066CC","#0073E6","#0080FF",
   "#1A8CFF","#3399FF","#4DA6FF","#66B2FF","#80BFFF","#99CCFF","#B3D9FF","#CCE6FF",
      
  /* ===== 12줄 : INDIGO ===== */
   "#000F2A","#001A4A","#00245E","#002A7A","#003494","#0040B0","#004FD0","#0060E0",
   "#0F70FF","#1F7FFF","#3388FF","#4D99FF","#66AAFF","#80BBFF","#99CCFF","#B3DDFF",
   
  /* ===== 13줄 : PURPLE ===== */
    "#1A001F","#2B0033","#3A004A","#4A0066","#5A0080","#6A0099","#7A1AB3","#8A33CC",
    "#9A4DDB","#AA66EE","#B57AF2","#C08EF6","#CC99FF","#D6ADFF","#E0C2FF","#EAD7FF",
   
  /* ===== 14줄 : ROSE BROWN ===== */
   "#2A1E26","#3A2A33","#4A3640","#5A424D","#6A4E5A","#7A5A67","#8A6674","#9A7281",
   "#AA7E8E","#BA8A9B","#CA96A8","#D6A3B4","#E1B0C0","#EBC0CF","#F3D2DE","#FAE6EF",
   
  /* ===== 15줄 : PINK / MAGENTA ===== */
   "#4A0026","#7A003C","#920046","#A8004F","#BE0058","#D40063","#E81A6F","#FF2E7E",
   "#FF4D91","#FF6FA6","#FF86B3","#FF9FC5","#FFB3D1","#FFC7DD","#FFDCE9","#FFF0F5", 
 
  /* ===== 16줄 : IVORY ===== */
   "#2A2620","#3A352D","#4A443A","#5A5448","#6A6356","#7A7264","#8A8273","#9A9182",
   "#AAA293","#BBAF9F","#CBBEAC","#DACDBA","#E8DDC9","#F2E9D9","#FAF3E6","#FFFFFF",
];
 
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

    const colors = COLORS_256;
     
    colors.forEach((c) => {
  const cell = document.createElement("div");
  cell.style.width = "16px";
  cell.style.height = "13px";
  cell.style.background = c;
  cell.style.border = "1px solid #D0D0D0";
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






