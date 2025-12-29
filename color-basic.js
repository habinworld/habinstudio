/* ==========================================================
   🎨 color-basic.js — Basic Color Palette Engine (FINAL)
   ----------------------------------------------------------
   역할 (헌법 고정):
   ✔ BASIC 색상 선택 UI 렌더링만 담당
   ✔ 값 또는 "__ADVANCED__" 신호만 반환
   ❌ 팝업 열기/닫기 ❌ 상태 저장 ❌ 판단 ❌ 실행
========================================================== */

window.ColorBasicEngine = (function () {

  /* ======================================================
     1) 고정 색상 팔레트
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
     2) BASIC UI 렌더링
     - popup: 이미 열린 팝업 컨테이너
     - onSelect(value): 값 또는 "__ADVANCED__"
  ====================================================== */
  function render(popup, onSelect) {
    popup.innerHTML = "";

    /* ---------- 팝업 기본 스타일 ---------- */
    popup.style.padding = "10px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    popup.style.display = "grid";
    popup.style.gridTemplateColumns = "repeat(10, 18px)";
    popup.style.gap = "4px";
    popup.style.pointerEvents = "auto";

    /* ---------- 상단 버튼 영역 ---------- */
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
      onSelect && onSelect(null);
    };

    // 더보기 → MODE_ADVANCED 신호
    const moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "hb-btn";
    moreBtn.textContent = "더보기…";
    moreBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect && onSelect("__ADVANCED__");
    };

    topBar.appendChild(noneBtn);
    topBar.appendChild(moreBtn);
    popup.appendChild(topBar);

    /* ---------- 색상 팔레트 ---------- */
    COLORS.forEach(color => {
      const box = document.createElement("button");
      box.type = "button";
      box.style.width = "18px";
      box.style.height = "18px";
      box.style.background = color;
      box.style.border = "1px solid #CCC";
      box.style.borderRadius = "3px";
      box.style.padding = "0";
      box.style.cursor = "pointer";

      box.onclick = () => {
        onSelect && onSelect(color);
      };

      popup.appendChild(box);
    });
  }

  /* ======================================================
     외부 공개 API
  ====================================================== */
  return {
    render
  };

})();





