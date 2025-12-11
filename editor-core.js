/* ---------------------------------------------------
   🧠 editor-core.js — FINAL STABLE EDITION
   Ha-Bin Studio · Editor Core Engine
   - TextEngine 명령 실행
   - px 단위 폰트 크기 커스텀 처리
   - range / selection 안정 기반
---------------------------------------------------- */

window.EditorCore = (function () {

  const editor = document.getElementById("hb-editor");

  /* -----------------------------------------
       선택 범위 복구 (이미지 클릭 등 대비)
  ----------------------------------------- */
  let savedRange = null;

  function saveRange() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    savedRange = sel.getRangeAt(0).cloneRange();
  }

  function restoreRange() {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  editor.addEventListener("keyup", saveRange);
  editor.addEventListener("mouseup", saveRange);
  editor.addEventListener("mouseleave", saveRange);


  /* -----------------------------------------
       명령 실행기 (TextEngine → Core → Editor)
  ----------------------------------------- */
  function apply(cmdObj) {
    if (!cmdObj) return;

    restoreRange();

    const cmd = cmdObj.cmd;
    const value = cmdObj.value ?? null;

    /* ---------------------------
         px 사이즈 전용 처리
       --------------------------- */
    if (cmd === "fontSizePx") {
      applyFontSizePx(value);
      return;
    }

    /* ---------------------------
         줄간격 처리
       --------------------------- */
    if (cmd === "lineHeight") {
      applyLineHeight(value);
      return;
    }

    /* ---------------------------
         일반 execCommand 처리
       --------------------------- */
    document.execCommand(cmd, false, value);

    saveRange();
  }


  /* -----------------------------------------
        px 기반 폰트 크기 적용
  ----------------------------------------- */
  function applyFontSizePx(px) {
    if (!px) return;

    const span = document.createElement("span");
    span.style.fontSize = px + "px";

    wrapSelection(span);
  }


  /* -----------------------------------------
        줄간격 적용
  ----------------------------------------- */
  function applyLineHeight(h) {
    const span = document.createElement("span");
    span.style.lineHeight = h;

    wrapSelection(span);
  }


  /* -----------------------------------------
        선택 영역을 span으로 감싸기
  ----------------------------------------- */
  function wrapSelection(node) {
    restoreRange();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    // 범위가 collapsed면 무시
    if (range.collapsed) return;

    range.surroundContents(node);
    saveRange();
  }


  /* -----------------------------------------
        외부 공개 API
  ----------------------------------------- */
  return {
    apply,
    saveRange,
    restoreRange
  };

})();

