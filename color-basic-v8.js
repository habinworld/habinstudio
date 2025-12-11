/* ---------------------------------------------------
   🎨 color-basic-v8.js — 전역 기본 색상 선택기
   Ha-Bin Studio — window.ColorBasic 등록
---------------------------------------------------- */

window.ColorBasic = (function () {

  let currentCallback = null;

  const COLORS = [
    "#000000", "#444444", "#777777", "#AAAAAA", "#FFFFFF",
    "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF",
    "#0000FF", "#8B00FF", "#FF1493", "#5BB6C8", "#AEEFF2"
  ];

  /* ----------------------------------------------
       팝업 생성
  ---------------------------------------------- */
  function open(button, mode, callback) {
    close(); // 기존 팝업 제거

    currentCallback = callback;

    const box = document.createElement("div");
    box.className = "hb-color-basic-box";

    COLORS.forEach(color => {
      const el = document.createElement("div");
      el.className = "hb-color-basic-item";
      el.style.background = color;

      el.addEventListener("click", () => {
        callback(color);
        close();
      });

      box.appendChild(el);
    });

    document.body.appendChild(box);

    // 버튼 기준으로 위치 설정
    const rect = button.getBoundingClientRect();
    box.style.top = rect.bottom + 6 + "px";
    box.style.left = rect.left + "px";
  }

  /* ----------------------------------------------
       팝업 제거
  ---------------------------------------------- */
  function close() {
    const old = document.querySelector(".hb-color-basic-box");
    if (old) old.remove();
  }

  // 다른 곳 클릭 시 닫기
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".hb-color-basic-box") &&
        !e.target.closest(".hb-btn")) {
      close();
    }
  });

  return {
    open,
    close
  };

})();

  


