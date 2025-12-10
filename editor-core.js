/* ---------------------------------------------------------
   EditorCore v7.0 — 기능 실행 엔진 (Absolute Stable)
   - execCommand 기반 + Range 기반 보완
   - toolbar.js → EditorCore.exec() 호출 구조
   - 모든 기능의 실제 실행 책임
---------------------------------------------------------- */

const EditorCore = (() => {

  const editor = () => document.getElementById("hb-editor");

  /* ---------------------------------------------------------
     1. 공통 실행 함수 (굵게/기울임/정렬/목록 등)
     execCommand를 래핑한 안정 버전
  ---------------------------------------------------------- */
  function exec(command, value = null) {
    if (!editor()) return;

    editor().focus();
    document.execCommand(command, false, value);
  }

  /* ---------------------------------------------------------
     2. 글자색 / 배경색 (ColorV7에서 호출)
  ---------------------------------------------------------- */
  function applyColor(color) {
    if (!editor()) return;
    editor().focus();
    document.execCommand("foreColor", false, color);
  }

  function applyBgColor(color) {
    if (!editor()) return;
    editor().focus();
    document.execCommand("hiliteColor", false, color);
  }

  /* ---------------------------------------------------------
     3. 글씨체 변경
  ---------------------------------------------------------- */
  function applyFont(fontName) {
    editor().focus();
    document.execCommand("fontName", false, fontName);
  }

  /* ---------------------------------------------------------
     4. 글자 크기 변경
        execCommand('fontSize')는 1~7 사이여서
        커스텀 크기 지원을 위해 span 래핑 방식.
  ---------------------------------------------------------- */
  function applyFontSize(px) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return; // 선택 없음

    const span = document.createElement("span");
    span.style.fontSize = px;
    range.surroundContents(span);
  }

  /* ---------------------------------------------------------
     5. 서식 초기화(clearFormat)
     - span/style 제거
     - strong/em/u 등 태그 제거
     - 단, 줄바꿈 유지
  ---------------------------------------------------------- */
  function clearFormat() {
    let html = editor().innerHTML;

    // inline 태그 제거
    html = html.replace(/<(b|strong|i|em|u|span)[^>]*>/gi, "");
    html = html.replace(/<\/(b|strong|i|em|u|span)>/gi, "");

    editor().innerHTML = html;
  }

  /* ---------------------------------------------------------
     6. Undo / Redo
  ---------------------------------------------------------- */
  function undo() {
    editor().focus();
    document.execCommand("undo");
  }

  function redo() {
    editor().focus();
    document.execCommand("redo");
  }

  /* ---------------------------------------------------------
     7. Range 얻기 (고급 기능용)
  ---------------------------------------------------------- */
  function getRange() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    return sel.getRangeAt(0);
  }


  /* ---------------------------------------------------------
     외부 노출 API
  ---------------------------------------------------------- */
  return {
    exec,
    applyColor,
    applyBgColor,
    applyFont,
    applyFontSize,
    clearFormat,
    undo,
    redo,
    getRange
  };

})();

