/* ==========================================================
   🎨 color-basic.js — Basic Color Palette Engine (FINAL)
   역할:
   - 기본 색상 선택
   - 색없슴 = 기본값 강제 복귀
     · 글자색 → #000000
     · 배경색 → #FFFFFF
   - Advanced 확장 여지 유지 (더보기 버튼)
========================================================== */

window.ColorBasicEngine = (function () {

  /* ======================================================
     1) 상태 (최소)
  ====================================================== */
  const popup = document.getElementById("hb-popup-color-basic");
  let isOpen = false;
  let currentMode = "text"; // "text" | "bg"

  /* ======================================================
     2) 기본 색상 (60색)
  ====================================================== */
  const COLORS = [
    "#000000","#444444","#777777","#BBBBBB","#FFFFFF",
    "#FF0000","#FF6600","#FFCC00","#FFFF00","#CCFF00",
    "#00CC00","#00FF99","#00FFFF","#009999","#0066FF",
    "#0000FF","#3300FF","#6600FF","#9900FF","#CC00FF",
    "#FF00CC","#FF0088","#FF0066","#FF0033","#CC0033",

    "#660000","#663300","#666600","#336600","#006633",
    "#003333","#003366","#000066","#330066","#660033",
    "#663366","#333333",

    "#FFD6D6","#FFE4CC","#FFF2CC","#FFFFCC",
    "#E6FFCC","#CCFFE6","#CCFFFF","#CCE0FF",
    "#E6CCFF","#F2CCF2","#FFD6EB","#FFE6F2"
  ];

  /* ======================================================
     3) 팝업 렌더링
  ====================================================== */
  function renderPopup() {
    popup.innerHTML = "";

    /* ---- popup 기본 스타일 ---- */
    popup.style.position = "absolute";
    popup.style.padding = "10px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    popup.style.display = "grid";
    popup.style.gridTemplateColumns = "repeat(10, 18px)";
    popup.style.gap = "4px";
    popup.style.zIndex = "999999";
    popup.style.pointerEvents = "auto";

    /* ==================================================
       상단 버튼 라인: 색없슴 / 더보기
    ================================================== */
    const topBar = document.createElement("div");
    topBar.style.gridColumn = "span 10";
    topBar.style.display = "grid";
    topBar.style.gridTemplateColumns = "1fr 1fr";
    topBar.style.gap = "6px";

    // 색없슴
    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.className = "hb-btn";
    noneBtn.textContent = "색없슴";

    noneBtn.onclick = () => {
      if (currentMode === "text") {
        EditorCore.setColor("#000000");   // 기본 글자색
      } else {
        EditorCore.setBgColor("#FFFFFF"); // 기본 배경색
      }
      close();
    };

    // 더보기 (Advanced 예정)
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "hb-btn";
    moreBtn.textContent = "더보기…";
    moreBtn.disabled = true;

    topBar.appendChild(noneBtn);
    topBar.appendChild(moreBtn);
    popup.appendChild(topBar);

    /* ==================================================
       색상 팔레트 (60색, 고정 크기)
    ================================================== */
    COLORS.forEach(color => {
      const box = document.createElement("button");
      box.type = "button";
      box.dataset.color = color;
      box.style.width = "18px";
      box.style.height = "18px";
      box.style.background = color;
      box.style.border = "1px solid #CCC";
      box.style.borderRadius = "3px";
      box.style.padding = "0";
      box.style.cursor = "pointer";

      box.onclick = () => {
        if (currentMode === "text") {
          EditorCore.setColor(color);
        } else {
          EditorCore.setBgColor(color);
        }
        close();
      };

      popup.appendChild(box);
    });
  }

  /* ======================================================
     4) 열기 / 닫기
  ====================================================== */
  function openAt(x, y, mode = "text") {
    currentMode = mode;
    if (isOpen) close();

    renderPopup();
    document.body.appendChild(popup);

    popup.style.left = x + "px";
    popup.style.top  = y + "px";
    popup.style.display = "grid";

    isOpen = true;
    setTimeout(() => {
      document.addEventListener("click", handleOutside);
    }, 0);
  }

  function close() {
    popup.style.display = "none";
    isOpen = false;
    document.removeEventListener("click", handleOutside);
  }

  function handleOutside(e) {
    if (!popup.contains(e.target)) close();
  }

  /* ======================================================
     5) 외부 API
  ====================================================== */
  return {
    openAt,
    close
  };

})();



