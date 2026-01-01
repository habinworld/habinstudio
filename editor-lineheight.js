/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL)
   ------------------------------------------------------
   역할:
   ✔ block(P / DIV / LI) 단위 줄간격 처리
   ✔ 멱등성 보장 (같은 값 재적용 무시)
   ✔ null → 기본값 복구
   ❌ UI ❌ 상태 저장 ❌ 선택 판단
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // null → 기본값 복구
    const isReset = value === null;

    /* ===============================
       1) 드래그 선택 (여러 블록)
    =============================== */
    if (!range.collapsed) {
      const blocks = new Set();

      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            if (
              (node.tagName === "P" ||
               node.tagName === "DIV" ||
               node.tagName === "LI") &&
              range.intersectsNode(node)
            ) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      let node;
      while ((node = walker.nextNode())) blocks.add(node);

      blocks.forEach(el => applyToBlock(el, value, isReset));
      return;
    }

    /* ===============================
       2) 커서만 있는 경우 (단일 블록)
    =============================== */
    let node = selection.anchorNode;
    while (node && node !== editor) {
      if (
        node.nodeType === 1 &&
        (node.tagName === "P" ||
         node.tagName === "DIV" ||
         node.tagName === "LI")
      ) {
        applyToBlock(node, value, isReset);
        return;
      }
      node = node.parentNode;
    }
  }

  /* ===============================
     block 단위 적용 (멱등성)
  =============================== */
  function applyToBlock(el, value, isReset) {
    if (isReset) {
      el.style.removeProperty("line-height");
      return;
    }

    if (el.style.lineHeight === String(value)) return; // ⭐ 핵심
    el.style.lineHeight = value;
  }

  return { apply };

})();

