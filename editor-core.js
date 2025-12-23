/* ---------------------------------------------------
   ⚙️ editor-core.js — EditorCore vFinal (Excel-Style / No State)
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
  ================================================= */
  const editor = document.getElementById("hb-editor");
  const title  = document.getElementById("hb-title");

  // DOM이 없으면 조용히 종료 (헌법 예외: DOM 안전장치)
  if (!editor || !title) {
    return { execute: () => {} };
  }

  /* =================================================
        3) id 기반 초기 로딩 (존재 / 비존재)
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

  // 🔒 빈 편집기 첫줄 안정화 (contenteditable 초기 버그 완화)
  if (editor.innerHTML.trim() === "" || editor.innerHTML === "<br>") {
    editor.innerHTML = "<p><br></p>";
  }

  /* =================================================
        4) 실행 잠금 (중복 명령 방지)
  ================================================= */
  let isLocked = false;

  /* =================================================
        5) Typing Style Engine (커서 이후 입력 고정 장치)
        - 상태 저장/복원 ❌
        - "존재/비존재"로만 처리
  ================================================= */
  function getTypingSpan() {
    return editor.querySelector("span[data-hb-typing='1']");
  }

  function removeTypingSpanIfEmpty() {
    const t = getTypingSpan();
    if (!t) return;

    // ZWSP 제거 후 내용이 없으면 제거
    const txt = (t.textContent || "").replace(/\u200B/g, "").trim();
    if (txt === "") t.remove();
  }

  function ensureCaretInsideTextNode(textNode, offset) {
    const sel = window.getSelection();
    if (!sel) return;
    const r = document.createRange();
    r.setStart(textNode, offset);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  }

  function applyTypingFontSize(px) {
    // ⚡ focus는 조건부 (속도)
    if (document.activeElement !== editor) editor.focus();

    removeTypingSpanIfEmpty();

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);

    // editor 내부만 허용
    const container = range.commonAncestorContainer.nodeType === 3
      ? range.commonAncestorContainer.parentNode
      : range.commonAncestorContainer;

    if (!editor.contains(container)) return;

    // 이미 typing span 안이면 스타일만 갱신
    const current = container.closest && container.closest("span[data-hb-typing='1']");
    if (current) {
      current.style.fontSize = Number(px) + "px";
      return;
    }

    // 새 typing span 생성 (ZWSP 1개)
    const span = document.createElement("span");
    span.setAttribute("data-hb-typing", "1");
    span.style.fontSize = Number(px) + "px";

    const z = document.createTextNode("\u200B");
    span.appendChild(z);

    range.insertNode(span);
    ensureCaretInsideTextNode(z, 1);
  }

  /* =================================================
        6) px 기반 폰트 크기
        - 드래그: 선택영역 래핑
        - 커서: typing span 삽입
        - 분기: "선택이 존재하는가" 1회
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

    // ✅ 드래그(선택) 존재 → 드래그 적용
    if (!range.collapsed) {
      removeTypingSpanIfEmpty();
      applyFontSizeToSelection(px);
      return;
    }

    // ✅ 커서만 존재 → 커서 이후 적용
    applyTypingFontSize(px);
  }

  /* =================================================
        7) 줄간격
  ================================================= */
 function applyLineHeight(h) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // 적용 액션 (존재 / 비존재)
  const ACTIONS = {
    true:  el => el.style.removeProperty("line-height"),
    false: el => el.style.setProperty("line-height", h)
  };
  const act = ACTIONS[h === null];

  // 드래그 선택 영역 → 여러 블록
  if (!range.collapsed) {
    const blocks = new Set();

    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (
            (node.tagName === "P" ||
             node.tagName === "DIV" ||
             node.tagName === "LI") &&
            range.intersectsNode(node)
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      blocks.add(node);
    }

    blocks.forEach(act);
    return;
  }

  // 커서만 있는 경우 → 단일 블록
  let node = sel.anchorNode;
  while (node && node !== editor) {
    if (
      node.nodeType === 1 &&
      (node.tagName === "P" ||
       node.tagName === "DIV" ||
       node.tagName === "LI")
    ) {
      act(node);
      return;
    }
    node = node.parentNode;
  }
}

  /* =================================================
        8) 공용 실행 엔진 (Excel-Style)
        - "존재/비존재" 기반
        - fontSizePx만 빠른경로/안정경로 분리
  ================================================= */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;
    const { cmd, value } = cmdObj;

    // ⚡ focus는 조건부 (속도)
    if (document.activeElement !== editor) editor.focus();

    if (cmd === "fontSizePx") {
      const sel = window.getSelection();
      const hasSelection = !!(sel && sel.rangeCount && !sel.getRangeAt(0).collapsed);

      // 🚀 드래그면 즉시 (초고속)
      if (hasSelection) {
        applyFontSizePx(value);
      }
      // 🛡️ 커서면 다음 tick (select 포커스/selection 타이밍 안정화)
      else {
        setTimeout(() => applyFontSizePx(value), 0);
      }
    }
    else if (cmd === "lineHeight") {
      applyLineHeight(value);
    }
    else if (cmd === "textColor") {
  applyColor(value, "text");
}
else if (cmd === "bgColor") {
  applyBgColor(value);
}   
    else {
      document.execCommand(cmd, false, value || null);
    }

    isLocked = false;
  }
/* =================================================
   9) 글자색 — Excel Style (Block Only)
   - 드래그 필수
   - 커서 유지 ❌
================================================= */

function applyTextColor(range, color) {
  const blocks = new Set();

  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (
          (node.tagName === "P" ||
           node.tagName === "DIV" ||
           node.tagName === "LI") &&
          range.intersectsNode(node)
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    blocks.add(node);
  }

  blocks.forEach(block => {
    block.style.color = color;
  });
}
function applyColor(color, mode) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  // 드래그 없으면 아무것도 안 함 (엑셀식)
  if (range.collapsed) return;

  if (mode === "text") {
    applyTextColor(range, color);
    return;
  }

  if (mode === "bg") {
    applyBgColorToBlocks(range, color);
  }
}
/* =================================================
   9-1) 배경색 — FINAL (Excel-Style / No State)
   - 여러 줄 드래그 OK
   - 텍스트만 배경색 적용
   - 줄간격(line-height) 절대 재실행 ❌
   - 블록(P/DIV/LI) 절대 조작 ❌
   - 상태 저장 / 커서 유지 ❌
================================================= */

function applyBgColor(color) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  if (range.collapsed) return;
  if (!editor.contains(range.commonAncestorContainer)) return;

  // 선택 영역을 fragment로 분리
  const fragment = range.extractContents();

  // fragment 내부 TEXT_NODE만 처리
  applyBgColorToTextNodes(fragment, color);

  // 원래 위치에 그대로 복원 (블록 구조 유지)
  range.insertNode(fragment);
  range.collapse(false);

  sel.removeAllRanges();
  sel.addRange(range);
}

/* ---------------------------------
   fragment 내부 TEXT_NODE 전용 처리
--------------------------------- */
function applyBgColorToTextNodes(fragment, color) {
  const walker = document.createTreeWalker(
    fragment,
    NodeFilter.SHOW_TEXT,
    null
  );

  const targets = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) {
      targets.push(node);
    }
  }

  targets.forEach(textNode => {
    const span = document.createElement("span");
    span.style.backgroundColor = color;

    textNode.parentNode.replaceChild(span, textNode);
    span.appendChild(textNode);
  });
}

  /* =================================================
        10) 이미지
  ================================================= */
  function insertImage(file) {
    ImageEngine.insert(file);
  }

  function imageAlign(direction) {
    ImageEngine.align(direction);
  }

  /* =================================================
        11) 포커스 유지
        - 불필요한 selection cache 없음 (속도/안정)
  ================================================= */
  editor.addEventListener("click", () => {
    if (document.activeElement !== editor) editor.focus();
  });

  /* =================================================
        12) 외부 공개 API (명령만)
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
   setColor:   c => execute({ cmd: "textColor", value: c }),
   setBgColor: c => execute({ cmd: "bgColor",   value: c }),

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

   
    // 이미지
    insertImage,
    imageAlign
  };

})();


