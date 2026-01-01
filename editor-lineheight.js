/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v6)
   ------------------------------------------------------
   ✔ 1줄/2줄 선택 100% 적용
   ✔ 빈 문단(<p><br>) 포함
   ✔ 한글/웹 복사 규칙 완전 무효화
   ✔ 선택 문단만 적용 (전체 강제 아님)
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, selection, value) {
    if (!editor || !selection || !selection.rangeCount || value == null) return;

    const range = selection.getRangeAt(0);

    // 1️⃣ 선택 범위에 걸린 "모든 문단" 수집 (텍스트/빈문단 포함)
    const blocks = collectBlocks(editor, range);

    if (!blocks.size) return;

    // 2️⃣ 선택된 문단에만 강제 적용
    blocks.forEach(block => {
      normalizeBlock(block);
      block.style.lineHeight = String(value);
    });
  }

  /* --------------------------------------------------
     선택 범위와 겹치는 모든 문단 수집
     (TEXT 여부 상관 없음)
  -------------------------------------------------- */
  function collectBlocks(editor, range) {
    const set = new Set();
    const blocks = editor.querySelectorAll("p,div,li");

    blocks.forEach(block => {
      try {
        if (range.intersectsNode(block)) {
          set.add(block);
        }
      } catch (_) {}
    });

    return set;
  }

  /* --------------------------------------------------
     외부 규칙 완전 정화 (핵심)
  -------------------------------------------------- */
  function normalizeBlock(block) {
    // 1) line-height / font-size / margin 전부 제거
    block.style.lineHeight = "";
    block.style.fontSize = "";
    block.style.margin = "";
    block.style.padding = "";

    // 2) 자식 노드도 전부 초기화
    block.querySelectorAll("*").forEach(el => {
      el.style.lineHeight = "";
      el.style.fontSize = "";
      el.style.margin = "";
      el.style.padding = "";
      el.style.whiteSpace = "";
    });
  }

  return { apply };

})();
