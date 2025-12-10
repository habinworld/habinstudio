/* ------------------------------------------------------
   ✒ text.js v8.0 — Ha-Bin Studio Text Formatting Engine
   (Bold / Italic / Underline / Font / Size / Align / List)
------------------------------------------------------- */

const TextEngine = (() => {

  /* -----------------------------------------
        0) 공통 exec 래퍼
  ------------------------------------------ */
  function exec(cmd, val = null) {
    const editor = document.getElementById("hb-editor");
    editor.focus({ preventScroll: true });
    document.execCommand(cmd, false, val);
  }

  /* -----------------------------------------
        1) 글씨체 변경
  ------------------------------------------ */
  function setFont(fontName) {
    exec("fontName", fontName);
  }

  /* -----------------------------------------
        2) 글자 크기 (px 기반)
        execCommand는 크기를 1~7로 강제하므로
        span 래퍼로 진짜 px 적용
  ------------------------------------------ */
  function setFontSize(px) {
    exec("fontSize", 5); // 임시 span 생성

    let sel = window.getSelection();
    if (!sel.rangeCount) return;

    let range = sel.getRangeAt(0);
    let span = document.createElement("span");
    span.style.fontSize = px + "px";

    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  /* -----------------------------------------
        3) 줄간격
  ------------------------------------------ */
  function setLineHeight(lineHeight) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    node.style.lineHeight = lineHeight;
  }

  /* -----------------------------------------
        4) Bold / Italic / Underline
  ------------------------------------------ */
  function bold() { exec("bold"); }
  function italic() { exec("italic"); }
  function underline() { exec("underline"); }

  /* -----------------------------------------
        5) 정렬
  ------------------------------------------ */
  function alignLeft()   { exec("justifyLeft"); }
  function alignCenter() { exec("justifyCenter"); }
  function alignRight()  { exec("justifyRight"); }
  function alignJustify(){ exec("justifyFull"); }

  /* -----------------------------------------
        6) 리스트
  ------------------------------------------ */
  function ul() { exec("insertUnorderedList"); }
  function ol() { exec("insertOrderedList"); }

  /* -----------------------------------------
        7) 서식 초기화
  ------------------------------------------ */
  function clearFormat() {
    exec("removeFormat");

    const editor = document.getElementById("hb-editor");
    const spans = editor.querySelectorAll("span, font");
    spans.forEach(s => s.removeAttribute("style"));
  }

  /* -----------------------------------------
        외부 공개 (툴바 → TextEngine)
  ------------------------------------------ */
  return {
    setFont,
    setFontSize,
    setLineHeight,

    bold,
    italic,
    underline,

    alignLeft,
    alignCenter,
    alignRight,
    alignJustify,

    ul,
    ol,

    clearFormat
  };

})();

