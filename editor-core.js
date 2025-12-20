/* ---------------------------------------------------
   ⚙️ editor-core.js — EditorCore vFinal (Checked / Excel-Style Split)
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

  /* =================================================
        2) DOM 참조 (고정 ID)
        - ⚠️ 반드시 먼저 잡아야 아래 함수들에서 사용 가능
  ================================================= */
  const editor = document.getElementById("hb-editor");
  const title  = document.getElementById("hb-title");

  // DOM이 없으면 조용히 종료 (헌법 예외: DOM 안전장치)
  if (!editor || !title) {
    return {
      execute: () => {}
    };
  }

  /* =================================================
        2-1) Font Size Mode (Excel-style Split)
        - selection : 드래그 영역 적용
        - cursor    : 커서 이후 입력 적용
  ================================================= */
  let FONT_SIZE_MODE = "selection"; // "selection" | "cursor"

  /* =================================================
        2-2) Selection Cache (Excel-style)
        - 드롭다운(select) 클릭으로 selection이 사라지는 문제 해결
  ================================================= */
  let savedRange = null;

  function saveSelection() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const r = sel.getRangeAt(0);
    // editor 내부 selection만 저장
    if (editor.contains(r.commonAncestorContainer)) {
      savedRange = r.cloneRange();
    }
  }

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
// 🔒 첫 줄 안정화 (contenteditable 버그 방지)
if (editor.innerHTML.trim() === "" || editor.innerHTML === "<br>") {
  editor.innerHTML = "<p><br></p>";
}
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

    if (cmd === "fontSizePx") {
  const sel = window.getSelection();
  const hasSelection =
    sel && sel.rangeCount && !sel.getRangeAt(0).collapsed;

  // 🚀 드래그면 즉시 (초고속)
  if (hasSelection) {
    applyFontSizePx(value);
  }
  // 🛡️ 커서면 안정 경로
  else {
    setTimeout(() => applyFontSizePx(value), 0);
  }
}
    else if (cmd === "lineHeight") applyLineHeight(value);
    else document.execCommand(cmd, false, value || null);

    isLocked = false;
  }
// =================================================
// Typing Style Engine (커서 이후 입력 고정 장치)
// =================================================
let typingFontSizePx = null;

function getTypingSpan() {
  return editor.querySelector("span[data-hb-typing='1']");
}

function removeTypingSpanIfEmpty() {
  const t = getTypingSpan();
  if (!t) return;
  const txt = (t.textContent || "").replace(/\u200B/g, "");
  if (txt.trim() === "") t.remove();
}

function ensureCaretInside(node, offset = 0) {
  const sel = window.getSelection();
  if (!sel) return;
  const r = document.createRange();
  r.setStart(node, offset);
  r.collapse(true);
  sel.removeAllRanges();
  sel.addRange(r);
}

function applyTypingFontSize(px) {
  typingFontSizePx = Number(px);
  editor.focus();

  removeTypingSpanIfEmpty();

  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  const container = range.commonAncestorContainer.nodeType === 3
    ? range.commonAncestorContainer.parentNode
    : range.commonAncestorContainer;

  if (!editor.contains(container)) return;

  const current = container.closest && container.closest("span[data-hb-typing='1']");
  if (current) {
    current.style.fontSize = typingFontSizePx + "px";
    return;
  }

  const span = document.createElement("span");
  span.setAttribute("data-hb-typing", "1");
  span.style.fontSize = typingFontSizePx + "px";

  const z = document.createTextNode("\u200B");
  span.appendChild(z);
  range.insertNode(span);

  ensureCaretInside(z, 1);
}

  /* =================================================
        6) px 기반 폰트 크기 (Excel-Style Split)
        - A: 선택(드래그) 적용
        - B: 커서 이후 적용
        - 분기는 오직 applyFontSizePx에서 1회
  ================================================= */
function applyFontSizeToSelection(px) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  if (range.collapsed) return;

  if (!editor.contains(range.commonAncestorContainer)) return;

  const span = document.createElement("span");
  span.style.fontSize = Number(px) + "px";

  span.appendChild(range.extractContents());
  range.insertNode(span);

  range.setStartAfter(span);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
function applyFontSizePx(px) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // ✅ 드래그가 있으면 → 드래그 적용
  if (!range.collapsed) {
    removeTypingSpanIfEmpty();
    applyFontSizeToSelection(px);
    return;
  }

  // ✅ 커서만 있으면 → typing span (STEP 1에서 만든 엔진)
  applyTypingFontSize(px);
}


  /* =================================================
        7) 줄간격
  ================================================= */
  function applyLineHeight(h) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const node = sel.anchorNode && sel.anchorNode.parentNode;
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
        10) 포커스 유지 + Selection Cache 이벤트
        - ✅ 여기 3줄이 "연속 변경"을 살린다
  ================================================= */
  editor.addEventListener("click", () => editor.focus());

  // ✅ 선택 저장 (드래그/키입력/터치)
  editor.addEventListener("mouseup", saveSelection);
  editor.addEventListener("keyup", saveSelection);
  editor.addEventListener("touchend", saveSelection);

  /* =================================================
        11) 외부 공개 API (명령만)
        - 기존 toolbar.js 호출과 100% 호환 유지
  ================================================= */
  return {
    execute,

    // 텍스트 스타일
    bold:      () => execute(TextEngine.bold()),
    italic:    () => execute(TextEngine.italic()),
    underline: () => execute(TextEngine.underline()),

    // 폰트/크기/줄간격
    setFont:       f  => execute(TextEngine.setFont(f)),
    setSize:       px => execute({ cmd: "fontSizePx", value: px }),
    setLineHeight: h  => execute({ cmd: "lineHeight", value: h }),

    // 색상
    setColor:   c => execute(TextEngine.setColor(c)),
    setBgColor: c => execute(TextEngine.setBgColor(c)),

    // 정렬
    alignLeft:    () => execute(TextEngine.alignLeft()),
    alignCenter:  () => execute(TextEngine.alignCenter()),
    alignRight:   () => execute(TextEngine.alignRight()),
    alignJustify: () => execute(TextEngine.alignJustify()),

    // 리스트
    ul: () => execute(TextEngine.ul()),
    ol: () => execute(TextEngine.ol()),

    // 기타
    clear: () => execute(TextEngine.clear()),
    undo:  () => execute(TextEngine.undo()),
    redo:  () => execute(TextEngine.redo()),

    // 팝업
    openBasicColor,
    openAdvancedColor,

    // 이미지
    insertImage,
    imageAlign,

    // (옵션) 폰트크기 모드 제어용 API — UI에서 쓰고 싶으면 사용
    setFontSizeMode: mode => {
      if (mode === "selection" || mode === "cursor") FONT_SIZE_MODE = mode;
    },
    getFontSizeMode: () => FONT_SIZE_MODE
  };

})();


