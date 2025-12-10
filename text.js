/* ---------------------------------------------------
   📝 text.js v8.1 — Pure Text Formatting Engine
   Ha-Bin Studio — Formatting Only (No DOM / No execCommand)
---------------------------------------------------- */

export const TextEngine = (() => {

  /* ===============================
        기본 포맷팅 (논리만 정의)
     — editor-core.js에서 실제 execCommand 실행
  =============================== */

  function bold() {
    return { cmd: "bold" };
  }

  function italic() {
    return { cmd: "italic" };
  }

  function underline() {
    return { cmd: "underline" };
  }

  /* ===============================
        폰트 변경
  =============================== */
  function setFont(fontFamily) {
    return { cmd: "fontName", value: fontFamily };
  }

  /* ===============================
        글자 크기 (px 단위, 엔진은 규칙만 반환)
  =============================== */
  function setSize(px) {
    return { cmd: "fontSizePx", value: px };
  }

  /* ===============================
        줄간격
  =============================== */
  function setLineHeight(h) {
    return { cmd: "lineHeight", value: h };
  }

  /* ===============================
        텍스트 색상
  =============================== */
  function setColor(color) {
    return { cmd: "foreColor", value: color };
  }

  /* ===============================
        배경색
  =============================== */
  function setBgColor(color) {
    return { cmd: "hiliteColor", value: color };
  }

  /* ===============================
        리스트
  =============================== */
  function ul() {
    return { cmd: "insertUnorderedList" };
  }

  function ol() {
    return { cmd: "insertOrderedList" };
  }

  /* ===============================
        문단 정렬
  =============================== */
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

  /* ===============================
        서식 초기화
  =============================== */
  function clear() {
    return { cmd: "removeFormat" };
  }

  /* ===============================
        Undo / Redo
  =============================== */
  function undo() {
    return { cmd: "undo" };
  }

  function redo() {
    return { cmd: "redo" };
  }

  /* ===============================
        외부 인터페이스
  =============================== */
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


