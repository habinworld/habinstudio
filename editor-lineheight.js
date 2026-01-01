/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v4)
   ------------------------------------------------------
   Ha-Bin Studio 헌법 적용

   ✔ 외부 규칙 무시
   ✔ 선택한 "문단 단위"에만 적용
   ✔ 문단 내부 inline line-height 전부 제거
   ✔ editor-core는 배선판 유지
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || value == null) return;

    const range = selection.rangeCount
      ? selection.getRangeAt(0)
      : null;

    if (!range) return;

    // 1️⃣ 선택 범위 안의 문단 수집
    const blocks = collectSelectedBlocks(editor, range);

    // 안전장치: 블록이 하나도 안 잡히면 현재 문단
    if (!blocks.length) {
      const b = getCurrentBlock(editor, range);
      b && blocks.push(b);
    }

    // 2️⃣ 선택 문단들에만 동일 적용
    blocks.forEach(block => {
      clearInlineLineHeight(block);
      block.style.lineHeight = String(value);
    });
  }

  /* --------------------------------------------------
     선택 범위와 겹치는 문단 수집
  -------------------------------------------------- */
  function collectSelectedBlocks(editor, range) {
    const result = [];
    const blocks = editor.querySelectorAll("p,div,li");

    blocks.forEach(block => {
      try {
        if (range.intersectsNode(block)) {
          result.push(block);
        }
      } catch (_) {}
    });

    return result;
  }

  /* --------------------------------------------------
     커서만 있을 때 현재 문단
  -------------------------------------------------- */
  function getCurrentBlock(editor, range) {
    let node = range.startContainer;
    if (node.nodeType !== 1) node = node.parentNode;

    while (node && node !== editor) {
      if (isBlock(node)) return node;
      node = node.parentNode;
    }
    return null;
  }

  /* --------------------------------------------------
     외부 복사 잔재 제거
  -------------------------------------------------- */
  function clearInlineLineHeight(root) {
    if (root.style && root.style.lineHeight) {
      root.style.removeProperty("line-height");
    }
    root.querySelectorAll("*").forEach(el => {
      if (el.style && el.style.lineHeight) {
        el.style.removeProperty("line-height");
      }
    });
  }

  function isBlock(node) {
    return (
      node &&
      node.nodeType === 1 &&
      (node.tagName === "P" || node.tagName === "DIV" || node.tagName === "LI")
    );
  }

  return { apply };

})();
