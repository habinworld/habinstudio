/* ---------------------------------------------------
   ⚙️ editor-core.js — EditorCore vFinal
   Ha-Bin Studio · Data → DOM Core
   역할: 초기 데이터 바인딩 + 편집 명령 실행
   ❌ UI 상태 제어
   ❌ 저장/삭제 판단
---------------------------------------------------- */

window.EditorCore = (function () {

  /* =================================================
        1) 외부 엔진 연결 (전역 의존)
  ================================================= */
  const TextEngine     = window.TextEngine;
  const ImageEngine    = window.ImageEngine;
  const ColorBasic     = window.ColorBasic;
  const ColorAdvanced  = window.ColorAdvanced;
 // ⭐ 현재 입력용 폰트 크기 상태 (엑셀식)
  let currentFontSize = null;
  /* =================================================
        2) DOM 참조 (고정 ID)
  ================================================= */
  const editor = document.getElementById("hb-editor");
  const title  = document.getElementById("hb-title");
/* =================================================
      🔹 커서 이후 입력 처리 (폰트 크기 유지)
================================================= */
editor && editor.addEventListener("input", () => {
  if (!currentFontSize) return;

  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const node = sel.anchorNode;
  if (!node || node.nodeType !== 3) return;

  node.parentNode.style.fontSize = currentFontSize;
});
  /* =================================================
        3) id 기반 초기 로딩 (존재 / 비존재)
        - 판단 없음
        - 분기 없음
        - 페이지 로드 시 1회
  ================================================= */
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));

  const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
  const record = posts.find(p => p.id === id);

  record && (
    title.value = record.title,
    editor.innerHTML = record.content
  );

  /* =================================================
        4) 실행 잠금 (중복 명령 방지)
  ================================================= */
  let isLocked = false;

  /* =================================================
        5) 공용 실행 엔진
        - 판단 없음
        - 명령만 전달
  ================================================= */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;
    const { cmd, value } = cmdObj;

    editor.focus();

    cmd === "fontSizePx" && applyFontSizePx(value);
    cmd === "lineHeight" && applyLineHeight(value);
    cmd !== "fontSizePx" && cmd !== "lineHeight"
      && document.execCommand(cmd, false, value || null);

    isLocked = false;
  }

  /* =================================================
        6) px 기반 폰트 크기
  ================================================= */
function applyFontSizePx(px) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // ① 드래그가 있을 때 → 기존 텍스트 처리
  if (!range.collapsed) {
    const span = document.createElement("span");
    span.style.fontSize = px;

    span.appendChild(range.extractContents());
    range.insertNode(span);

    range.setStartAfter(span);
    range.setEndAfter(span);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // ② 항상 상태 저장 (핵심)
  currentFontSize = px;
}


  /* =================================================
        7) 줄간격
  ================================================= */
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.anchorNode.parentNode;
    node && node.style && (node.style.lineHeight = h);
  }

  /* =================================================
        8) 색상 팝업
  ================================================= */
  function openBasicColor(button, mode) {
    ColorBasic.open(button, mode, color =>
      execute({ cmd: mode === "text" ? "foreColor" : "hiliteColor", value: color })
    );
  }

  function openAdvancedColor(button, mode) {
    ColorAdvanced.open(button, mode, color =>
      execute({ cmd: mode === "text" ? "foreColor" : "hiliteColor", value: color })
    );
  }

  /* =================================================
        9) 이미지
  ================================================= */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  function imageAlign(direction) {
    ImageEngine.align(direction);
  }

  /* =================================================
        10) 포커스 유지
  ================================================= */
  editor.addEventListener("click", () => editor.focus());

  /* =================================================
        11) 외부 공개 API (명령만)
  ================================================= */
  return {
    execute,

    bold:      () => execute(TextEngine.bold()),
    italic:    () => execute(TextEngine.italic()),
    underline: () => execute(TextEngine.underline()),

    setFont:       f  => execute(TextEngine.setFont(f)),
    setSize: px => execute({ cmd: "fontSizePx", value: px }),
    setLineHeight: h => execute({ cmd: "lineHeight", value: h }),

    setColor:   c => execute(TextEngine.setColor(c)),
    setBgColor: c => execute(TextEngine.setBgColor(c)),

    alignLeft:    () => execute(TextEngine.alignLeft()),
    alignCenter:  () => execute(TextEngine.alignCenter()),
    alignRight:   () => execute(TextEngine.alignRight()),
    alignJustify: () => execute(TextEngine.alignJustify()),

    ul: () => execute(TextEngine.ul()),
    ol: () => execute(TextEngine.ol()),

    clear: () => execute(TextEngine.clear()),
    undo:  () => execute(TextEngine.undo()),
    redo:  () => execute(TextEngine.redo()),

    openBasicColor,
    openAdvancedColor,

    insertImage,
    imageAlign
  };

})();


