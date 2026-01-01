/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v2)
   ------------------------------------------------------
   해결:
   ✔ 첫 줄 / 빈 문단(<p><br></p>)에서도 적용됨
   ✔ 외부 복사(Word/웹)로 들어온 line-height(인라인) 전부 제거
   ✔ 멱등성 보장
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const isReset = value === null;

    // 1) 드래그 선택: 여러 블록
    if (!range.collapsed) {
      const blocks = collectBlocks(editor, range);

      // 선택에 블록이 하나도 안 잡히는 특수 케이스 방어
      if (!blocks.size) {
        const b = getBlockFromSelection(editor, selection, range);
        b && blocks.add(b);
      }

      blocks.forEach(block => applyToBlock(block, value, isReset));
      return;
    }

    // 2) 커서만: 단일 블록
    const block = getBlockFromSelection(editor, selection, range);
    block && applyToBlock(block, value, isReset);
  }

  /* --------------------------------------------------
     커서/선택 위치에서 "현재 블록" 찾기 (첫 줄 해결 핵심)
  -------------------------------------------------- */
  function getBlockFromSelection(editor, selection, range) {
    // startContainer가 가장 신뢰도 높음 (anchorNode가 editor로 잡히는 케이스 있음)
    let node = range.startContainer || selection.anchorNode || selection.focusNode;

    if (!node) return null;

    // TEXT/BR 등 → 부모부터
    if (node.nodeType !== 1) node = node.parentNode;

    // node가 editor 자체로 잡히는 케이스 (첫 줄/빈 문단에서 자주 발생)
    if (node === editor) {
      const first = editor.firstElementChild;
      return isBlock(first) ? first : null;
    }

    // 위로 올라가며 P/DIV/LI 찾기
    while (node && node !== editor) {
      if (isBlock(node)) return node;
      node = node.parentNode;
    }

    // 그래도 없으면 첫 블록 fallback
    const fallback = editor.querySelector("p,div,li");
    return isBlock(fallback) ? fallback : null;
  }

  /* --------------------------------------------------
     드래그 선택 시 블록 수집
  -------------------------------------------------- */
  function collectBlocks(editor, range) {
    const blocks = new Set();

    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (isBlock(node) && safeIntersects(range, node)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) blocks.add(node);

    return blocks;
  }

  // range.intersectsNode가 가끔 예외/불안정 케이스가 있어서 안전 래핑
  function safeIntersects(range, node) {
    try { return range.intersectsNode(node); }
    catch (e) { return false; }
  }

  /* --------------------------------------------------
     블록 적용 (외부 복사 초기화 + 멱등성)
  -------------------------------------------------- */
  function applyToBlock(blockEl, value, isReset) {
    if (!blockEl) return;

    // ⭐ 1) 외부 복사로 남아있는 "인라인 line-height" 전부 제거
    // - selector로 걸러내면 대문자/공백/형식차로 누락될 수 있어서
    //   실제 style.lineHeight 존재 여부로 제거한다.
    clearInlineLineHeight(blockEl);

    // ⭐ 2) reset
    if (isReset) {
      blockEl.style.removeProperty("line-height");
      return;
    }

    // ⭐ 3) 멱등성
    if (blockEl.style.lineHeight === String(value)) return;

    blockEl.style.lineHeight = value;
  }

  function clearInlineLineHeight(root) {
    // 블록 자신 포함
    if (root.style && root.style.lineHeight) {
      root.style.removeProperty("line-height");
    }

    // 자식 전체 순회 (Word/웹 복사 대응)
    root.querySelectorAll("*").forEach(el => {
      if (el.style && el.style.lineHeight) {
        el.style.removeProperty("line-height");
      }
    });
  }

  function isBlock(node) {
    return !!(
      node &&
      node.nodeType === 1 &&
      (node.tagName === "P" || node.tagName === "DIV" || node.tagName === "LI")
    );
  }

  return { apply };

})();
