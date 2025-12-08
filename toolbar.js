/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js Ultimate v3.4
   Mini Word + Mini Excel + Mini Photoshop Engine
   글자체 · 글자크기 · 줄간격 · 색상팝업 · 이미지정리
   안정성 강화 · selection 알고리즘 개선판
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const editor  = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* ---------------------------------------------------
     버튼 목록 (Excel Ribbon 구조)
  --------------------------------------------------- */
  const buttons = [
    { type: "color",   id: "textColorBtn", icon: "🖌️A",  title: "글자색" },
    { type: "bgcolor", id: "bgColorBtn",   icon: "🎨",   title: "배경색" },

    { cmd: "bold",      icon: "B",   title: "굵게" },
    { cmd: "italic",    icon: "I",   title: "기울임" },
    { cmd: "underline", icon: "U",   title: "밑줄" },

    { cmd: "justifyLeft",   icon: "좌", title: "왼쪽 정렬" },
    { cmd: "justifyCenter", icon: "중", title: "가운데 정렬" },
    { cmd: "justifyRight",  icon: "우", title: "오른쪽 정렬" },
    { cmd: "justifyFull",   icon: "양", title: "양쪽 정렬" },

    { cmd: "insertUnorderedList", icon: "•",  title: "글머리" },
    { cmd: "insertOrderedList",   icon: "1.", title: "번호" },

    { type: "quote", icon: "❝",   title: "인용" },
    { type: "code",  icon: "</>", title: "코드블록" },
    { type: "hr",    icon: "━",   title: "구분선" },

    { type: "image", icon: "🌈⚒", title: "이미지 삽입" },

    { cmd: "undo", icon: "↺", title: "실행 취소" },
    { cmd: "redo", icon: "↻", title: "다시 실행" },

    { type: "clear", icon: "지우기", title: "전체 지우기" }
  ];

  /* ---------------------------------------------------
     버튼 생성
  --------------------------------------------------- */
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = "toolbar-btn";
    b.innerHTML = btn.icon;
    b.title = btn.title;
    if (btn.id) b.id = btn.id;

    /* execCommand 계열 */
    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    /* 글자색 */
    if (btn.type === "color") {
      b.addEventListener("click", () => {
        hbOpenColorPopup("color");
      });
    }

    /* 배경색 */
    if (btn.type === "bgcolor") {
      b.addEventListener("click", () => {
        hbOpenColorPopup("background");
      });
    }

    /* 인용 */
    if (btn.type === "quote") {
      b.addEventListener("click", () => {
        wrapSelectionBlock("blockquote", {
          margin: "10px 0",
          padding: "8px 12px",
          borderLeft: "4px solid #ccc",
          background: "#f9f9f9"
        });
      });
    }

    /* 코드블록 */
    if (btn.type === "code") {
      b.addEventListener("click", () => {
        wrapSelectionBlock("pre", {
          background: "#F5F5F5",
          padding: "10px",
          borderRadius: "6px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap"
        });
      });
    }

    /* 구분선 */
    if (btn.type === "hr") {
      b.addEventListener("click", () => {
        document.execCommand("insertHorizontalRule");
        editor.focus();
      });
    }

    /* 이미지 */
    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = () => {
          const f = input.files?.[0];
          if (!f) return;

          const reader = new FileReader();
          reader.onload = () => {
            document.execCommand("insertImage", false, reader.result);
            setTimeout(() => normalizeImages(editor), 30);
          };
          reader.readAsDataURL(f);
        };

        input.click();
      });
    }

    /* 전체 지우기 */
    if (btn.type === "clear") {
      b.addEventListener("click", () => {
        if (confirm("전체 삭제할까요?")) editor.innerHTML = "";
      });
    }

    toolbar.appendChild(b);
  });

  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();
});

/* -----------------------------------------------------
   이미지 normalize
----------------------------------------------------- */
function normalizeImages(editor) {
  editor.querySelectorAll("img").forEach(img => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "10px auto";
  });
}

/* -----------------------------------------------------
   블록 감싸기
----------------------------------------------------- */
function wrapSelectionBlock(tag, styles = {}) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const block = document.createElement(tag);

  Object.entries(styles).forEach(([k, v]) => block.style[k] = v);

  const content = range.extractContents();
  block.appendChild(content);
  range.insertNode(block);
}

/* -----------------------------------------------------
   줄간격 — Ultimate Algorithm
----------------------------------------------------- */
function initLineHeightDropdown() {
  const select = document.getElementById("lineHeightSelect");
  if (!select) return;

  const values = [
    "1.0","1.15","1.3","1.5","1.8","2.0","2.5","3.0"
  ];

  values.forEach(v => {
    const op = document.createElement("option");
    op.value = v;
    op.textContent = v;
    select.appendChild(op);
  });

  select.addEventListener("change", () => {
    applyLineHeight(select.value);
  });
}

function applyLineHeight(value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  let container = range.commonAncestorContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentNode;
  }

  const blocks = findAllBlocks(container);

  if (blocks.length === 0) {
    const wrap = document.createElement("p");
    wrap.style.lineHeight = value;
    wrap.appendChild(range.extractContents());
    range.insertNode(wrap);
    return;
  }

  blocks.forEach(block => {
    block.style.lineHeight = value;
  });
}

function findAllBlocks(root) {
  if (!root || root.nodeType !== 1) return [];

  return root.querySelectorAll(
    "p, div, li, blockquote, pre, h1, h2, h3, h4, h5, h6"
  );
}

/* -----------------------------------------------------
   글자체 선택
----------------------------------------------------- */
function initFontDropdown() {
  const s = document.getElementById("fontFamilySelect");
  if (!s) return;

  const fonts = [
    { name: "기본체", value: "" },
    { name: "고딕", value: "sans-serif" },
    { name: "명조", value: "serif" },
    { name: "고운돋움", value: "'Gowun Dodum', sans-serif" },
    { name: "나눔명조", value: "'Nanum Myeongjo', serif" }
  ];

  fonts.forEach(f => {
    const op = document.createElement("option");
    op.value = f.value;
    op.textContent = f.name;
    s.appendChild(op);
  });

  s.addEventListener("change", () => {
    applyInlineStyle("fontFamily", s.value);
  });
}

/* -----------------------------------------------------
   글자 크기 선택
----------------------------------------------------- */
function initFontSizeDropdown() {
  const s = document.getElementById("fontSizeSelect");
  if (!s) return;

  for (let i = 10; i <= 32; i++) {
    const op = document.createElement("option");
    op.value = i + "px";
    op.textContent = i + "px";
    s.appendChild(op);
  }

  s.addEventListener("change", () => {
    applyInlineStyle("fontSize", s.value);
  });
}

/* -----------------------------------------------------
   인라인 스타일 적용
----------------------------------------------------- */
function applyInlineStyle(prop, val) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const span = document.createElement("span");

  span.style[prop] = val;

  try {
    range.surroundContents(span);
  } catch {
    const ex = range.extractContents();
    span.appendChild(ex);
    range.insertNode(span);
  }
}

 
