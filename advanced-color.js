/* ---------------------------------------------------
   🌈 advanced-color.js v7.0 — Pro Spectrum Engine
   Ha-Bin Studio Editor
---------------------------------------------------- */

const AdvancedColor = (() => {

  let popup = null;
  let mode = null; // "text" or "bg"

  /* ============================
        팝업 DOM 자동 생성
  ============================= */
  function createPopup() {
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "hb-advanced-color";
    popup.className = "hb-advanced-color";

    popup.innerHTML = `
      <div class="adv-title">고급 색상 선택</div>

      <div class="adv-preview-box">
        <div class="adv-preview"></div>
        <input type="text" class="adv-hex" maxlength="7" value="#ffffff" />
      </div>

      <div class="adv-slider-block">
        <label>R</label>
        <input type="range" min="0" max="255" value="255" class="adv-r" />
      </div>

      <div class="adv-slider-block">
        <label>G</label>
        <input type="range" min="0" max="255" value="255" class="adv-g" />
      </div>

      <div class="adv-slider-block">
        <label>B</label>
        <input type="range" min="0" max="255" value="255" class="adv-b" />
      </div>

      <div class="adv-slider-block">
        <label>A</label>
        <input type="range" min="0" max="1" step="0.01" value="1" class="adv-a" />
      </div>

      <div class="adv-btn-row">
        <button class="adv-apply">적용</button>
        <button class="adv-close">닫기</button>
      </div>
    `;

    document.body.appendChild(popup);

    /* 이벤트 연결 */
    popup.querySelector(".adv-apply").onclick = applyColor;
    popup.querySelector(".adv-close").onclick = closePopup;

    ["adv-r", "adv-g", "adv-b", "adv-a"].forEach(cls => {
      popup.querySelector("." + cls).oninput = updatePreview;
    });

    popup.querySelector(".adv-hex").oninput = hexInputChanged;

    return popup;
  }

  /* ============================
        팝업 열기
  ============================= */
  function openPopup(button, _mode) {
    mode = _mode;
    const p = createPopup();

    const rect = button.getBoundingClientRect();
    p.style.display = "block";
    p.style.left = `${rect.left}px`;
    p.style.top = `${rect.bottom + 8}px`;
  }

  /* ============================
        팝업 닫기
  ============================= */
  function closePopup() {
    if (popup) popup.style.display = "none";
  }

  /* ============================
        미리보기 업데이트
  ============================= */
  function updatePreview() {
    const r = popup.querySelector(".adv-r").value;
    const g = popup.querySelector(".adv-g").value;
    const b = popup.querySelector(".adv-b").value;
    const a = popup.querySelector(".adv-a").value;

    const color = `rgba(${r},${g},${b},${a})`;

    popup.querySelector(".adv-preview").style.background = color;

    // HEX도 자동 업데이트 (A는 제외)
    const hex = "#" +
      Number(r).toString(16).padStart(2, "0") +
      Number(g).toString(16).padStart(2, "0") +
      Number(b).toString(16).padStart(2, "0");

    popup.querySelector(".adv-hex").value = hex;
  }

  /* ============================
        HEX 직접 입력
  ============================= */
  function hexInputChanged() {
    let hex = popup.querySelector(".adv-hex").value;

    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) return;

    hex = hex.replace("#", "");

    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    popup.querySelector(".adv-r").value = r;
    popup.querySelector(".adv-g").value = g;
    popup.querySelector(".adv-b").value = b;

    updatePreview();
  }

  /* ============================
        색상 적용
  ============================= */
  function applyColor() {
    const r = popup.querySelector(".adv-r").value;
    const g = popup.querySelector(".adv-g").value;
    const b = popup.querySelector(".adv-b").value;
    const a = popup.querySelector(".adv-a").value;

    const color = `rgba(${r},${g},${b},${a})`;

    const cmd = mode === "text" ? "foreColor" : "hiliteColor";
    document.execCommand(cmd, false, color);

    closePopup();
  }

  /* ============================
        클릭 외부 시 닫기
  ============================= */
  document.addEventListener("click", e => {
    if (!popup) return;
    if (popup.contains(e.target)) return;
    if (e.target.closest("#hb-advcolor") ||
        e.target.closest("#hb-advanced")) return;

    closePopup();
  });

  return { openPopup };

})();

