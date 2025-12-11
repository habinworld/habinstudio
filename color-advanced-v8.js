/* ---------------------------------------------------
   🎨 color-advanced-v8.js — 고급 색상 선택기 (RGBA)
   Ha-Bin Studio · window.AdvancedColor (전역 안정판)
---------------------------------------------------- */

window.AdvancedColor = (function () {

  const POPUP_ID = "hb-popup-color-advanced-v8";

  /* ---------------------------------------------
        팝업 DOM 생성 또는 가져오기
  --------------------------------------------- */
  function getPopup() {
    let popup = document.getElementById(POPUP_ID);

    if (!popup) {
      popup = document.createElement("div");
      popup.id = POPUP_ID;
      popup.className = "hb-advcolor-popup";
      popup.innerHTML = `
        <div class="hb-advcolor-title">고급 색상 (RGBA)</div>

        <input id="hb-advcolor-input" 
               class="hb-advcolor-input" 
               placeholder="예: rgba(255,0,0,1)" />

        <button id="hb-advcolor-apply" class="hb-advcolor-btn">
          적용
        </button>
      `;
      document.body.appendChild(popup);
    }

    return popup;
  }

  /* ---------------------------------------------
        팝업 열기
  --------------------------------------------- */
  function open(button, mode, callback) {
    const popup = getPopup();

    // 위치 지정 (툴바 버튼 아래)
    const rect = button.getBoundingClientRect();
    popup.style.display = "block";
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + 6 + "px";

    const input = document.getElementById("hb-advcolor-input");
    const applyBtn = document.getElementById("hb-advcolor-apply");

    // 이전 입력값 초기화
    input.value = "";

    // 적용 버튼 클릭 → 콜백 실행
    applyBtn.onclick = () => {
      const value = input.value.trim();
      if (!value.startsWith("rgb")) return; // 간단 검증

      popup.style.display = "none";
      callback(value); // EditorCore로 RGBA 전달
    };
  }

  /* ---------------------------------------------
        팝업 닫기: 외부 클릭 시
  --------------------------------------------- */
  document.addEventListener("click", function (e) {
    const popup = document.getElementById(POPUP_ID);
    if (!popup) return;

    const isInside = popup.contains(e.target);
    const isButton = e.target.closest(".hb-btn");

    if (!isInside && !isButton) {
      popup.style.display = "none";
    }
  });

  return {
    open
  };

})();



