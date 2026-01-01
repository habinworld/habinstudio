/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v2)
   ------------------------------------------------------
   원칙:
   - 적용 대상은 P / DIV / LI 문단만
   - selection 불신, 문단 경계만 신뢰
   - 계산 ❌ / 선언 ⭕
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount || value == null) return;

    let range = selection.getRangeAt(0);

    // 🔒 selection이 <body> 등 editor 밖이면 editor 기준으로 보정
    if (!editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
    }

    const blocks = collectBlocks(editor, range);
    if (!blocks.size) return;

    blocks.forEach(block => {
      normalizeBlock(block);
      block.style.lineHeight = String(value); // 선언
    });
  }

  function collectBlocks(editor, range) {
    const set = new Set();
    const blocks = editor.querySelectorAll("p,div,li");

    blocks.forEach(block => {
      const r = document.createRange();
      r.selectNodeContents(block);

      const endsBefore =
        range.compareBoundaryPoints(Range.END_TO_START, r) <= 0;
      const startsAfter =
        range.compareBoundaryPoints(Range.START_TO_END, r) >= 0;

      if (!(endsBefore || startsAfter)) {
        set.add(block);
      }
    });

    return set;
  }

  function normalizeBlock(block) {
    block.style.lineHeight = "";
    block.style.margin = "";
    block.style.padding = "";

    block.querySelectorAll("*").forEach(el => {
      el.style.lineHeight = "";
      el.style.margin = "";
      el.style.padding = "";
      el.style.whiteSpace = "";
    });
  }

  return { apply };

})();
