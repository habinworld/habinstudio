/* ======================================================
   🎨 color-ui-engine.js — Color MODE Controller (FINAL)
   ====================================================== */

(function () {

  const MODE_BASIC = 0;
  const MODE_ADVANCED = 1;

  let mode = MODE_BASIC;
  let view = "square"; // square | honey
  let popup = null;
  let type = "text";   // text | bg

  /* ===============================
     외부 진입점
  =============================== */
  window.openTextColorUI = function (anchor, popupEngine) {
    type = "text";
    popup = popupEngine.openAt(anchor);
    mode = MODE_BASIC;
    view = "square";
    render();
  };

  window.openBgColorUI = function (anchor, popupEngine) {
    type = "bg";
    popup = popupEngine.openAt(anchor);
    mode = MODE_BASIC;
    view = "square";
    render();
  };

  /* ===============================
     렌더 분기 (if/else 최소)
  =============================== */
  function render() {
    if (mode === MODE_BASIC) {
      ColorBasicEngine.render(popup, handleSelect, handleViewChange);
    } else {
      ColorAdvancedEngine.render(
        popup,
        value => applyColor(value),
        () => {
          mode = MODE_BASIC;
          view = "square";
          render();
        }
      );
    }
  }

  /* ===============================
     BASIC → 선택 결과
  =============================== */
  function handleSelect(value) {
    if (value === "__ADVANCED__") {
      mode = MODE_ADVANCED;
      render() ;
      return ;
    }
    applyColor(value);
  }

  function handleViewChange(nextView) {
    view = nextView;
    ColorBasicEngine.setView(view);
    ColorBasicEngine.render(popup, handleSelect, handleViewChange);
  }

  /* ===============================
     실행 연결 (판단 없음)
  =============================== */
  function applyColor(value) {
   const isBase = (value === "" || value === null || value === "__NONE__" || value === "__BASE__");
  const engine = (type === "text") ? ColorTextEngine : ColorBgEngine;

  const baseText = "#000000";
  const baseBg   = "#ffffff";

  const color = isBase
    ? (type === "text" ? baseText : baseBg)
    : value;

  engine.apply(color);
}

})();


