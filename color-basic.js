/* ======================================================
   🎨 color-basic.js — BASIC Color Engine (FINAL)
   ====================================================== */

window.ColorBasicEngine = (function () {

  let view = "square"; // square | honey

  const BASE_TEXT = "#000000";
  const BASE_BG   = "#FFFFFF";

  /* ===============================
     외부 제어
  =============================== */
  function setView(v) {
    view = v;
  }

  /* ===============================
     렌더 진입
  =============================== */
  function render(popup, onSelect, onViewChange) {
    popup.innerHTML = "";
    popup.style.padding = "10px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";

    if (view === "square") {
      renderSquare(popup, onSelect, onViewChange);
    } else {
      renderHoney(popup, onSelect, onViewChange);
    }
  }

  /* ===============================
     VIEW_SQUARE
  =============================== */
  function renderSquare(popup, onSelect, onViewChange) {

    const top = document.createElement("div");
    top.style.display = "grid";
    top.style.gridTemplateColumns = "1fr 1fr";
    top.style.gap = "6px";

    const noneBtn = document.createElement("button");
    noneBtn.className = "hb-btn";
    noneBtn.textContent = "색없슴";
    noneBtn.onclick = () => {
      onSelect(BASE_TEXT); // 글자/배경은 UI 엔진에서 처리
    };

    const honeyBtn = document.createElement("button");
    honeyBtn.className = "hb-btn";
    honeyBtn.textContent = "표준색(256)";
    honeyBtn.onclick = () => onViewChange("honey");

    top.appendChild(noneBtn);
    top.appendChild(honeyBtn);
    popup.appendChild(top);

    popup.appendChild(divider());

    const colors = [
      "#000000","#FFFFFF","#FF0000","#FF9900","#FFFF00",
      "#00CC00","#00FFFF","#0000FF","#9900FF","#FF00FF"
    ];

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(10, 18px)";
    grid.style.gap = "4px";

    colors.forEach(c => {
      const b = box(c);
      b.onclick = () => onSelect(c);
      grid.appendChild(b);
    });

    popup.appendChild(grid);

    popup.appendChild(divider());

    const moreBtn = document.createElement("button");
    moreBtn.className = "hb-btn";
    moreBtn.textContent = "더보기…";
    moreBtn.onclick = () => onSelect("__ADVANCED__");
    popup.appendChild(moreBtn);
  }

  /* ===============================
     VIEW_HONEY (256)
  =============================== */
  function renderHoney(popup, onSelect, onViewChange) {

    const baseColor = BASE_TEXT; // 원점
    let previewColor = baseColor;

    /* 상단 */
    const top = document.createElement("div");
    const back = document.createElement("button");
    back.className = "hb-btn";
    back.textContent = "← 뒤로";
    back.onclick = () => onViewChange("square");
    top.appendChild(back);
    popup.appendChild(top);

    popup.appendChild(divider());

    /* 벌집 */
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(16, 1fr)";
    grid.style.gap = "4px";

    generate256().forEach(color => {
      const c = box(color);
      c.style.borderRadius = "50%";
      c.onclick = () => {
        previewColor = color;
        cur.chip.style.background = color;
      };
      grid.appendChild(c);
    });

    popup.appendChild(grid);
    popup.appendChild(divider());

    /* 하단 (ADVANCED 복사 구조) */
    const panel = document.createElement("div");
    panel.style.display = "flex";
    panel.style.alignItems = "center";
    panel.style.gap = "20px";

    const base = chip("기존색", baseColor);
    const cur  = chip("현재색", previewColor);

    panel.appendChild(base.wrap);
    panel.appendChild(cur.wrap);

    const apply = document.createElement("button");
    apply.className = "hb-btn";
    apply.textContent = "적용";
    apply.onclick = () => onSelect(previewColor);

    popup.appendChild(panel);
    popup.appendChild(apply);
  }

  /* ===============================
     유틸
  =============================== */
  function box(color) {
    const b = document.createElement("button");
    b.style.width = "18px";
    b.style.height = "18px";
    b.style.background = color;
    b.style.border = "1px solid #CCC";
    b.style.padding = "0";
    return b;
  }

  function chip(label, color) {
    const wrap = document.createElement("div");
    wrap.style.textAlign = "center";

    const c = document.createElement("div");
    c.style.width = "50px";
    c.style.height = "20px";
    c.style.border = "1px solid #CCC";
    c.style.background = color;

    const t = document.createElement("div");
    t.textContent = label;
    t.style.fontSize = "12px";

    wrap.appendChild(c);
    wrap.appendChild(t);
    return { wrap, chip: c };
  }

  function divider() {
    const d = document.createElement("div");
    d.style.height = "1px";
    d.style.background = "#DDD";
    d.style.margin = "6px 0";
    return d;
  }

  function generate256() {
    const arr = [];
    for (let r = 0; r < 256; r += 51) {
      for (let g = 0; g < 256; g += 51) {
        for (let b = 0; b < 256; b += 51) {
          arr.push(`rgb(${r},${g},${b})`);
        }
      }
    }
    return arr;
  }

  return { render, setView };

})();






