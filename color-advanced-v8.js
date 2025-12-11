/* -----------------------------------------------------
   🌈 color-advanced.js v8.0 — Pro Color Engine
   Ha-Bin Studio (Modular Architecture)
------------------------------------------------------ */

const ColorAdvanced = (() => {

  let popup = null;
  let mode = null;    // "text" | "bg"
  let opener = null;  // 팝업을 연 버튼 저장


  /* =====================================================
       1) popup DOM 생성
  ===================================================== */
  function createPopup() {
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "hb-advanced-popup";
    popup.className = "hb-advanced-popup";

    popup.innerHTML = `
      <div class="adv-title">고급 색상 선택</div>

      <div class="adv-preview-box">
        <div class="adv-preview"></div>
        <input type="text" class="adv-hex" maxlength="7" value="#ffffff">
      </div>

      <div class="adv-slider-block">
        <label>R</label>
        <input type="range" class="adv-r" min="0" max="255" value="255">
      </div>

      <div class="adv-slider-block">
        <label>G</label>
        <input type="range" class="adv-g" min="0" max="255" value="255">
      </div>

      <div class="adv-slider-block">
        <label>B</label>
        <input type="range" class="adv-b" min="0" max="255" value="255">
      </div>

      <div class="adv-slider-block">
        <label>A</label>
        <input type="range" class="adv-a" min="0" max="1" step="0.01" value="1">
      </div>

      <div class="adv-btn-row">
        <button class="adv-apply">적용</button>
        <button class="adv-close">닫기</button>
      </div>
    `;

    document.body.appendChild(popup);

    // 이벤트 연결
    popup.querySelector(".adv-apply").onclick = applyColor;
    popup.querySelector(".adv-close").onclick = close;

    popup.querySelector(".adv-hex").oninput = onHexChange;

    ["adv-r", "adv-g", "adv-b", "adv-a"].forEach(cls => {
      popup.querySelector("." + cls).oninput = refreshPreview;
    });

    return popup;
  }


  /* =====================================================
       2) 팝업 열기
  ===================================================== */
  function open(button, _mode) {
    mode = _mode;
    opener = button;

    const p = createPopup();
    const rect = button.getBoundingClientRect();

    p.style.display = "block";
    p.style.left = `${rect.left}px`;
    p.style.top = `${rect.bottom + 6}px`;

    refreshPreview();
  }


  /* =====================================================
       3) 팝업 닫기
  ===================================================== */
  function close() {
    if (popup) popup.style.display = "none";
  }


  /* =====================================================
       4) 프리뷰 업데이트
  ===================================================== */
  function refreshPreview() {
    const r = +popup.querySelector(".adv-r").value;
    const g = +popup.querySelector(".adv-g").value;
    const b = +popup.querySelector(".adv-b").value;
    const a = +popup.querySelector(".adv-a").value;

    const rgba = `rgba(${r},${g},${b},${a})`;
    popup.querySelector(".adv-preview").style.background = rgba;

    // HEX 자동 변환 (A 제외)
    const hex = "#" +
      r.toString(16).padStart(2, "0") +
      g.toString(16).padStart(2, "0") +
      b.toString(16).padStart(2, "0");

    popup.querySelector(".adv-hex").value = hex;
  }


  /* =====================================================
       5) HEX 직접 입력 시 RGB에 반영
  ===================================================== */
  function onHexChange() {
    let hex = popup.querySelector(".adv-hex").value;

    if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return;

    hex = hex.replace("#", "");

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    popup.querySelector(".adv-r").value = r;
    popup.querySelector(".adv-g").value = g;
    popup.querySelector(".adv-b").value = b;

    refreshPreview();
  }


  /* =====================================================
       6) 색상 적용
  ===================================================== */
  function applyColor() {
    const r = +popup.querySelector(".adv-r").value;
    const g = +popup.querySelector(".adv-g").value;
    const b = +popup.querySelector(".adv-b").value;
    const a = +popup.querySelector(".adv-a").value;

    const rgba = `rgba(${r},${g},${b},${a})`;

    if (mode === "text") {
      EditorCore.setColor(rgba);
    } else {
      EditorCore.setBgColor(rgba);
    }

    close();
  }


  /* =====================================================
       7) 바깥 클릭 시 자동 닫기
  ===================================================== */
  document.addEventListener("click", e => {
    if (!popup) return;

    // 팝업 내부 클릭은 무시
    if (popup.contains(e.target)) return;

    // opener(버튼) 재클릭도 무시
    if (e.target === opener) return;

    close();
  });


  /* =====================================================
       8) 외부 인터페이스
  ===================================================== */
  return {
    open,
    close
  };

})();


