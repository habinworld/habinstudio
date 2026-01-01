/* ==========================================================
   🎨 color-advanced.js — Advanced Color Engine (FINAL)
   ----------------------------------------------------------
   역할:
   ✔ 마름모(벌집) 기반 고급 색상 선택 UI
   ✔ 선택 값 확정 시 rgba 문자열 반환
   ✔ 뒤로 버튼 → MODE_BASIC 복귀 신호
   ❌ 팝업 열기/닫기 ❌ ESC ❌ 실행 ❌ MODE 판단
========================================================== */

window.ColorAdvancedEngine = (function () {

  /* ======================================================
     UI 생성
  ====================================================== */
  function createUI(onSelect, onBack) {

    /* ---------- 상태 ---------- */
    let currentRGBA = "rgba(0,0,0,1)";   // 기준 색
    let previewRGBA = currentRGBA;       // 선택 중 색

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

    /* ==================================================
       상단 바
    ================================================== */
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.alignItems = "center";
    top.style.marginBottom = "8px";

    const title = document.createElement("div");
    title.textContent = "사용자 지정 색";
    title.style.fontWeight = "600";

    const backBtn = document.createElement("button");
    backBtn.className = "hb-btn";
    backBtn.textContent = "뒤로";
    backBtn.onclick = () => onBack && onBack();

    top.appendChild(title);
    top.appendChild(backBtn);

    /* ==================================================
       마름모(벌집) 캔버스
    ================================================== */
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 190;
    canvas.style.display = "block";
    canvas.style.cursor = "pointer";

    const ctx = canvas.getContext("2d");

    /* ---------- 색상 유틸 ---------- */
    function hsvToRgb(h, s, v) {
      const c = v * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = v - c;
      let r = 0, g = 0, b = 0;

      if (h < 60) [r, g, b] = [c, x, 0];
      else if (h < 120) [r, g, b] = [x, c, 0];
      else if (h < 180) [r, g, b] = [0, c, x];
      else if (h < 240) [r, g, b] = [0, x, c];
      else if (h < 300) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    }

    /* ---------- 벌집 좌표 생성 ---------- */
    const cells = [];
    const R = 10;
    const dx = R * 1.75;
    const dy = R * 1.5;
    const rows = [6,7,8,9,10,11,10,9,8,7,6];
    const cx0 = canvas.width / 2;
    let y = 22;

    rows.forEach((count, ri) => {
      let x = cx0 - ((count - 1) * dx) / 2;

      for (let ci = 0; ci < count; ci++) {
        const nx = (ci - (count - 1) / 2) / ((count - 1) / 2 || 1);
        const ny = (ri - (rows.length - 1) / 2) / ((rows.length - 1) / 2);

        const h = (Math.atan2(ny, nx) * 180 / Math.PI + 360) % 360;
        const s = Math.min(1, Math.hypot(nx, ny));
        const v = 1 - Math.max(0, ny) * 0.3;

        const rgb = hsvToRgb(h, s, v);
        const rgba = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;

        cells.push({ x, y, rgba });

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = Math.PI / 3 * i + Math.PI / 6;
          const px = x + R * Math.cos(a);
          const py = y + R * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = rgba;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.stroke();

        x += dx;
      }
      y += dy;
    });

    /* ==================================================
       현재 색 / 새 색 패널
    ================================================== */
    const panel = document.createElement("div");
    panel.style.display = "flex";
    panel.style.justifyContent = "space-between";
    panel.style.marginTop = "10px";

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

      wrap.appendChild(chip);
      wrap.appendChild(text);
      return { wrap, chip };
    }

    const cur = makeChip("현재 색", currentRGBA);
    const next = makeChip("새 색", previewRGBA);

    panel.appendChild(cur.wrap);
    panel.appendChild(next.wrap);

    /* ==================================================
       적용 버튼
    ================================================== */
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

    /* ==================================================
       클릭 처리 (선택만)
    ================================================== */
    canvas.onclick = e => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      for (let i = cells.length - 1; i >= 0; i--) {
        const c = cells[i];
        const dx = px - c.x;
        const dy = py - c.y;
        if (dx*dx + dy*dy <= R*R) {
          previewRGBA = c.rgba;
          next.chip.style.background = previewRGBA;
          return;
        }
      }
    };

    /* ---------- 조립 ---------- */
    box.appendChild(top);
    box.appendChild(canvas);
    box.appendChild(panel);
    box.appendChild(applyBtn);

    return box;
  }

  /* ======================================================
     외부 API (MODE 전환 계약)
  ====================================================== */
  function render(popup, onSelect, onBack) {
    popup.innerHTML = "";
    popup.appendChild(createUI(onSelect, onBack));
  }

  return { render };

})();





