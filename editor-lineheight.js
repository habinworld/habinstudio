/* =========================================
   📏 editor-lineheight.js
   Ha-Bin Studio · Document Paragraph Engine
   (한글 / 엑셀 / 워드 기준)
========================================= */

window.LineHeightEngine = (function () {

  // 문단 상태 이름 (숫자 ❌)
  const VARIANTS = ["lh-tight", "lh-normal", "lh-wide"];

  function clear(block) {
    if (!block) return;
    block.classList.remove(...VARIANTS);
  }

  function apply(block, variant) {
    if (!block) return;

    if (variant === "default") {
      clear(block);
      return;
    }

    clear(block);
    block.classList.add(variant);
  }

  return {
    apply,
    clear
  };
})();

