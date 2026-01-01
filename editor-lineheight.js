/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v2.1)
   ------------------------------------------------------
   원칙:
   - 적용 대상은 문단 블록만 (P / LI / 문단용 DIV)
   - selection 불신, 문단 경계만 신뢰
   - 계산 ❌ / 선언 ⭕
   - editor / body 전염 절대 금지
   - 단독 사용 가능 (EditorCore 수정 불필요)
====================================================== */
window.LineHeightEngine = (function () {

  /* ==================================================
     Public API
  ================================================== */
  function apply(editor, selection, value) {
 if (!editor || !selection || !selection.rangeCount || value == null) return;

    let range = selection.getRangeAt(0);

    // 🔒 selection이 editor 밖이면 editor 내부 전체로 보정
    if (!editor.contains(range.commonAncestorContainer)) {
      range = document.createRange();
      range.selectNodeContents(editor);
    }

    const isCollapsed = range.collapsed;
    const blocks = collectBlocks(editor, range);
    if (!blocks.size) return;

    // 🔒 커서만 있는 경우: 현재 문단 1개만 적용
if (isCollapsed) {
  const node = range.startContainer.nodeType === 3
    ? range.startContainer.parentNode
    : range.startContainer;

  let current = node.closest("p, li, div[data-hb-block]");

  // 커서가 editor 레벨에 걸린 경우 → 첫 문단 사용
  if (!current) {
  current = editor.querySelector("p, li, div[data-hb-block]");
}

  if (current) {
    normalizeBlock(current);
    current.style.lineHeight = String(value);
    return;
  }
}
    
    // 🔒 일반 선택 범위: 겹치는 문단만 적용
    blocks.forEach(block => {
      normalizeBlock(block);
      block.style.lineHeight = String(value);
    });
  }

  /* ==================================================
     문단 수집 — range와 겹치는 블록만
  ================================================== */
  function collectBlocks(editor, range) {
    const set = new Set();
    const blocks = editor.querySelectorAll("p, li, div[data-hb-block]");

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

  /* ==================================================
     문단 정규화 — 줄간격 전염 차단
     (white-space는 건드리지 않는다)
  ================================================== */
  function normalizeBlock(block) {
    block.style.lineHeight = "";
    block.style.margin = "";
    block.style.padding = "";

    block.querySelectorAll("*").forEach(el => {
      el.style.lineHeight = "";
      el.style.margin = "";
      el.style.padding = "";
    });
  }

  /* ==================================================
     Export
  ================================================== */
  return { apply };

})();

