/* ======================================================
   📏 editor-lineheight.js — LineHeightEngine (FINAL v3.1)
   ------------------------------------------------------
   Ha-Bin Studio 헌법 적용

   ✔ 외부 규칙 전부 무시
   ✔ 줄간격 = 문서 전체 규칙
   ✔ 외부 복사 잔재(line-height/margin/padding) 제거(옵션)
   ✔ <p> 없는 텍스트도 문단으로 정규화(최소 안전장치)
====================================================== */

window.LineHeightEngine = (function () {

  function apply(editor, value, options) {
    if (!editor || value == null) return;

    // 옵션 (기본: 하빈식 "완전 통일")
    const opt = {
      resetParagraphSpace: true,   // ✅ 문단 간격까지 정화
      resetFontSize: false,        // 필요하면 true (줄간격 체감 통일)
      ...options
    };

    normalizeLooseText(editor);

    const blocks = editor.querySelectorAll("p,div,li");
    blocks.forEach(block => applyToBlock(block, String(value), opt));
  }

  function applyToBlock(blockEl, value, opt) {
    if (!blockEl) return;

    // 1) 외부 line-height 잔재 제거
    clearInlineLineHeight(blockEl);

    // 2) (옵션) 문단 간격 잔재 제거 — 한글/웹에서 가장 흔한 교란
    if (opt.resetParagraphSpace) {
      blockEl.style.removeProperty("margin");
      blockEl.style.removeProperty("margin-top");
      blockEl.style.removeProperty("margin-bottom");
      blockEl.style.removeProperty("padding");
    }

    // 3) (옵션) 글자크기 잔재 제거 — 줄간격 체감 통일용
    if (opt.resetFontSize) {
      blockEl.style.removeProperty("font-size");
      blockEl.querySelectorAll("*").forEach(el => {
        el.style.removeProperty("font-size");
      });
    }

    // 4) 에디터 규칙 강제
    blockEl.style.lineHeight = value;
  }

  function clearInlineLineHeight(root) {
    if (root.style && root.style.lineHeight) {
      root.style.removeProperty("line-height");
    }
    root.querySelectorAll("*").forEach(el => {
      if (el.style && el.style.lineHeight) {
        el.style.removeProperty("line-height");
      }
    });
  }

  // editor 바로 아래에 텍스트가 떠돌면 <p>로 감싸 문단화
  function normalizeLooseText(editor) {
    const nodes = Array.from(editor.childNodes);
    const hasLooseText = nodes.some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== "");

    if (!hasLooseText) return;

    const frag = document.createDocumentFragment();
    nodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        const t = n.textContent.replace(/\s+/g, " ").trim();
        if (!t) return;
        const p = document.createElement("p");
        p.textContent = t;
        frag.appendChild(p);
      } else {
        frag.appendChild(n);
      }
    });

    editor.innerHTML = "";
    editor.appendChild(frag);
  }

  return { apply };

})();

