/* =========================================
   📏 editor-lineheight.js
   Ha-Bin Studio · Paragraph Engine
========================================= */

window.LineHeightEngine = (function () {

  const VARIANTS = ["lh-tight", "lh-normal", "lh-wide"];

  function clear(paragraph) {
    if (!paragraph) return;
    paragraph.classList.remove(...VARIANTS);
  }

  function apply(paragraph, variant) {
    if (!paragraph) return;

    if (variant === "default") {
      clear(paragraph);
      return;
    }

    clear(paragraph);
    paragraph.classList.add(variant);
  }

  return { apply, clear };

})();

