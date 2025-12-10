/* ---------------------------------------------------
   ⚙️ editor-core.js v8.0 (Refactored)
   Ha-Bin Studio — Central Execution Engine
   - text.js v8.1 명령 실행기
   - color-basic.js / advanced-color.js 연결
   - image.js v8.0 연결
   - storage.js v8.0 연결
---------------------------------------------------- */

import { TextEngine } from "./text.js";
import { ImageEngine } from "./image.js";
import { Storage } from "./storage.js";

const EditorCore = (() => {

  const editor = document.getElementById("editor");
  let isLocked = false;

  /* ===============================
        공용: execCommand 실행기
  =============================== */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;

    const { cmd, value } = cmdObj;

    // execCommand 직접 처리
    if (cmd === "fontSizePx") {
      applyFontSizePx(value);
    } else if (cmd === "lineHeight") {
      applyLineHeight(value);
    } else {
      editor.focus();
      document.execCommand(cmd, false, value || null);
    }

    isLocked = false;
  }

  /* ===============================
        px 기반 폰트사이즈
  =============================== */
  function applyFontSizePx(px) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = px + "px";

    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  /* ===============================
        줄간격 적용
  =============================== */
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    if (node) node.style.lineHeight = h;
  }

  /* ===============================
        색상 팝업 — basic color
  =============================== */
  function openBasicColor(button, mode) {
    ColorBasic.open(button, mode, (color) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd: cmd, value: color });
    });
  }

  /* ===============================
        색상 팝업 — advanced
  =============================== */
  function openAdvancedColor(button, mode) {
    AdvancedColor.open(button, mode, (rgba) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd: cmd, value: rgba });
    });
  }

  /* ===============================
        이미지 삽입
  =============================== */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  /* ===============================
        이미지 정렬
  =============================== */
  function imageAlign(dir) {
    ImageEngine.align(dir);
  }

  /* ===============================
        저장 / 불러오기
  =============================== */
  function save(key) {
    Storage.save(key, editor.innerHTML);
  }

  function load(key) {
    const data = Storage.load(key);
    if (data) editor.innerHTML = data;
  }

  /* ===============================
        편집기 포커스 유지
  =============================== */
  editor.addEventListener("click", () => editor.focus());

  /* ===============================
        외부 공개 API
  =============================== */
  return {
    execute,

    // 텍스트 형식
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

    // 색상
    openBasicColor,
    openAdvancedColor,

    // 이미지
    insertImage,
    imageAlign,

    // 저장
    save,
    load
  };

})();


