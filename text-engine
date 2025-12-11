/* ---------------------------------------------------
   ✒️ text-engine.js — FINAL STABLE EDITION
   Ha-Bin Studio · window.TextEngine 등록
   (No export / No import / Pure Command Engine)
---------------------------------------------------- */

window.TextEngine = (function () {

  /* -----------------------------------------
        글자 스타일
  ----------------------------------------- */
  function bold() {
    return { cmd: "bold" };
  }

  function italic() {
    return { cmd: "italic" };
  }

  function underline() {
    return { cmd: "underline" };
  }

  /* -----------------------------------------
        폰트
  ----------------------------------------- */
  function setFont(family) {
    return { cmd: "fontName", value: family };
  }

  /* -----------------------------------------
        글씨 크기 (px)
  ----------------------------------------- */
  function setSize(px) {
    return { cmd: "fontSizePx", value: px };
  }

  /* -----------------------------------------
        줄간격
  ----------------------------------------- */
  function setLineHeight(h) {
    return { cmd: "lineHeight", value: h };
  }

  /* -----------------------------------------
        텍스트 색상
  ----------------------------------------- */
  function setColor(color) {
    return { cmd: "foreColor", value: color };
  }

  /* -----------------------------------------
        배경 색상
  ----------------------------------------- */
  function setBgColor(color) {
    return { cmd: "hiliteColor", value: color };
  }

  /* -----------------------------------------
        리스트
  ----------------------------------------- */
  function ul() {
    return { cmd: "insertUnorderedList" };
  }

  function ol() {
    return { cmd: "insertOrderedList" };
  }

  /* -----------------------------------------
        정렬
  ----------------------------------------- */
  function alignLeft() {
    return { cmd: "justifyLeft" };
  }

  function alignCenter() {
    return { cmd: "justifyCenter" };
  }

  function alignRight() {
    return { cmd: "justifyRight" };
  }

  function alignJustify() {
    return { cmd: "justifyFull" };
  }

  /* -----------------------------------------
        서식 초기화
  ----------------------------------------- */
  function clear() {
    return { cmd: "removeFormat" };
  }

  /* -----------------------------------------
        되돌리기 / 다시하기
  ----------------------------------------- */
  function undo() {
    return { cmd: "undo" };
  }

  function redo() {
    return { cmd: "redo" };
  }


  /* -----------------------------------------
        외부로 내보내는 API
  ----------------------------------------- */
  return {
    bold,
    italic,
    underline,

    setFont,
    setSize,
    setLineHeight,

    setColor,
    setBgColor,

    ul,
    ol,

    alignLeft,
    alignCenter,
    alignRight,
    alignJustify,

    clear,
    undo,
    redo
  };

})();

