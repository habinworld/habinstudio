/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL)
   ------------------------------------------------------
   역할:
   ✔ block(P / DIV / LI) 단위 줄간격 처리
   ✔ 첫 줄 / 빈 문단 대응
   ✔ 외부 복사 line-height 완전 제거
   ✔ 멱등성(idempotent) 보장
   ❌ UI ❌ 상태 저장 ❌ 판단
====================================================== */

window.LineHeightEngine = (function () {

  /* ==================================================
     public API
  ================================================== */
  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const isReset = value === null;

    /* ===============================================
       1) 드래그 선택 → 여러 블록
    =============================================== */
    if (!range.collapsed) {
      const blocks = collectBlocks(editor, range);
      blocks.forEach(block => applyToBlock(block, value, isReset));
      return;
    }

    /* ===============================================
       2) 커서만 있는 경우 → 단일 블록
       (첫 줄 / <br> 대응)
    =============================================== */
    let node = selection.anchorNode;

    // TEXT / BR → 부모부터 시작
    if (node && node.nodeType !== 1) {
      node = node.parentNode;
    }

    while (node && node !== editor) {
      if (isBlock(node)) {
        applyToBlock(node, value, isReset);
        return;
      }
      node = node.parentNode;
    }
  }

  /* ==================================================
     block 수집 (드래그)
  ================================================== */
  function collectBlocks(editor, range) {
    const blocks = new Set();

    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (isBlock(node) && range.intersectsNode(node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      blocks.add(node);
    }
    return blocks;
  }

  /* ==================================================
     block 적용 (핵심)
  ================================================== */
  function applyToBlock(el, value, isReset) {

    // ⭐ 1) 외부 복사 / 잔존 inline line-height 제거
    el.querySelectorAll("[style*='line-height']").forEach(child => {
      child.style.removeProperty("line-height");
    });

    // ⭐ 2) reset → 기본값 복구
    if (isReset) {
      el.style.removeProperty("line-height");
      return;
    }

    // ⭐ 3) 멱등성 보장
    if (el.style.lineHeight === String(value)) return;

    el.style.lineHeight = value;
  }

  /* ==================================================
     util
  ================================================== */
  function isBlock(node) {
    return (
      node.nodeType === 1 &&
      (node.tagName === "P" ||
       node.tagName === "DIV" ||
       node.tagName === "LI")
    );
  }

  return { apply };

})();
