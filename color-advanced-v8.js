/* ---------------------------------------------------
   🌈 color-advanced-v8.js — 고급 색상 선택 (전역)
   Ha-Bin Studio — window.AdvancedColor 등록
---------------------------------------------------- */

window.AdvancedColor = (function () {

  let currentCallback = null;

  function open(button, mode, callback) {
    close();

    currentCallback = callback;

    const box = document.createElement("div");
    box.className = "hb-advcolor-box";

    box.innerHTML = `
      <div class="adv-row">
        <label>R</label><input type="range" min="0" max="255" value="0" id="adv-r">
      </div>
      <div class="adv-row">
        <label>B</label><input type="range" min="0" max="255" value="0" id="adv-g">
      </div>
      <div class="adv-row">
        <label>B</label><input type="range" min="0" max="255" value="0" id="adv-b">
      </div>
      <div class="adv-row">
        <label>A</label><input type="range" min="0" max="1" step="0.01" value="1" id="adv-a">
      </div>
      <div class="adv-preview"></div>
      <button id="adv-apply">적용</button>
    `;

    document.body.appendChild(box);

    // 위치
    const rect = button.getBoundingClientRect();
    box.style.top = rect.bottom + 8 + "px";
    box.style.left = rect.left + "px";

    // 실시간 반영
    box.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", updatePreview);
    });

    // 적용
    box.querySelector("#adv-apply").addEventListener("click", () => {
      callback(getRGBA());
      close();
    });

    updatePreview();
  }

  function getRGBA() {
    const r = document.getElementById("adv-r").value;
    const g = document.getElementById("adv-g").value;
    const b = document.getElementById("adv-b").value;
    const a = document.getElementById("adv-a").value;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function updatePreview() {
    const preview = document.querySelector(".hb-advcolor-box .adv-preview");
    preview.style.background = getRGBA();
  }

  function close() {
    const old = document.querySelector(".hb-advcolor-box");
    if (old) old.remove();
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".hb-advcolor-box") &&
        !e.target.closest(".hb-btn")) {
      close();
    }
  });

  return {
    open,
    close
  };

})();




