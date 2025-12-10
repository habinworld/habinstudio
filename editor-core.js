/* ---------------------------------------------------
   ⚙️ editor-core.js v8.0 — Heart Engine
   Ha-Bin Studio — Modular Hybrid Editor
---------------------------------------------------- */

const EditorCore = (() => {

  /* ================================
        0) 기본 DOM
  ================================ */
  const editor = document.getElementById("editor");

  if (!editor) {
    console.error("[EditorCore] editor 영역(#editor)을 찾을 수 없습니다.");
    return {};
  }

  let isLock = false;       // execCommand 충돌 방지
  let savedRange = null;    // 커서/선택 영역 보존용


  /* ================================
        1) 커서 관리
  ================================ */
  function saveRange() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedRange = sel.getRangeAt(0);
    }
  }

  function restoreRange() {
    if (!savedRange) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }

  editor.addEventListener("keyup", saveRange);
  editor.addEventListener("mouseup", saveRange);
  editor.addEventListener("input", saveRange);

  function focusEditor() {
    editor.focus({ preventScroll: true });
    restoreRange();
  }


  /* ================================
        2) execCommand 안정 래퍼
  ================================ */
  function command(cmd, value = null) {
    if (isLock) return;
    isLock = true;

    focusEditor();
    document.execCommand(cmd, false, value);

    isLock = false;
    saveRange();
  }


  /* ================================
        3) 글꼴 / 글자크기 / 줄간격
  ================================ */
  function setFont(font) {
    command("fontName", font);
  }

  // px 기반 글자크기
  function setFontSize(px) {
    focusEditor();

    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    const span = document.createElement("span");
    span.style.fontSize = px + "px";

    span.appendChild(range.extractContents());
    range.insertNode(span);

    saveRange();
  }

  function setLineHeight(value) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const block = sel.anchorNode?.parentNode;
    if (!block) return;

    block.style.lineHeight = value;
    saveRange();
  }


  /* ================================
        4) 색상 엔진 연결
  ================================ */
  function setColor(color) {
    command("foreColor", color);
  }

  function setBgColor(color) {
    command("hiliteColor", color);
  }

  // 고급 색상 팝업
  function openAdvancedColor(type, btn) {
    AdvancedColor.open(btn, type); // type = "text" | "bg"
  }


  /* ================================
        5) Bold / Italic / Underline
  ================================ */
  function bold() { command("bold"); }
  function italic() { command("italic"); }
  function underline() { command("underline"); }


  /* ================================
        6) 텍스트 정렬
  ================================ */
  function alignLeft() { command("justifyLeft"); }
  function alignCenter() { command("justifyCenter"); }
  function alignRight() { command("justifyRight"); }
  function alignJustify() { command("justifyFull"); }


  /* ================================
        7) 리스트
  ================================ */
  function ul() { command("insertUnorderedList"); }
  function ol() { command("insertOrderedList"); }


  /* ================================
        8) 서식 초기화
  ================================ */
  function clearFormat() {
    command("removeFormat");

    // span/font에 남아있던 inline-style까지 제거
    editor.querySelectorAll("span, font").forEach(el => {
      el.removeAttribute("style");
    });
  }


  /* ================================
        9) Undo / Redo
  ================================ */
  function undo() { command("undo"); }
  function redo() { command("redo"); }


  /* ================================
        10) 이미지 엔진 연결
  ================================ */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  function imageAlign(dir) {
    ImageEngine.align(dir); // 좌/중앙/우
  }


  /* ================================
        11) 외부 클릭 시 팝업 자동 닫기
  ================================ */
  document.addEventListener("click", e => {
    if (!e.target.closest(".hb-color-popup") &&
        !e.target.closest(".hb-advanced-popup") &&
        !e.target.closest("#hb-color-btn") &&
        !e.target.closest("#hb-bgcolor-btn")) {

      ColorBasic.close?.();
      AdvancedColor.close?.();
    }
  });


  /* ================================
        12) 편집기 초기 포커스
  ================================ */
  editor.addEventListener("click", saveRange);
  focusEditor();


  /* ================================
        13) 모듈 외부 제공 API
  ================================ */
  return {
    // 텍스트 속성
    setFont, setFontSize, setLineHeight,

    // 색상
    setColor, setBgColor, openAdvancedColor,

    // 효과
    bold, italic, underline,

    // 정렬
    alignLeft, alignCenter, alignRight, alignJustify,

    // 리스트
    ul, ol,

    // 서식 초기화
    clearFormat,

    // Undo/Redo
    undo, redo,

    // 이미지
    insertImage, imageAlign,

    // 커서
    focusEditor
  };

})();


