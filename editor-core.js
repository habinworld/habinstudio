/* ---------------------------------------------------
   ⚙️ editor-core.js — EditorCore vFinal 안정판
   Ha-Bin Studio · window.EditorCore 등록
---------------------------------------------------- */

window.EditorCore = (function () {

  // -------------------------------------------------
  // 연결할 엔진들 (모두 window 전역)
  // -------------------------------------------------
  const TextEngine = window.TextEngine;
  const ImageEngine = window.ImageEngine;
  const StorageEngine = window.StorageEngine;
  const ColorBasic = window.ColorBasic;
  const ColorAdvanced = window.ColorAdvanced;

  // 본문 에디터
  const editor = document.getElementById("hb-editor");

  // 중복 실행 방지
  let isLocked = false;


  /* -------------------------------------------------
        공용 실행 엔진 (execCommand wrapper)
  -------------------------------------------------- */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;
    const { cmd, value } = cmdObj;

    editor.focus();

    // 폰트 사이즈(px) 직접 처리
    if (cmd === "fontSizePx") {
      applyFontSizePx(value);
    }
    // 줄간격 직접 처리
    else if (cmd === "lineHeight") {
      applyLineHeight(value);
    }
    // 그 외 execCommand
    else {
      document.execCommand(cmd, false, value || null);
    }

    isLocked = false;
  }


  /* -------------------------------------------------
        px 기반 폰트사이즈 적용
  -------------------------------------------------- */
  function applyFontSizePx(px) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    const span = document.createElement("span");
    span.style.fontSize = px + "px";

    span.appendChild(range.extractContents());
    range.insertNode(span);

    // 커서 span 끝에 위치시키기
    range.setStartAfter(span);
    range.setEndAfter(span);
    sel.removeAllRanges();
    sel.addRange(range);
  }


  /* -------------------------------------------------
        줄간격 적용
  -------------------------------------------------- */
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    if (node && node.style) {
      node.style.lineHeight = h;
    }
  }


  /* -------------------------------------------------
        기본 색상 팝업 호출
  -------------------------------------------------- */
  function openBasicColor(button, mode) {
    ColorBasic.open(button, mode, function (color) {

      const cmd = (mode === "text") ? "foreColor" : "hiliteColor";
      execute({ cmd, value: color });

    });
  }


  /* -------------------------------------------------
        고급 색상 팝업 호출
  -------------------------------------------------- */
  function openAdvancedColor(button, mode) {
    ColorAdvanced.open(button, mode, function (color) {

      const cmd = (mode === "text") ? "foreColor" : "hiliteColor";
      execute({ cmd, value: color });

    });
  }


  /* -------------------------------------------------
        이미지 삽입 / 정렬
  -------------------------------------------------- */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  function imageAlign(direction) {
    ImageEngine.align(direction);
  }


  /* -------------------------------------------------
        저장 / 불러오기
  -------------------------------------------------- */
  function save(key) {
    StorageEngine.save(key, editor.innerHTML);
  }

  function load(key) {
    const data = StorageEngine.load(key);
    if (data) editor.innerHTML = data;
  }


  /* -------------------------------------------------
        클릭 → 포커스 유지
  -------------------------------------------------- */
  editor.addEventListener("click", () => editor.focus());


  /* -------------------------------------------------
        외부에 제공할 API
  -------------------------------------------------- */
  return {
    execute,

    // 텍스트 엔진 연결
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


