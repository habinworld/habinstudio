/* ==========================================================
   🎨 color-advanced.js — Advanced Color Engine (Stage 3)
   ----------------------------------------------------------
   역할:
   ✔ 고급 RGBA 색상 선택 UI
   ✔ 값만 반환 (rgba 문자열)
   ❌ 실행 ❌ 판단 ❌ EditorCore 직접 호출
========================================================== */

window.ColorAdvancedEngine = (function () {

  const popup = document.getElementById("hb-popup-color-advanced");
  let isOpen = false;

  /* ======================================================
     UI 생성 (상태는 내부 지역변수로만 유지)
  ====================================================== */
  function createPopup(onSelect) {

    // 지역 상태 (UI용, 외부로 안 나감)
    let R = 0, G = 0, B = 0, A = 1;

    const box = document.createElement("div");
    box.id = "hb-popup-color-advanced";

    box.style.position = "absolute";
    box.style.padding = "14px";
    box.style.background = "#FFFFFF";
    box.style.border = "1px solid #D0D0D0";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    box.style.width = "240px";
    box.style.zIndex = "1000000";
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

    const applyBtn = document.createElement("button");
    applyBtn.className = "hb-btn";
    applyBtn.textContent = "적용";

    applyBtn.onclick = () => {
      onSelect && onSelect(`rgba(${R},${G},${B},${A})`);
      close();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "hb-btn";
    cancelBtn.textContent = "취소";
    cancelBtn.style.marginLeft = "6px";
    cancelBtn.onclick = close;

    btnArea.appendChild(applyBtn);
    btnArea.appendChild(cancelBtn);

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
     열기 / 닫기
  ====================================================== */
  function openAt(x, y, onSelect) {

    popup = createPopup(onSelect);
    document.body.appendChild(popup);

    popup.style.left = x + "px";
    popup.style.top  = y + "px";

    isOpen = true;

    requestAnimationFrame(() => {
    document.addEventListener("mousedown", handleOutside);
  });
}

  function close() {
    if (popup) popup.remove();
    popup = null;
    isOpen = false;
    document.removeEventListener("click", handleOutside);
  }

  function handleOutside(e) {
    if (popup && !popup.contains(e.target)) close();
  }

  /* ======================================================
     외부 API
  ====================================================== */
  return {
    openAt,
    close
  };

})();




