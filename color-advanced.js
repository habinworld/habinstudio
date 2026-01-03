/* ==========================================================
   🎨 color-advanced.js — Excel-Style Advanced Color Engine (FINAL)
   ----------------------------------------------------------
   역할:
   ✔ Excel 사용자 지정 RGB 방식 UI
   ✔ 색 평면(2D) + 세로 슬라이더(1D) + RGB 숫자 입력
   ✔ 선택 값 확정 시 rgba 문자열 반환
   ✔ 뒤로 버튼 → MODE_BASIC 복귀 신호
   ❌ 팝업 열기/닫기 ❌ ESC ❌ 실행 ❌ MODE 판단
========================================================== */

window.ColorAdvancedEngine = (function () {

  function clamp255(n) {
    n = Number(n);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(255, Math.round(n)));
  }

  function rgbaStr(r, g, b) {
    return `rgba(${r},${g},${b},1)`;
  }

  /* ======================================================
     UI 생성
  ====================================================== */
  function createUI(onSelect, onBack) {

    /* ---------- 상태 (Excel: RGB 정수 = 유일한 진실) ---------- */
    let state = { r: 0, g: 0, b: 0 };

    let currentRGBA = rgbaStr(state.r, state.g, state.b);
    let previewRGBA = currentRGBA;

    /* ---------- 컨테이너 ---------- */
    const box = document.createElement("div");
    box.style.padding = "12px";
    box.style.background = "#FFFFFF";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    box.style.width = "300px";
    box.style.fontFamily = "Noto Sans KR, sans-serif";
    box.style.fontSize = "13px";

    /* ==================================================
       상단 바
    ================================================== */
    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.justifyContent = "space-between";
    top.style.alignItems = "center";
    top.style.marginBottom = "10px";

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
       색 선택 영역 (사각 평면 + 세로 슬라이더)
    ================================================== */
    const pickerRow = document.createElement("div");
    pickerRow.style.display = "flex";
    pickerRow.style.gap = "10px";
    pickerRow.style.alignItems = "flex-start";

    // 평면(2D): X=R, Y=G / 세로 슬라이더: B
    const planeWrap = document.createElement("div");
    planeWrap.style.position = "relative";
    planeWrap.style.width = "200px";
    planeWrap.style.height = "140px";
    planeWrap.style.border = "1px solid #CCC";
    planeWrap.style.borderRadius = "6px";
    planeWrap.style.overflow = "hidden";

    const plane = document.createElement("canvas");
    plane.width = 200;
    plane.height = 140;
    plane.style.display = "block";
    plane.style.cursor = "crosshair";

    // 마커(오버레이)
    const marker = document.createElement("div");
    marker.style.position = "absolute";
    marker.style.width = "10px";
    marker.style.height = "10px";
    marker.style.border = "2px solid #FFFFFF";
    marker.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.6)";
    marker.style.borderRadius = "2px";
    marker.style.pointerEvents = "none";
    marker.style.left = "0px";
    marker.style.top = "0px";

    planeWrap.appendChild(plane);
    planeWrap.appendChild(marker);

    // B 슬라이더 (세로)
    const sliderWrap = document.createElement("div");
    sliderWrap.style.display = "flex";
    sliderWrap.style.flexDirection = "column";
    sliderWrap.style.alignItems = "center";
    sliderWrap.style.gap = "6px";

    const bLabel = document.createElement("div");
    bLabel.textContent = "B";
    bLabel.style.fontWeight = "600";

    const bSlider = document.createElement("input");
    bSlider.type = "range";
    bSlider.min = "0";
    bSlider.max = "255";
    bSlider.value = String(state.b);
    bSlider.style.width = "16px";
    bSlider.style.height = "140px";
    bSlider.style.writingMode = "bt-lr";         // 일부 브라우저
    bSlider.style.webkitAppearance = "slider-vertical"; // 크롬/엣지
    bSlider.style.padding = "0";

    const bValue = document.createElement("div");
    bValue.textContent = String(state.b);
    bValue.style.fontSize = "12px";
    bValue.style.color = "#555";

    sliderWrap.appendChild(bLabel);
    sliderWrap.appendChild(bSlider);
    sliderWrap.appendChild(bValue);

    pickerRow.appendChild(planeWrap);
    pickerRow.appendChild(sliderWrap);

    /* ---------- 평면 그리기 (Excel식: 현재 B 고정, R/G 평면) ---------- */
    const pctx = plane.getContext("2d");

    function drawPlane() {
      const w = plane.width;
      const h = plane.height;
      const img = pctx.createImageData(w, h);
      const data = img.data;

      const B = state.b;
      let i = 0;

      for (let y = 0; y < h; y++) {
        const g = Math.round((y / (h - 1)) * 255);
        for (let x = 0; x < w; x++) {
          const r = Math.round((x / (w - 1)) * 255);
          data[i++] = r;
          data[i++] = g;
          data[i++] = B;
          data[i++] = 255;
        }
      }

      pctx.putImageData(img, 0, 0);
      moveMarkerFromState();
    }

    function moveMarkerFromState() {
      const w = plane.width;
      const h = plane.height;

      const x = Math.round((state.r / 255) * (w - 1));
      const y = Math.round((state.g / 255) * (h - 1));

      marker.style.left = `${x - 5}px`;
      marker.style.top = `${y - 5}px`;
    }

    function setRGFromPointer(ev) {
      const rect = plane.getBoundingClientRect();
      const scaleX = plane.width / rect.width;
      const scaleY = plane.height / rect.height;

      const px = (ev.clientX - rect.left) * scaleX;
      const py = (ev.clientY - rect.top) * scaleY;

      const x = Math.max(0, Math.min(plane.width - 1, px));
      const y = Math.max(0, Math.min(plane.height - 1, py));

      state.r = clamp255((x / (plane.width - 1)) * 255);
      state.g = clamp255((y / (plane.height - 1)) * 255);

      syncInputsFromState();
      previewRGBA = rgbaStr(state.r, state.g, state.b);
      next.chip.style.background = previewRGBA;
      moveMarkerFromState();
    }

    // 클릭/드래그 지원
    let dragging = false;
    plane.addEventListener("mousedown", (e) => {
      dragging = true;
      setRGFromPointer(e);
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      setRGFromPointer(e);
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    /* ==================================================
       색 모델 / RGB 입력 (Excel식)
    ================================================== */
    const form = document.createElement("div");
    form.style.marginTop = "10px";
    form.style.display = "grid";
    form.style.gridTemplateColumns = "80px 1fr";
    form.style.gap = "6px 8px";
    form.style.alignItems = "center";

    function makeLabel(text) {
      const el = document.createElement("div");
      el.textContent = text;
      el.style.color = "#333";
      return el;
    }

    // 색 모델 (고정: RGB)
    const modelLabel = makeLabel("색 모델(D):");
    const modelSelect = document.createElement("select");
    modelSelect.disabled = true;
    modelSelect.style.height = "26px";
    modelSelect.style.border = "1px solid #CCC";
    modelSelect.style.borderRadius = "6px";
    modelSelect.style.padding = "0 6px";
    const opt = document.createElement("option");
    opt.value = "RGB";
    opt.textContent = "RGB";
    modelSelect.appendChild(opt);

    function makeNumRow(name, initial, onChange) {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = "255";
      input.step = "1";
      input.value = String(initial);
      input.style.height = "26px";
      input.style.border = "1px solid #CCC";
      input.style.borderRadius = "6px";
      input.style.padding = "0 8px";
      input.style.width = "100%";

      input.addEventListener("input", () => onChange(input.value));
      input.addEventListener("blur", () => {
        // blur 시 정리
        input.value = String(clamp255(input.value));
      });

      return input;
    }

    const rLabel = makeLabel("빨강(R):");
    const gLabel = makeLabel("녹색(G):");
    const bNumLabel = makeLabel("파랑(B):");

    const rInput = makeNumRow("R", state.r, (v) => {
      state.r = clamp255(v);
      syncInputsFromState();
      previewRGBA = rgbaStr(state.r, state.g, state.b);
      next.chip.style.background = previewRGBA;
      moveMarkerFromState();
    });

    const gInput = makeNumRow("G", state.g, (v) => {
      state.g = clamp255(v);
      syncInputsFromState();
      previewRGBA = rgbaStr(state.r, state.g, state.b);
      next.chip.style.background = previewRGBA;
      moveMarkerFromState();
    });

    const bInput = makeNumRow("B", state.b, (v) => {
      state.b = clamp255(v);
      syncInputsFromState();
      bSlider.value = String(state.b);
      bValue.textContent = String(state.b);
      drawPlane();
      previewRGBA = rgbaStr(state.r, state.g, state.b);
      next.chip.style.background = previewRGBA;
    });

    function syncInputsFromState() {
      // 숫자칸 동기화
      if (document.activeElement !== rInput) rInput.value = String(state.r);
      if (document.activeElement !== gInput) gInput.value = String(state.g);
      if (document.activeElement !== bInput) bInput.value = String(state.b);

      bSlider.value = String(state.b);
      bValue.textContent = String(state.b);
    }

    form.appendChild(modelLabel);
    form.appendChild(modelSelect);

    form.appendChild(rLabel);
    form.appendChild(rInput);

    form.appendChild(gLabel);
    form.appendChild(gInput);

    form.appendChild(bNumLabel);
    form.appendChild(bInput);

    // 슬라이더 변경 → B 변경
    bSlider.addEventListener("input", () => {
      state.b = clamp255(bSlider.value);
      bInput.value = String(state.b);
      bValue.textContent = String(state.b);
      drawPlane();
      previewRGBA = rgbaStr(state.r, state.g, state.b);
      next.chip.style.background = previewRGBA;
    });

    /* ==================================================
       현재 색 / 새 색 패널 (Excel식)
    ================================================== */
    const panel = document.createElement("div");
    panel.style.display = "flex";
    panel.style.justifyContent = "flex-end";
    panel.style.gap = "10px";
    panel.style.marginTop = "10px";

    function makeChip(label, color) {
      const wrap = document.createElement("div");
      wrap.style.textAlign = "center";

      const chip = document.createElement("div");
      chip.style.width = "70px";
      chip.style.height = "42px";
      chip.style.border = "1px solid #CCC";
      chip.style.borderRadius = "6px";
      chip.style.background = color;

      const text = document.createElement("div");
      text.textContent = label;
      text.style.fontSize = "12px";
      text.style.marginTop = "4px";
      text.style.color = "#333";

      wrap.appendChild(chip);
      wrap.appendChild(text);
      return { wrap, chip };
    }

    const next = makeChip("새 색", previewRGBA);
    const cur = makeChip("현재 색", currentRGBA);

    panel.appendChild(next.wrap);
    panel.appendChild(cur.wrap);

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

    /* ---------- 초기 렌더 ---------- */
    drawPlane();
    previewRGBA = rgbaStr(state.r, state.g, state.b);
    next.chip.style.background = previewRGBA;

    /* ---------- 조립 ---------- */
    box.appendChild(top);
    box.appendChild(pickerRow);
    box.appendChild(form);
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
