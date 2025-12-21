/* ==========================================================
   🎨 color-basic.js — Final Stable Edition
   Ha-Bin Studio · Basic Color Palette Engine
   window.ColorBasicEngine 등록 버전
========================================================== */

window.ColorBasicEngine = (function () {

  const popup = document.getElementById("hb-popup-color-basic");
  let isOpen = false;

  /* --------------------------------------------------------
        📌 1) 기본 색상 팔레트 (16색)
  --------------------------------------------------------- */
  const COLORS = [
    "#000000", "#444444", "#777777", "#BBBBBB",
    "#FF0000", "#FF6600", "#FFCC00", "#FFFF00",
    "#00CC00", "#009999", "#0066FF", "#0000FF",
    "#9900FF", "#CC00CC", "#FF0088", "#FF99CC"
  ];

  /* --------------------------------------------------------
        📌 2) 팝업 렌더링
  --------------------------------------------------------- */
  function renderPopup() {
  popup.innerHTML = "";

  popup.style.position = "absolute";
  popup.style.padding = "10px";
  popup.style.background = "#FFFFFF";
  popup.style.border = "1px solid #D0D0D0";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  popup.style.display = "grid";
  popup.style.gridTemplateColumns = "repeat(4, 24px)";
  popup.style.gap = "8px";
  popup.style.zIndex = "999999";           // 팝업은 무조건 최상위
  popup.style.pointerEvents = "auto";

  COLORS.forEach(color => {
    const box = document.createElement("button");
    box.type = "button";
    box.dataset.color = color;
    box.style.width = "24px";
    box.style.height = "24px";
    box.style.background = color;
    box.style.borderRadius = "4px";
    box.style.cursor = "pointer";
    box.style.border = "1px solid #CCC";
    box.style.padding = "0";
    popup.appendChild(box);
  });
}
popup.addEventListener("mousedown", e => {
  e.stopPropagation();

  const box = e.target.closest("[data-color]");
  if (!box) return;

  // ✅ 드래그/커서 모두 EditorCore가 처리
  EditorCore.setColor(box.dataset.color);

  close();
});




  /* --------------------------------------------------------
        📌 3) 팝업 열기
  --------------------------------------------------------- */
  function openAt(x, y) {
  if (isOpen) close();

  renderPopup();

  // ✅ 어떤 컨테이너/레이어 영향도 안 받게 body 최상위로 올림
  document.body.appendChild(popup);

  popup.style.left = x + "px";
  popup.style.top  = y + "px";
  popup.style.display = "grid";

  isOpen = true;

 setTimeout(() => {
  document.addEventListener("click", handleOutside);
}, 0);
}

  /* --------------------------------------------------------
        📌 4) 팝업 닫기
  --------------------------------------------------------- */
  function close() {
    popup.style.display = "none";
    isOpen = false;
     document.removeEventListener("click", handleOutside);
  }

  function handleOutside(e) {
    if (!popup.contains(e.target)) {
      close();
    }
  }


  /* --------------------------------------------------------
        📌 외부 API
  --------------------------------------------------------- */
  return {
    openAt,
    close
  };

})();



