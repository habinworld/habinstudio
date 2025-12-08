/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js Stable v3.4
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

    { cmd: "justifyLeft",   icon: "좌", title: "왼쪽" },
    { cmd: "justifyCenter", icon: "중", title: "가운데" },
    { cmd: "justifyRight",  icon: "우", title: "오른쪽" },
    { cmd: "justifyFull",   icon: "양", title: "양쪽" },

    { cmd: "insertUnorderedList", icon: "•",  title: "글머리" },
    { cmd: "insertOrderedList",   icon: "1.", title: "번호" },

    { type: "quote", icon: "❝",   title: "인용" },
    { type: "code",  icon: "</>", title: "코드" },
    { type: "hr",    icon: "━",   title: "구분선" },

    { type: "image", icon: "🌈⚒", title: "이미지" },

    { cmd: "undo", icon: "↺", title: "취소" },
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
    if (btn.id) b.id = btn.id;

    // execCommand
    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    // 색상
    if (btn.type === "color") {
      b.addEventListener("click", () => hbOpenColorPopup("color"));
    }
    if (btn.type === "bgcolor") {
      b.addEventListener("click", () => hbOpenColorPopup("background"));
    }

    // 인용
    if (btn.type === "quote") {
      b.addEventListener("click", () => wrapSelectionBlock("blockquote", {
        padding: "8px 14px",
        borderLeft: "4px solid #aaa",
        background: "#FAFAFA"
      }));
    }

    // 코드 블록
    if (btn.type === "code") {
      b.addEventListener("click", () => wrapSelectionBlock("pre", {
        background: "#F5F5F5",
        padding: "12px",
        borderRadius: "6px",
        fontFamily: "monospace"
      }));
    }

    // 구분선
    if (btn.type === "hr") {
      b.addEventListener("click", () => {
        document.execCommand("insertHorizontalRule");
      });
    }

    // 이미지
    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = () => {
          const file = input.files[0];
          const r = new FileReader();
          r.onload = () => {
            document.execCommand("insertImage", false, r.result);
            setTimeout(() => normalizeInsertedImages(editor), 30);
          };
          r.readAsDataURL(file);
        };

        input.click();
      });
    }

    // 전체 지우기
    if (btn.type === "clear") {
      b.addEventListener("click", () => {
        if (confirm("전체 내용을 지울까요?"))
          editor.innerHTML = "";
      });
    }

    toolbar.appendChild(b);
  });

  /* ---------------------------------------------------
     3) 드롭다운
  --------------------------------------------------- */
  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();
});

/* -----------------------------------------------------
   Inline Style 적용
----------------------------------------------------- */
function applyInlineStyle(prop, value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const span = document.createElement("span");
  span.style[prop] = value;

  try {
    range.surroundContents(span);
  } catch {
    const extracted = range.extractContents();
    span.appendChild(extracted);
    range.insertNode(span);
  }
}

/* -----------------------------------------------------
   인용/코드 블록 래핑
----------------------------------------------------- */
function wrapSelectionBlock(tagName, styles) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const r = sel.getRangeAt(0);
  const block = document.createElement(tagName);

  Object.entries(styles).forEach(([k, v]) => {
    block.style[k] = v;
  });

  const extracted = r.extractContents();
  block.appendChild(extracted);
  r.insertNode(block);
}

/* -----------------------------------------------------
   줄간격
----------------------------------------------------- */
function initLineHeightDropdown() {
  const select = document.getElementById("lineHeightSelect");
  if (!select) return;

  ["100%","115%","150%","180%","200%","250%","300%"].forEach(v => {
    const op = document.createElement("option");
    op.value = v;
    op.textContent = v;
    select.appendChild(op);
  });

  select.addEventListener("change", () => applyLineHeight(select.value));
}

function applyLineHeight(value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const r = sel.getRangeAt(0);
  let container = r.commonAncestorContainer;
  if (container.nodeType === 3) container = container.parentNode;

  let blocks = [];
  if (container.nodeType === 1)
    blocks = container.querySelectorAll("p, div, li");

  if (!blocks.length) {
    const p = document.createElement("p");
    p.style.lineHeight = value;
    const extracted = r.extractContents();
    p.appendChild(extracted);
    r.insertNode(p);
    return;
  }

  blocks.forEach(b => b.style.lineHeight = value);
}

/* -----------------------------------------------------
   글자체
----------------------------------------------------- */
function initFontDropdown() {
  const sel = document.getElementById("fontFamilySelect");
  if (!sel) return;

  [
    {name:"기본체", value:""},
    {name:"고딕체", value:"sans-serif"},
    {name:"명조체", value:"serif"},
    {name:"고운돋움", value:"'Gowun Dodum', sans-serif"},
    {name:"나눔명조", value:"'Nanum Myeongjo', serif"},
    {name:"Noto Serif KR", value:"'Noto Serif KR', serif"}
  ].forEach(f=>{
    let op=document.createElement("option");
    op.value=f.value;
    op.textContent=f.name;
    sel.appendChild(op);
  });

  sel.addEventListener("change",()=>applyInlineStyle("fontFamily",sel.value));
}

/* -----------------------------------------------------
   글자 크기
----------------------------------------------------- */
function initFontSizeDropdown() {
  const sel = document.getElementById("fontSizeSelect");
  if (!sel) return;

  for (let i=10;i<=32;i++){
    const op=document.createElement("option");
    op.value=i;
    op.textContent=i+"px";
    sel.appendChild(op);
  }

  sel.addEventListener("change",()=>applyInlineStyle("fontSize",sel.value+"px"));
}

/* -----------------------------------------------------
   이미지 스타일
----------------------------------------------------- */
function normalizeInsertedImages(editor) {
  editor.querySelectorAll("img").forEach(img=>{
    img.style.maxWidth="100%";
    img.style.height="auto";
    img.style.display="block";
    img.style.margin="14px auto";
  });
}

 
