/* ---------------------------------------------------
   ⚙️ editor-core.js — EditorCore vFinal (Constitution Edition)
   Ha-Bin Studio · Data → DOM Core (배선판)
   역할:
   - DOM 참조
   - 초기 데이터 바인딩(id 기반)
   - execute(cmdObj)로 명령 전달
   - 엔진 호출 (TextEngine / ColorTextEngine / ColorBgEngine / ImageEngine)
   ❌ UI 상태 저장
   ❌ 색상 계산/판단
   ❌ 이미지 DOM 조작/좌표 처리
---------------------------------------------------- */

window.EditorCore = (function () {

  /* =================================================
        0) 배선판 Core
  ================================================= */
  const Core = {};

  /* =================================================
        1) 외부 엔진 연결 (전역 의존)
        - ❗ 캐싱(저장) 금지: 로딩 순서 지뢰 제거
        - 필요할 때 window.xxx로 즉시 참조한다
  ================================================= */
  const TextEngine = window.TextEngine;

  /* =================================================
        2) DOM 참조 (고정 ID)
  ================================================= */
  const editor = document.getElementById("hb-editor");
  const title = document.getElementById("hb-title");

// DOM이 없으면 조용히 종료 (헌법 예외)
if (!editor || !title) {
  Core.execute = () => {};
  return Core;
}

// ★ 문단 최소 1개 보장 (Paragraph · 브라우저 개입 차단)
if (!editor.querySelector("[data-hb-paragraph]")) {
  const paragraph = document.createElement("div");
  paragraph.setAttribute("data-hb-paragraph", "");
  paragraph.innerHTML = "&nbsp;";   // ✅ br 금지
  editor.appendChild(paragraph);
}
  
  /* =================================================
        3) id 기반 초기 로딩 (존재 / 비존재)
        - 페이지 로드 시 1회
  ================================================= */
  (function bindInitialData() {
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
      editor.innerHTML = "<div data-hb-paragraph>&nbsp;</div>";
    }
   
})();

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

    const txt = (t.textContent || "").replace(/\u200B/g, "").trim();
    txt === "" && t.remove();
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
    if (document.activeElement !== editor) editor.focus();

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
      current.style.fontSize = Number(px) + "px";
      return;
    }

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

    if (!range.collapsed) {
      removeTypingSpanIfEmpty();
      applyFontSizeToSelection(px);
      return;
    }

    applyTypingFontSize(px);
  }
 /* =================================================
   🔒 TEXT ONLY PASTE — Core IO Gate (Final)
   외부 규칙 완전 차단
================================================= */
editor.addEventListener("paste", function (e) {
  e.preventDefault();

  // 무조건 text/plain만 수용
  const text = (e.clipboardData || window.clipboardData)
    .getData("text/plain")
    .replace(/\r/g, "");

  const lines = text.split(/\n+/);
  const frag = document.createDocumentFragment();

  lines.forEach(line => {
    const paragraph = document.createElement("div");
paragraph.setAttribute("data-hb-paragraph", "");

    // 빈 줄도 문단으로 유지
    paragraph.textContent = line.trim() === "" ? "\u00A0" : line;
    frag.appendChild(paragraph);
  });

  insertAtCursor(editor, frag);
});

function insertAtCursor(editor, frag) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    editor.appendChild(frag);
    return;
  }

  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(frag);
  range.collapse(false);

  sel.removeAllRanges();
  sel.addRange(range);
}


  /* =================================================
        8) 공용 실행 엔진 (Excel-Style)
        - EditorCore는 판단하지 않고 "execute"로만 전달
  ================================================= */
  function execute(cmdObj) {
    if (!cmdObj || isLocked) return;

    isLocked = true;
    const { cmd, value } = cmdObj;

    if (document.activeElement !== editor) editor.focus();

    // --- Font Size (px) ---
    if (cmd === "fontSizePx") {
      const sel = window.getSelection();
      const hasSelection = !!(sel && sel.rangeCount && !sel.getRangeAt(0).collapsed);

      if (hasSelection) applyFontSizePx(value);
      else setTimeout(() => applyFontSizePx(value), 0);

      isLocked = false;
      return;
    }

      
    // --- Color (실행 전용 엔진 호출) ---
    if (cmd === "color-text") {
      window.ColorTextEngine && window.ColorTextEngine.apply(value);
      isLocked = false;
      return;
    }

    if (cmd === "color-bg") {
      window.ColorBgEngine && window.ColorBgEngine.apply(value);
      isLocked = false;
      return;
    }

    // --- Default execCommand ---
    document.execCommand(cmd, false, value || null);
    isLocked = false;
  }

  /* =================================================
        9) 이미지 (배선판)
        - 조건/판단/좌표 ❌
        - 딱 1줄 연결
  ================================================= */
  function insertImage(file) {
    window.ImageEngine && window.ImageEngine.insert(file);
  }

  function imageAlign(direction) {
    window.ImageEngine && window.ImageEngine.align(direction);
  }

  /* =================================================
        10) 포커스 유지
  ================================================= */
  editor.addEventListener("click", () => {
    if (document.activeElement !== editor) editor.focus();
  });

  /* =================================================
        11) 공개 API (기존 toolbar.js 호출 호환)
  ================================================= */
    // 텍스트 스타일
  Core.bold      = () => execute(TextEngine.bold());
  Core.italic    = () => execute(TextEngine.italic());
  Core.underline = () => execute(TextEngine.underline());

  // 폰트/크기/줄간격
  Core.setFont       = f  => execute(TextEngine.setFont(f));
  Core.setSize       = px => execute({ cmd: "fontSizePx", value: px });
 
  // 색상 (cmd 고정)
  Core.setColor   = c => execute({ cmd: "color-text", value: c });
  Core.setBgColor = c => execute({ cmd: "color-bg",   value: c });

  // 정렬
  Core.alignLeft    = () => execute(TextEngine.alignLeft());
  Core.alignCenter  = () => execute(TextEngine.alignCenter());
  Core.alignRight   = () => execute(TextEngine.alignRight());
  Core.alignJustify = () => execute(TextEngine.alignJustify());

  // 리스트
  Core.ul = () => execute(TextEngine.ul());
  Core.ol = () => execute(TextEngine.ol());

  // 기타
  Core.clear = () => execute(TextEngine.clear());
  Core.undo  = () => execute(TextEngine.undo());
  Core.redo  = () => execute(TextEngine.redo());
/* =================================================
   📏 Line-height Request (Document Model)
   - 문단(Paragraph) 기준 단일 적용
   - 이름 통일: data-hb-paragraph
================================================= */
Core.requestLineHeight = function (variant) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const editor = document.getElementById("hb-editor");
  if (!editor) return;

  const paragraphs = Array.from(
    editor.querySelectorAll("[data-hb-paragraph]")
  );

  paragraphs.forEach(p => {
    // 선택 영역과 겹치는 모든 문단에 적용
    if (range.intersectsNode(p)) {
      window.LineHeightEngine?.apply(p, variant);
    }
  });
};

  // 이미지
  Core.insertImage = file => {
  window.ImageEngine && window.ImageEngine.insert(file);
};

Core.imageAlign = dir => {
  window.ImageEngine && window.ImageEngine.align(dir);
};

Core.removeImage = () => {
  window.ImageEngine && window.ImageEngine.remove();
};

  return Core;

})();

