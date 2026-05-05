/* ============================================
   📏 editor-lineheight.js
   Ha-Bin Studio · Paragraph Engine 26. 5. 5
============================================== */

window.LineHeightEngine = (function () {

  function apply(paragraph, value) {
    if (!paragraph) return;

    paragraph.style.lineHeight = value;
  }

  function clear(paragraph) {
    if (!paragraph) return;

    paragraph.style.lineHeight = "";
  }

  return { apply, clear };

})();
