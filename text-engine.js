/* ==========================================================
   ✒️ text-engine.js — Ha-Bin Studio TextEngine vFinal
   Pure Command Object Engine (No DOM, No execCommand)
   window.TextEngine 로 전역 등록
========================================================== */

window.TextEngine = (function () {

  /* -----------------------------------------------
        1) 기본 포맷팅
  ------------------------------------------------ */
  function bold() {
    return { cmd: "bold" };
  }

  function italic() {
    return { cmd: "italic" };
  }

  function underline() {
    return { cmd: "underline" };
  }

  /* -----------------------------------------------
        2) 폰트 변경
  ------------------------------------------------ */
  function setFont(fontName) {
    return { cmd: "fontName", value: fontName };
  }

  /* -----------------------------------------------
        3) 글자 크기(px)
  ------------------------------------------------ */
  function setSize(px) {
    return { cmd: "fontSizePx", value: px };
  }

  /* -----------------------------------------------
        4) 줄간격(line-height)
  ------------------------------------------------ */
  function setLineHeight(h) {
    return { cmd: "lineHeight", value: h };
  }

  /* -----------------------------------------------
        5) 텍스트 색상 / 배경색
  ------------------------------------------------ */
  function setColor(color) {
    return { cmd: "foreColor", value: color };
  }

  function setBgColor(color) {
    return { cmd: "hiliteColor", value: color };
  }

  /* -----------------------------------------------
        6) 리스트
  ------------------------------------------------ */
  function ul() {
    return { cmd: "insertUnorderedList" };
  }

  function ol() {
    return { cmd: "insertOrderedList" };
  }

  /* -----------------------------------------------
        7) 정렬
  ------------------------------------------------ */
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

  /* -----------------------------------------------
        8) 서식 초기화
  ------------------------------------------------ */
  function clear() {
    return { cmd: "removeFormat" };
  }

  /* -----------------------------------------------
        9) Undo / Redo
  ------------------------------------------------ */
  function undo() {
    return { cmd: "undo" };
  }

  function redo() {
    return { cmd: "redo" };
  }

  /* -----------------------------------------------
        📌 외부 API (EditorCore가 이것만 사용)
  ------------------------------------------------ */
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



