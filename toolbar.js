/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js Stable v2.7
   색상팝업 고정 + 드롭다운 + 이미지 + 줄간격 안정판
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const toolbar = document.getElementById("toolbar");
  const editor = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* -----------------------------------------------------
     1) 버튼 모델 구조
  ----------------------------------------------------- */
  const buttons = [
    { type: "color", id: "textColorBtn", icon: "🖌️A", title: "글자색" },
    { type: "bgcolor", id: "bgColorBtn", icon: "🎨", title: "배경색" },

    { cmd: "bold", icon: "B", title: "굵게" },
    { cmd: "italic", icon: "I", title: "기울임" },
    { cmd: "underline", icon: "U", title: "밑줄" },

    { cmd: "justifyLeft", icon: "좌", title: "왼쪽 정렬" },
    { cmd: "justifyCenter", icon: "중", title: "가운데" },
    { cmd: "justifyRight", icon: "우", title: "오른쪽" },
    { cmd: "justifyFull", icon: "양", title: "양쪽 정렬" },

    { cmd: "insertUnorderedList", icon: "•", title: "글머리" },
    { cmd: "insertOrderedList", icon: "1.", title: "번호" },

    { type: "quote", icon: "❝", title: "인용" },
    { type: "code", icon: "</>", title: "코드" },
    { type: "hr", icon: "━", title: "구분선" },

    { type: "image", icon: "🌈⚒", title: "이미지" },

    { cmd: "undo", icon: "↺", title: "실행 취소" },
    { cmd: "redo", icon: "↻", title: "다시 실행" },

    { type: "clear", icon: "지우기", title: "전체 지우기" }
  ];


  /* -----------------------------------------------------
     2) 버튼 UI 생성
  ----------------------------------------------------- */
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = "toolbar-btn";
    b.innerHTML = btn.icon;
    b.title = btn.title;

    // execCommand 계열
    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    // 🎨 글자색
    if (btn.type === "color") {
      b.addEventListener("click", e => openColorPopup("color", e));
    }
    // 🎨 배경색
    if (btn.type === "bgcolor") {
      b.addEventListener("click", e => openColorPopup("background", e));
    }

    // 인용
    if (btn.type === "quote") {
      b.addEventListener("click", () =>
        document.execCommand("formatBlock", false, "blockquote")
      );
    }

    // 코드 블록
    if (btn.type === "code") {
      b.addEventListener("click", () => {
        const sel = document.getSelection();
        const html = `<pre style="background:#F5F5F5;padding:10px;border-radius:6px;">${sel}</pre>`;
        document.execCommand("insertHTML", false, html);
      });
    }

    // 구분선
    if (btn.type === "hr") {
      b.addEventListener("click", () => {
        document.execCommand("insertHorizontalRule");
      });
    }

    // 이미지 삽입
    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const file = document.createElement("input");
        file.type = "file";
        file.accept = "image/*";

        file.onchange = () => {
          const reader = new FileReader();
          reader.onload = () => {
            document.execCommand("insertImage", false, reader.result);
            setTimeout(() => normalizeInsertedImages(), 30);
          };
          reader.readAsDataURL(file.files[0]);
        };

        file.click();
      });
    }

    // 전체 지우기
    if (btn.type === "clear") {
      b.addEventListener("click", () => editor.innerHTML = "");
    }

    toolbar.appendChild(b);
  });


  /* -----------------------------------------------------
     3) 드롭다운 3종
  ----------------------------------------------------- */
  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();
});


/* -----------------------------------------------------
   4) 공통 inline-style
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
   5) 🎨 색상 팝업 엔진 (툴바 아래 고정)
----------------------------------------------------- */
function openColorPopup(type, event) {
  const old = document.querySelector(".color-popup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.className = "color-popup";

  const colors = [
    "#000000", "#444444", "#666666", "#999999",
    "#FF0000", "#FF7700", "#FFD400", "#00AA00",
    "#00A2FF", "#0055FF", "#8000FF", "#FF00C8",
    "#FFC0CB", "#FA8072", "#A52A2A", "#8B4513"
  ];

  colors.forEach(c => {
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.background = c;

    box.addEventListener("click", () => {
      const prop = type === "color" ? "color" : "backgroundColor";
      applyInlineStyle(prop, c);
      popup.remove();
    });

    popup.appendChild(box);
  });

  // 📌 버튼 위치 기준 정밀 좌표
  const rect = event.target.getBoundingClientRect();
  popup.style.top = rect.bottom + window.scrollY + 8 + "px";
  popup.style.left = rect.left + window.scrollX + "px";

  document.body.appendChild(popup);
}


/* -----------------------------------------------------
   6) 줄간격 — 문단 기반 안정판
----------------------------------------------------- */
function initLineHeightDropdown() {
  const select = document.getElementById("lineHeightSelect");
  if (!select) return;

  ["100%", "115%", "150%", "200%", "250%", "300%"].forEach(v => {
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
  const container = range.commonAncestorContainer;

  let blocks = [];

  if (container.nodeType === 1) {
    blocks = container.querySelectorAll("p, div, li");
  }

  if (blocks.length === 0) {
    const wrapper = document.createElement("p");
    wrapper.style.lineHeight = value;

    const extracted = range.extractContents();
    wrapper.appendChild(extracted);
    range.insertNode(wrapper);
    return;
  }

  blocks.forEach(b => b.style.lineHeight = value);
}


/* -----------------------------------------------------
   7) 글자체
----------------------------------------------------- */
function initFontDropdown() {
  const select = document.getElementById("fontFamilySelect");
  if (!select) return;

  const fonts = [
    { name: "기본체", value: "" },
    { name: "고딕체", value: "sans-serif" },
    { name: "명조체", value: "serif" },
    { name: "고운돋움", value: "'Gowun Dodum', sans-serif" },
    { name: "나눔명조", value: "'Nanum Myeongjo', serif" },
    { name: "Noto Serif KR", value: "'Noto Serif KR', serif" }
  ];

  fonts.forEach(f => {
    const op = document.createElement("option");
    op.value = f.value;
    op.textContent = f.name;
    select.appendChild(op);
  });

  select.addEventListener("change", () =>
    applyInlineStyle("fontFamily", select.value)
  );
}


/* -----------------------------------------------------
   8) 글자 크기
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

  select.addEventListener("change", () =>
    applyInlineStyle("fontSize", select.value + "px")
  );
}
