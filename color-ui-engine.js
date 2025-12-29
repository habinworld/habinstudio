/* ======================================================
   🎨 color-ui-engine.js
   역할:
   - BASIC / ADVANCED 모드 전환만 담당
   - UI ↔ UI 연결
   - UI ↔ 실행(ColorTextEngine) 연결
   ❌ UI 생성 ❌ 색상 적용 ❌ 팝업 open/close
====================================================== */

(function () {

  const MODE_BASIC = 0;
  const MODE_ADVANCED = 1;

  let mode = MODE_BASIC;
  let popup = null;

  /* --------------------------------------------------
     외부에서 최초 호출 (툴바 버튼 등)
     anchor: 버튼 DOM
     popupEngine: openAt() 제공하는 팝업 엔진
  -------------------------------------------------- */
  window.openTextColorUI = function (anchor, popupEngine) {
    popup = popupEngine.openAt(anchor);
    mode = MODE_BASIC;
    renderBasic();
  };

  /* --------------------------------------------------
     BASIC MODE
  -------------------------------------------------- */
  function renderBasic() {
    ColorBasicEngine.render(popup, onBasicSelect);
  }

  function onBasicSelect(value) {
    // 1) 더보기 → MODE 전환
    if (value === "__ADVANCED__") {
      mode = MODE_ADVANCED;
      renderAdvanced();
      return;
    }

    // 2) 색상 값 → 실행
    ColorTextEngine.apply(value);
  }

  /* --------------------------------------------------
     ADVANCED MODE
  -------------------------------------------------- */
  function renderAdvanced() {
    ColorAdvancedEngine.render(
      popup,
      onAdvancedSelect,
      onBackToBasic
    );
  }

  function onAdvancedSelect(rgba) {
    ColorTextEngine.apply(rgba);
  }

  function onBackToBasic() {
    mode = MODE_BASIC;
    renderBasic();
  }

})();

