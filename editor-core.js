/* ---------------------------------------------------
   ⚙️ editor-core.js — 중앙 실행 엔진
   Ha-Bin Studio · window.EditorCore 등록
---------------------------------------------------- */

(function () {

  const editor = document.getElementById("hb-editor");
  if (!editor) return;

  const TextEngine     = window.TextEngine;
  const ImageEngine    = window.ImageEngine;
  const ColorBasic     = window.ColorBasic;
  const AdvancedColor  = window.AdvancedColor;
  const StorageEngine  = window.StorageEngine;

  let isLocked = false;

  // 공용 실행 함수
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;
    isLocked = true;

    const { cmd, value } = cmdObj;

    editor.focus();

    if (cmd === "fontSizePx") {
      applyFontSizePx(value);
    } else if (cmd === "lineHeight") {
      applyLineHeight(value);
    } else {
      document.execCommand(cmd, false, value || null);
    }

    isLocked = false;
  }

  // px 단위 글자 크기
  function applyFontSizePx(px) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = px + "px";
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  // 줄간격
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const node = sel.anchorNode && sel.anchorNode.parentNode;
    if (node && node.style) {
      node.style.lineHeight = h;
    }
  }

  // 색상 — 기본
  function openBasicColor(button, mode) {
    if (!ColorBasic) return;
    ColorBasic.open(button, mode, (color) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd, value: color });
    });
  }

  // 색상 — 고급
  function openAdvancedColor(button, mode) {
    if (!AdvancedColor) return;
    AdvancedColor.open(button, mode, (rgba) => {
      const cmd = mode === "text" ? "foreColor" : "hiliteColor";
      execute({ cmd, value: rgba });
    });
  }

  // 이미지 삽입 / 정렬
  function insertImage(file) {
    if (!ImageEngine) return;
    ImageEngine.insert(file);
  }

  function imageAlign(dir) {
    if (!ImageEngine) return;
    ImageEngine.align(dir);
  }

  // 저장 / 불러오기 (필요하면 나중에 구현)
  function save(key) {
    if (!StorageEngine) return;
    StorageEngine.save(key, {
      title: document.getElementById("hb-title")?.value || "",
      content: editor.innerHTML,
      notice: document.getElementById("hb-notice")?.checked || false
    });
  }

  function load(key) {
    if (!StorageEngine) return;
    const data = StorageEngine.load(key);
    if (!data) return;
    document.getElementById("hb-title").value = data.title || "";
    editor.innerHTML = data.content || "";
    document.getElementById("hb-notice").checked = !!data.notice;
  }

  // 에디터 클릭 시 포커스 유지
  editor.addEventListener("click", () => editor.focus());

  // 전역 등록
  window.EditorCore = {
    execute,

    bold:        () => execute(TextEngine.bold()),
    italic:      () => execute(TextEngine.italic()),
    underline:   () => execute(TextEngine.underline()),

    setFont:     (f)   => execute(TextEngine.setFont(f)),
    setSize:     (px)  => execute(TextEngine.setSize(px)),
    setLineHeight:(h)  => execute(TextEngine.setLineHeight(h)),

    setColor:    (c)   => execute(TextEngine.setColor(c)),
    setBgColor:  (c)   => execute(TextEngine.setBgColor(c)),

    alignLeft:   ()    => execute(TextEngine.alignLeft()),
    alignCenter: ()    => execute(TextEngine.alignCenter()),
    alignRight:  ()    => execute(TextEngine.alignRight()),
    alignJustify:()    => execute(TextEngine.alignJustify()),

    ul:          ()    => execute(TextEngine.ul()),
    ol:          ()    => execute(TextEngine.ol()),

    clear:       ()    => execute(TextEngine.clear()),

    undo:        ()    => execute(TextEngine.undo()),
    redo:        ()    => execute(TextEngine.redo()),

    openBasicColor,
    openAdvancedColor,

    insertImage,
    imageAlign,

    save,
    load
  };

})();


