/* ---------------------------------------------------
   📦 popup.js — Generic Popup (FINAL / Stable)
   Ha-Bin Studio
   역할: 옵션 리스트 표시 → 값 반환 → 자동 종료
   ❌ 데이터 소유 없음
   ❌ 상태 저장 없음
---------------------------------------------------- */

window.Popup = (function () {

  let popup = null;
  let onSelect = null;

  /* =================================================
     1) Popup 생성
  ================================================= */
  function createPopup() {
    const div = document.createElement("div");
    div.id = "hb-popup";
    div.style.position = "absolute";
    div.style.padding = "8px";
    div.style.background = "#FFFFFF";
    div.style.border = "1px solid #D0D0D0";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    div.style.display = "grid";
    div.style.gridTemplateColumns = "1fr";
    div.style.gap = "6px";
    div.style.zIndex = "999999";
    return div;
  }

  /* =================================================
     2) 열기
     openAt(x, y, options, callback [, renderStyle])
  ================================================= */
  function openAt(x, y, options, callback, renderStyle) {
    close(); // 기존 popup 제거

    popup = createPopup();
    onSelect = callback;

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hb-btn";
      btn.textContent = opt.label;

      // 옵션별 스타일 (선택)
      if (renderStyle) {
        renderStyle(btn, opt.value);
      }

      btn.addEventListener("click", () => {
        if (onSelect) onSelect(opt.value);
        close();
      });

      popup.appendChild(btn);
    });

    document.body.appendChild(popup);
    popup.style.left = x + "px";
    popup.style.top  = y + "px";

    // 외부 클릭 닫기
    setTimeout(() => {
      document.addEventListener("mousedown", handleOutside, { once: true });
    }, 0);
  }

  /* =================================================
     3) 닫기
  ================================================= */
  function close() {
    if (popup) {
      popup.remove();
      popup = null;
    }
    onSelect = null;
  }

  function handleOutside(e) {
    if (popup && !popup.contains(e.target)) {
      close();
    }
  }

  /* =================================================
     4) 외부 공개 API
  ================================================= */
  return {
    openAt,
    close
  };

})();


