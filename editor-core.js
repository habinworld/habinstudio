/* ---------------------------------------------------
   ⚙️ editor-core.js v7.0 — FULL ENGINE
   Ha-Bin Studio — (Text / Color / Image / Format)
---------------------------------------------------- */

const EditorCore = (() => {

  const editor = document.getElementById("editor");
  let lock = false;  // 충돌 방지용

  /* ===============================
        0) 커서 보존
  ================================ */
  function focusEditor() {
    editor.focus({ preventScroll: false });
  }

  /* ===============================
        1) execCommand 래퍼 (전체 명령)
  ================================ */
  function command(cmd, val = null) {
    if (lock) return;
    lock = true;

    focusEditor();
    document.execCommand(cmd, false, val);

    lock = false;
  }

  /* ===============================
        2) 글씨체
  ================================ */
  function setFont(font) {
    command("fontName", font);
  }

  /* ===============================
        3) 글자 크기 (px 기반)
  ================================ */
  function setFontSize(size) {
    command("fontSize", 5);  // execCommand는 1~7 고정

    // px 적용
    let sel = window.getSelection();
    if (!sel.rangeCount) return;

    let range = sel.getRangeAt(0);
    let span = document.createElement("span");
    span.style.fontSize = size + "px";
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  /* ===============================
        4) 줄간격
  ================================ */
  function setLineHeight(h) {
    let sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    node.style.lineHeight = h;
  }

  /* ===============================
        5) 색상 (기본)
  ================================ */
  function setColor(color) {
    command("foreColor", color);
  }

  /* ===============================
        6) 배경색 (기본)
  ================================ */
  function setBgColor(color) {
    command("hiliteColor", color);
  }

  /* ===============================
        7) 고급 색상 연결
  ================================ */
  function openAdvanced(textOrBg, button) {
    AdvancedColor.openPopup(button, textOrBg);
  }

  /* ===============================
        8) Bold / Italic / Underline
  ================================ */
  function bold() { command("bold"); }
  function italic() { command("italic"); }
  function underline() { command("underline"); }

  /* ===============================
        9) 문단 정렬
  ================================ */
  function alignLeft() { command("justifyLeft"); }
  function alignCenter() { command("justifyCenter"); }
  function alignRight() { command("justifyRight"); }
  function alignJustify() { command("justifyFull"); }

  /* ===============================
        10) 이미지 삽입
  ================================ */
  function insertImage(file) {
    ImageEngine.insertImage(file);
  }

  /* ===============================
        11) 이미지 정렬
  ================================ */
  function imageAlign(dir) {
    ImageEngine.align(dir);
  }

  /* ===============================
        12) 리스트
  ================================ */
  function ul() { command("insertUnorderedList"); }
  function ol() { command("insertOrderedList"); }

  /* ===============================
        13) 서식 초기화
  ================================ */
  function clear() {
    command("removeFormat");

    // 추가 초기화
    let spans = editor.querySelectorAll("span, font");
    spans.forEach(el => {
      el.style = "";
    });
  }

  /* ===============================
        14) Undo / Redo
  ================================ */
  function undo() { command("undo"); }
  function redo() { command("redo"); }

  /* ===============================
        15) 편집기 포커스 유지
  ================================ */
  editor.addEventListener("click", () => focusEditor());

  /* ===============================
        16) 팝업 자동 닫기
  ================================ */
  document.addEventListener("click", e => {
    if (!e.target.closest(".hb-color-popup") &&
        !e.target.closest(".hb-advanced-color") &&
        !e.target.closest("#hb-color") &&
        !e.target.closest("#hb-bgcolor")) {

      if (ColorEngine) ColorEngine.closePopup?.();
      if (AdvancedColor) AdvancedColor.closePopup?.();
    }
  });

  /* ===============================
        17) Mobile long-press 방지
  ================================ */
  editor.addEventListener("touchstart", e => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  /* ===============================
        18) 초기 포커스
  ================================ */
  focusEditor();

  /* ===============================
        19) 외부 인터페이스
  ================================ */
  return {
    // 텍스트
    setFont, setFontSize, setLineHeight,
    setColor, setBgColor, openAdvanced,

    // 글자 효과
    bold, italic, underline,

    // 정렬
    alignLeft, alignCenter, alignRight, alignJustify,

    // 이미지
    insertImage, imageAlign,

    // 리스트
    ul, ol,

    // 서식 초기화
    clear,

    undo, redo,
    focusEditor
  };

})();


