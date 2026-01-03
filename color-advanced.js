/* ==========================================================
   🎨 color-advanced.js — Advanced Color Engine (FINAL)
   ----------------------------------------------------------
   형식:
   ✔ 사각 색 평면 (연속 RGB)
   ✔ 벌집 오버레이 (UI 가이드 전용)
   ✔ 클릭 위치 = 색
   ✔ B 축으로 1024 확장 준비
========================================================== */

window.ColorAdvancedEngine = (function () {

  function createUI(onSelect, onBack) {

    /* ---------- 상태 ---------- */
    let currentRGBA = "rgba(0,0,0,1)";
    let previewRGBA = currentRGBA;

    let bIndex = 8;
    const B_LEVELS = 16;

    /* ---------- 컨테이너 ---------- */
    const box = document.createElement("div");
    box.style.padding = "12px";
    box.style.background = "#FFFFFF";
    box.style.border = "1px solid #D0D0D0";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    box.style.width = "260px";
    box.style.fontFamily = "Noto Sans KR, sans-serif";
    box.style.fontSize = "13px";

    /* ---------- 상단 ---------- */
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.marginBottom = "8px";

    const title = document.createElement("div");
    title.textContent = "사용자 지정 색";
    title.style.fontWeight = "600";

    const backBtn = document.createElement("button");
    backBtn.className = "hb-btn";
    backBtn.textContent = "뒤로";
    backBtn.onclick = () => onBack && onBack();

    top.append(title, backBtn);

    /* ==================================================
       색 평면 + 벌집 오버레이
    ================================================== */
    const wrap = document.createElement("div");
    wrap.style.position = "relative";
    wrap.style.width = "240px";
    wrap.style.height = "190px";

    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 240;
    colorCanvas.height = 190;
    colorCanvas.style.position = "absolute";
    colorCanvas.style.left = "0";
    colorCanvas.style.top = "0";
    colorCanvas.style.cursor = "crosshair";

    const gridCanvas = document.createElement("canvas");
    gridCanvas.width = 240;
    gridCanvas.height = 190;
    gridCanvas.style.position = "absolute";
    gridCanvas.style.left = "0";
    gridCanvas.style.top = "0";
    gridCanvas.style.pointerEvents = "none";

    wrap.append(colorCanvas, gridCanvas);

    const colorCtx = colorCanvas.getContext("2d");
    const gridCtx = gridCanvas.getContext("2d");

    /* ---------- 색 평면 ---------- */
    function drawColorPlane() {
      const img = colorCtx.createImageData(240, 190);
      const data = img.data;
      const b = Math.round(bIndex * 255 / (B_LEVELS - 1));

      let i = 0;
      for (let y = 0; y < 190; y++) {
        for (let x = 0; x < 240; x++) {
          data[i++] = Math.round(x / 239 * 255);
          data[i++] = Math.round(y / 189 * 255);
          data[i++] = b;
          data[i++] = 255;
        }
      }
      colorCtx.putImageData(img, 0, 0);
    }

    /* ---------- 벌집 오버레이 ---------- */
    function drawHoneycomb() {
      gridCtx.clearRect(0, 0, 240, 190);

      const R = 10;
      const dx = R * 1.75;
      const dy = R * 1.5;
      const rows = [6,7,8,9,10,11,10,9,8,7,6];
      const cx0 = 240 / 2;
      let y = 22;

      gridCtx.strokeStyle = "rgba(0,0,0,0.15)";
      gridCtx.lineWidth = 1;

      rows.forEach(count => {
        let x = cx0 - ((count - 1) * dx) / 2;
        for (let i = 0; i < count; i++) {
          gridCtx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = Math.PI / 3 * k + Math.PI / 6;
            const px = x + R * Math.cos(a);
            const py = y + R * Math.sin(a);
            k === 0 ? gridCtx.moveTo(px, py) : gridCtx.lineTo(px, py);
          }
          gridCtx.closePath();
          gridCtx.stroke();
          x += dx;
        }
        y += dy;
      });
    }

    function redrawAll() {
      drawColorPlane();
      drawHoneycomb();
    }

    redrawAll();

    /* ---------- 클릭 = 색 ---------- */
    colorCanvas.onclick = e => {
      const rect = colorCanvas.getBoundingClientRect();
      const scaleX = colorCanvas.width / rect.width;
      const scaleY = colorCanvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const r = Math.round(x / 239 * 255);
      const g = Math.round(y / 189 * 255);
      const b = Math.round(bIndex * 255 / (B_LEVELS - 1));

      previewRGBA = `rgba(${r},${g},${b},1)`;
      next.chip.style.background = previewRGBA;
    };

    /* ---------- B 축 ---------- */
    const bBar = document.createElement("div");
    bBar.style.display = "flex";
    bBar.style.gap = "6px";
    bBar.style.marginTop = "6px";

    const down = document.createElement("button");
    down.className = "hb-btn";
    down.textContent = "B-";
    down.onclick = () => {
      bIndex = Math.max(0, bIndex - 1);
      redrawAll();
    };

    const up = document.createElement("button");
    up.className = "hb-btn";
    up.textContent = "B+";
    up.onclick = () => {
      bIndex = Math.min(B_LEVELS - 1, bIndex + 1);
      redrawAll();
    };

    bBar.append(down, up);

    /* ---------- 현재 / 새 색 ---------- */
    function makeChip(label, color) {
      const wrap = document.createElement("div");
      wrap.style.textAlign = "center";

      const chip = document.createElement("div");
      chip.style.width = "48px";
      chip.style.height = "28px";
      chip.style.border = "1px solid #CCC";
      chip.style.borderRadius = "6px";
      chip.style.background = color;

      const text = document.createElement("div");
      text.textContent = label;
      text.style.fontSize = "11px";
      text.style.marginTop = "2px";

      wrap.append(chip, text);
      return { wrap, chip };
    }

    const panel = document.createElement("div");
    panel.style.display = "flex";
    panel.style.justifyContent = "space-between";
    panel.style.marginTop = "10px";

    const cur = makeChip("현재 색", currentRGBA);
    const next = makeChip("새 색", previewRGBA);

    panel.append(cur.wrap, next.wrap);

    /* ---------- 적용 ---------- */
    const applyBtn = document.createElement("button");
    applyBtn.className = "hb-btn";
    applyBtn.textContent = "적용";
    applyBtn.style.width = "100%";
    applyBtn.style.marginTop = "10px";

    applyBtn.onclick = () => {
      currentRGBA = previewRGBA;
      cur.chip.style.background = currentRGBA;
      onSelect && onSelect(currentRGBA);
    };

    /* ---------- 조립 ---------- */
    box.append(top, wrap, bBar, panel, applyBtn);
    return box;
  }

  function render(popup, onSelect, onBack) {
    popup.innerHTML = "";
    popup.appendChild(createUI(onSelect, onBack));
  }

  return { render };

})();
