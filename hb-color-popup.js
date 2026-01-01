/* ======================================================
   📦 hb-color-popup.js — Color Popup Container
   ------------------------------------------------------
   역할:
   ✔ 색상 UI용 공용 팝업 DOM 제공
   ✔ 위치 지정 (anchor 기준)
   ✔ 열기 / 닫기
   ❌ UI 생성 ❌ 판단 ❌ 실행
====================================================== */

window.HB_COLOR_POPUP = (function () {

  let popup = null;
  let active = false;
  /* --------------------------------------------------
     팝업 DOM 보장
  -------------------------------------------------- */
  function ensure() {
    if (popup) return popup;

    popup = document.createElement("div");
    popup.id = "hb-color-popup";
    popup.style.position = "absolute";
    popup.style.display = "none";
    popup.style.zIndex = "999999";

    document.body.appendChild(popup);
    return popup;
  }

  /* --------------------------------------------------
     열기 (anchor 기준)
     → popup DOM 반환
  -------------------------------------------------- */
  function openAt(anchor) {
    const el = ensure();
    const r = anchor.getBoundingClientRect();

    el.style.left = r.left + "px";
    el.style.top  = r.bottom + "px";
    el.style.display = "block";
    active = true; 
    return el;
  }

  /* --------------------------------------------------
     닫기
  -------------------------------------------------- */
  function close() {
    if (popup) popup.style.display = "none";
    active = false; 
  }

  return {
    openAt,
    close
  };

})();

