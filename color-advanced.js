/* ==========================================================
   🎨 color-advanced.js — Advanced Color Engine (MODE Version)
   ----------------------------------------------------------
   역할:
   ✔ 고급 RGBA 색상 선택 UI
   ✔ 값만 반환 (rgba 문자열)
   ✔ 뒤로 버튼으로 MODE_BASIC 복귀 신호
   ❌ 팝업 열기/닫기 ❌ 실행 ❌ 판단
========================================================== */

window.ColorAdvancedEngine = (function () {

  /* ======================================================
     UI 생성 (팝업 컨테이너는 외부에서 전달됨)
  ====================================================== */
  function createUI(onSelect, onBack) {

    // 지역 상태 (UI 전용)
    let R = 0, G = 0, B = 0, A = 1;

    const box = document.createElement("div");
    box.style.padding = "14px";
    box.style.background = "#FFFFFF";
    box.style.border = "1px solid #D0D0D0";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    box.style.width = "240px";
    box.style.fontFamily = "Noto Sans KR, sans-serif";
    box.style.fontSize = "14px";

    /* ---------- 미리보기 ---------- */
    const preview = document.createElement("div");
    preview.style.height = "40px";
    preview.style.border = "1px solid #CCC";
    preview.style.borderRadius = "6px";
    preview.style.marginBottom = "12px";

    function updatePreview() {
      preview.style.background = `rgba(${R},${G},${B},${A})`;
    }
    updatePreview();

    /* ---------- 슬라이더 ---------- */
    function makeSlider(label, min, max, step, onChange) {
      const wrap = document.createElement("div");
      wrap.style.marginBottom = "10px";

      const title = document.createElement("div");
      title.style.fontSize = "12px";

      const input = document.createElement("input");
      input.type = "range";
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = min;
      input.style.width = "100%";

      input.addEventListener("input", () => {
        title.textContent = `${label}: ${input.value}`;
        onChange(Number(input.value));
        updatePreview();
      });

      title.textContent = `${label}: ${input.value}`;

      wrap.appendChild(title);
      wrap.appendChild(input);
      return wrap;
    }

    /* ---------- 버튼 ---------- */
    const btnArea = document.createElement("div");
    btnArea.style.textAlign = "right";
    btnArea.style.marginTop = "10px";

    const backBtn = document.createElement("button");
    backBtn.className = "hb-btn";
    backBtn.textContent = "뒤로";

    backBtn.onclick = () => {
      onBack && onBack(); // MODE_BASIC 복귀
    };

    const applyBtn = document.createElement("button");
    applyBtn.className = "hb-btn";
    applyBtn.textContent = "적용";
    applyBtn.style.marginLeft = "6px";

    applyBtn.onclick = () => {
      onSelect && onSelect(`rgba(${R},${G},${B},${A})`);
      // ❌ close 없음
    };

    btnArea.appendChild(backBtn);
    btnArea.appendChild(applyBtn);

    /* ---------- 조립 ---------- */
    box.appendChild(preview);
    box.appendChild(makeSlider("R", 0, 255, 1, v => R = v));
    box.appendChild(makeSlider("G", 0, 255, 1, v => G = v));
    box.appendChild(makeSlider("B", 0, 255, 1, v => B = v));
    box.appendChild(makeSlider("A", 0, 1, 0.01, v => A = v));
    box.appendChild(btnArea);

    return box;
  }

  /* ======================================================
     외부 API (MODE 전환용)
  ====================================================== */
  function render(popup, onSelect, onBack) {
    popup.innerHTML = "";
    popup.appendChild(createUI(onSelect, onBack));
  }

  return {
    render
  };

})();





