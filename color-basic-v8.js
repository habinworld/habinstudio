/* ---------------------------------------------------
   🎨 color-basic-v8.js — 기본 색상 선택기 (전역 안정판)
   Ha-Bin Studio — window.ColorBasic 등록 버전
---------------------------------------------------- */

window.ColorBasic = (function () {

  // 기본 색상 팔레트
  const COLORS = [
    "#000000", "#333333", "#666666", "#999999", "#cccccc", "#ffffff",
    "#ff0000", "#ff6600", "#ffcc00", "#ffff00",
    "#00ff00", "#009900",
    "#00ffff", "#0066ff", "#0000ff",
    "#9900ff", "#ff00ff"
  ];

  // 팝업 DOM ID
  const POPUP_ID = "hb-popup-color-basic-v8";

  /* ---------------------------------------------------
        팝업 생성 또는 가져오기
  ---------------------------------------------------- */
  function getPopup() {
    let popup = document.getElementById(POPUP_ID);
    if (!popup) {
      popup = document.createElement("div");
      popup.id = POPUP_ID;
      popup.className = "hb-color-basic-popup";
      document.body.appendChild(popup);
    }
    return popup;
  }

  /* ---------------------------------------------------
        팝업 열기
  ---------------------------------------------------- */
  function open(button, mode, callback) {
    const popup = getPopup();
    popup.innerHTML = ""; // 초기화

    popup.style.display = "grid";
    popup.style.position = "absolute";

    // 버튼 바로 아래에 위치시킴
    const rect = button.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + 5 + "px";

    // 색상 버튼 생성
    COLORS.forEach(color => {
      const box = document.createElement("div");
      box.className = "hb-color-basic-item";
      box.style.backgroundColor = color;

      box.addEventListener("click", () => {
        popup.style.display = "none";
        callback(color);  // EditorCore에게 색상 전달
      });

      popup.appendChild(box);
    });
  }

  /* ---------------------------------------------------
        팝업 닫기 (외부 클릭)
  ---------------------------------------------------- */
  document.addEventListener("click", (e) => {
    const popup = document.getElementById(POPUP_ID);
    if (!popup) return;

    if (!popup.contains(e.target) && !e.target.closest(".hb-btn")) {
      popup.style.display = "none";
    }
  });

  /* ---------------------------------------------------
        외부 제공 함수
  ---------------------------------------------------- */
  return {
    open
  };

})();

  


