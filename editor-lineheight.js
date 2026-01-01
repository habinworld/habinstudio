/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v3)
   ------------------------------------------------------
   Ha-Bin Studio 헌법 적용

   원칙:
   ✔ editor-core는 배선판 (selection 전달만)
   ✔ 외부 규칙 전부 무시
   ✔ HTML/INLINE 규칙 무효
   ✔ TEXT 기반 <p> 구조만 신뢰
   ✔ 줄간격은 "문단 공통 규칙"
   ✔ 전체 / 부분 / 커서 구분 없이 동일 결과
====================================================== */

window.LineHeightEngine = (function () {

  /* --------------------------------------------------
     PUBLIC API
     editor-core에서 이것만 호출
     LineHeightEngine.apply(editor, value)
  -------------------------------------------------- */
  function apply(editor, value) {
    if (!editor || value == null) return;

    // ⚖ 헌법: 줄간격은 선택 개념이 아님
    // → 문서 전체 문단에 동일 적용
    const blocks = editor.querySelectorAll("p,div,li");

    blocks.forEach(block => {
      applyToBlock(block, value);
    });
  }

  /* --------------------------------------------------
     INTERNAL — 단일 블록 적용
  -------------------------------------------------- */
  function applyToBlock(blockEl, value) {
    if (!blockEl) return;

    // 1️⃣ 과거 세계의 흔적 제거
    clearInlineLineHeight(blockEl);

    // 2️⃣ 에디터 규칙 강제
    blockEl.style.lineHeight = String(value);
  }

  /* --------------------------------------------------
     외부 복사(한글/웹) 잔재 제거
     - inline style line-height 전부 제거
     - 계산값 / 상속 여부 고려 안 함 (헌법상 무효)
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

  return { apply };

})();

