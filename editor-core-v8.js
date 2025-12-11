/* ---------------------------------------------------
   ⚙️ editor-core.js v8.1 (Browser-Stable)
   Ha-Bin Studio — Central Execution Engine
---------------------------------------------------- */

// 전역 객체로부터 가져오기 (import 사용 금지)
const TextEngine = window.TextEngine;
const ImageEngine = window.ImageEngine;
const Storage = window.Storage;
const ColorBasic = window.ColorBasic;
const AdvancedColor = window.AdvancedColor;

// HTML 에디터 ID 수정 (hb-editor)
const editor = document.getElementById("hb-editor");

const EditorCore = (() => {

  let isLocked = false;

  /* -----------------------------
        공용 execCommand 엔진
  ----------------------------- */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;

    const { cmd, value } = cmdObj;

    editor.focus();

    if (cmd === "fontSizePx") {
      applyFontSizePx(value);
    } 
    else if (cmd === "lineHeight") {
      applyLineHeight(value);
    }
    else {
      document.execCommand(cmd, false, value || null);
    }

    isLocked = false;
  }

  /* -----------------------------
        px 기반 폰트사이즈
  ----------------------------- */
  function applyFontSizePx(px) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = px + "px";
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  /* -----------------------------
        줄간격
  ----------------------------- */
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    if (node) node.style.lineHeight = h;
  }

  /* -----------------------------
        색상 — 기본
  ----------------------------- */
  function openBasicColor(button, mode) {
    ColorBasic.open(button, mode, (color) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd, value: color });
    });
  }

  /* -----------------------------
        색상 — 고급(RGBA)
  ----------------------------- */
  function openAdvancedColor(button, mode) {
    AdvancedColor.open(button, mode, (rgba) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd, value: rgba });
    });
  }

  /* -----------------------------
        이미지 삽입/정렬
  ----------------------------- */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  function imageAlign(dir) {
    ImageEngine.align(dir);
  }

  /* -----------------------------
        저장/로드
  ----------------------------- */
  function save(key) {
    Storage.save(key, editor.innerHTML);
  }

  function load(key) {
    const data = Storage.load(key);
    if (data) editor.innerHTML = data;
  }

  /* -----------------------------
        포커스 유지
  ----------------------------- */
  editor.addEventListener("click", () => editor.focus());

  /* -----------------------------
        외부 API
  ----------------------------- */
  return {
    execute,

    bold: () => execute(TextEngine.bold()),
    italic: () => execute(TextEngine.italic()),
    underline: () => execute(TextEngine.underline()),

    setFont: (f) => execute(TextEngine.setFont(f)),
    setSize: (px) => execute(TextEngine.setSize(px)),
    setLineHeight: (h) => execute(TextEngine.setLineHeight(h)),

    setColor: (c) => execute(TextEngine.setColor(c)),
    setBgColor: (c) => execute(TextEngine.setBgColor(c)),

    alignLeft: () => execute(TextEngine.alignLeft()),
    alignCenter: () => execute(TextEngine.alignCenter()),
    alignRight: () => execute(TextEngine.alignRight()),
    alignJustify: () => execute(TextEngine.alignJustify()),

    ul: () => execute(TextEngine.ul()),
    ol: () => execute(TextEngine.ol()),

    clear: () => execute(TextEngine.clear()),

    undo: () => execute(TextEngine.undo()),
    redo: () => execute(TextEngine.redo()),

    openBasicColor,
    openAdvancedColor,

    insertImage,
    imageAlign,

    save,
    load
  };

})();

// 💡 툴바와 전역 연결
window.EditorCore = EditorCore;

