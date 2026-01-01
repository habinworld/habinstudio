/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL)
   ------------------------------------------------------
   원칙:
   - 적용 대상은 P / DIV / LI 문단만
   - selection은 믿지 않고 "문단 경계"만 신뢰
   - 계산 ❌ / 선언 ⭕
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount || value == null) return;

    const range = selection.getRangeAt(0);
    const blocks = collectBlocks(editor, range);

    if (!blocks.size) return;

    blocks.forEach(block => {
      normalizeBlock(block);
      block.style.lineHeight = String(value); // 선언
    });
  }

  /* --------------------------------------------------
     선택 range와 "실제로 겹치는" 문단만 수집
     (intersectsNode ❌ / boundary 비교 ⭕)
  -------------------------------------------------- */
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

  /* --------------------------------------------------
     외부 복사 규칙 완전 제거 (출발선 통일)
  -------------------------------------------------- */
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

