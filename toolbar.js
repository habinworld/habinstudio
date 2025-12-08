/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js Stable v3.2
   글자색/배경색(color.js 연동) + 글자체 + 글자크기 + 줄간격
   이미지·인용·코드·정렬·리스트 통합 안정판
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const editor  = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* ---------------------------------------------------
     1) 버튼 모델 구조
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

    { cmd: "insertUnorderedList", icon: "•",  title: "글머리 기호" },
    { cmd: "insertOrderedList",   icon: "1.", title: "번호 목록" },

    { type: "quote", icon: "❝",   title: "인용" },
    { type: "code",  icon: "</>", title: "코드블록" },
    { type: "hr",    icon: "━",   title: "구분선" },

    { type: "image", icon: "🌈⚒", title: "이미지 삽입" },

    { cmd: "undo", icon: "↺", title: "실행 취소" },
    { cmd: "redo", icon: "↻", title: "다시 실행" },

    { type: "clear", icon: "지우기", title: "전체 지우기" }
  ];

  /* ---------------------------------------------------
     2) 버튼 UI 생성
  --------------------------------------------------- */
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = "toolbar-btn";
    b.innerHTML = btn.icon;
    b.title = btn.title;
    if (btn.id) b.id = btn.id;   // 🎯 color.js에서 찾을 id

    // execCommand 계열
    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    // 🎨 글자색 (color.js의 hbOpenColorPopup 사용)
    if (btn.type === "color") {
      b.addEventListener("click", () => {
        if (typeof hbOpenColorPopup === "function") {
          hbOpenColorPopup("color");
        }
      });
    }

    // 🎨 배경색
    if (btn.type === "bgcolor") {
      b.addEventListener("click", () => {
        if (typeof hbOpenColorPopup === "function") {
          hbOpenColorPopup("background");
        }
      });
    }

    // 인용
    if (btn.type === "quote") {
      b.addEventListener("click", () => {
        wrapSelectionBlock("blockquote", {
          margin: "8px 0",
          padding: "6px 10px",
          borderLeft: "3px solid #ccc",
          background: "#fafafa"
        });
      });
    }

    // 코드 블록
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

    // 구분선
    if (btn.type === "hr") {
      b.addEventListener("click", () => {
        document.execCommand("insertHorizontalRule");
        editor.focus();
      });
    }

    // 이미지 삽입
    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const file = document.createElement("input");
        file.type = "file";
        file.accept = "image/*";

        file.onchange = () => {
          const f = file.files && file.files[0];
          if (!f) return;

          const reader = new FileReader();
          reader.onload = () => {
            document.execCommand("insertImage", false, reader.result);
            setTimeout(() => normalizeInsertedImages(editor), 50);
          };
          reader.readAsDataURL(f);
        };

        file.click();
      });
    }

    // 전체 지우기
    if (btn.type === "clear") {
      b.addEventListener("click", () => {
        if (confirm("전체 내용을 지울까요?")) {
          editor.innerHTML = "";
        }
      });
    }

    toolbar.appendChild(b);
  });

  /* ---------------------------------------------------
     3) 드롭다운 초기화 (글자체 / 글자크기 / 줄간격)
  --------------------------------------------------- */
  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();

}); // DOMContentLoaded 끝


/* -----------------------------------------------------
   공통: 선택 영역에 inline-style 적용
----------------------------------------------------- */
function applyInlineStyle(property, value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const span = document.createElement("span");
  span.style[property] = value;

  try {
    range.surroundContents(span);
  } catch {
    const extracted = range.extractContents();
    span.appendChild(extracted);
    range.insertNode(span);
  }
}

/* -----------------------------------------------------
   블록 요소 래핑 (blockquote, pre 등)
----------------------------------------------------- */
function wrapSelectionBlock(tagName, styles = {}) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const block = document.createElement(tagName);

  Object.entries(styles).forEach(([k, v]) => {
    block.style[k] = v;
  });

  try {
    const extracted = range.extractContents();
    block.appendChild(extracted);
    range.deleteContents();
    range.insertNode(block);
  } catch {
    // 실패해도 전체가 망가지지 않게 조용히 무시
  }
}

/* -----------------------------------------------------
   이미지 기본 스타일 정리 (폭, margin 등)
----------------------------------------------------- */
function normalizeInsertedImages(editor) {
  const imgs = editor.querySelectorAll("img");
  imgs.forEach(img => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "8px auto";
  });
}

/* -----------------------------------------------------
   줄간격 드롭다운
----------------------------------------------------- */
function initLineHeightDropdown() {
  const select = document.getElementById("lineHeightSelect");
  if (!select) return;

  const values = ["100%", "115%", "150%", "180%", "200%", "250%", "300%"];
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

  // 선택된 영역 안의 p, div, li에 적용
  let blocks = [];
  if (container && container.nodeType === 1) {
    blocks = container.querySelectorAll("p, div, li");
  }

  if (!blocks || blocks.length === 0) {
    // 블록이 없으면 선택 영역을 p로 감싸기
    const wrapper = document.createElement("p");
    wrapper.style.lineHeight = value;

    const extracted = range.extractContents();
    wrapper.appendChild(extracted);
    range.insertNode(wrapper);
    return;
  }

  blocks.forEach(b => {
    b.style.lineHeight = value;
  });
}

/* -----------------------------------------------------
   글자체 드롭다운
----------------------------------------------------- */
function initFontDropdown() {
  const select = document.getElementById("fontFamilySelect");
  if (!select) return;

  const fonts = [
    { name: "기본체",       value: "" },
    { name: "고딕체",       value: "sans-serif" },
    { name: "명조체",       value: "serif" },
    { name: "고운돋움",     value: "'Gowun Dodum', sans-serif" },
    { name: "나눔명조",     value: "'Nanum Myeongjo', serif" },
    { name: "Noto Serif KR", value: "'Noto Serif KR', serif" }
  ];

  fonts.forEach(f => {
    const op = document.createElement("option");
    op.value = f.value;
    op.textContent = f.name;
    select.appendChild(op);
  });

  select.addEventListener("change", () => {
    const value = select.value;
    applyInlineStyle("fontFamily", value);
  });
}

/* -----------------------------------------------------
   글자 크기 드롭다운
----------------------------------------------------- */
function initFontSizeDropdown() {
  const select = document.getElementById("fontSizeSelect");
  if (!select) return;

  for (let i = 10; i <= 32; i++) {
    const op = document.createElement("option");
    op.value = i;
    op.textContent = i + "px";
    select.appendChild(op);
  }

  select.addEventListener("change", () => {
    const size = select.value + "px";
    applyInlineStyle("fontSize", size);
  });
}

