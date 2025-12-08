/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js v4.1 (초반응 엔진)
   색상·폰트·정렬·줄간격 즉시 반영 / execCommand 최소화
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const editor  = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* =====================================================
     1) 버튼 설정 (execCommand 느린 부분 제거)
  ===================================================== */
  const buttons = [
    { id:"textColorBtn", type:"color", icon:"🖌A", title:"글자색" },
    { id:"bgColorBtn",   type:"bgcolor", icon:"🎨", title:"배경색" },

    { cmd:"bold",      icon:"B"  , title:"굵게" },
    { cmd:"italic",    icon:"I"  , title:"기울임" },
    { cmd:"underline", icon:"U"  , title:"밑줄" },

    { type:"align", value:"left",   icon:"좌", title:"왼쪽 정렬" },
    { type:"align", value:"center", icon:"중", title:"가운데" },
    { type:"align", value:"right",  icon:"우", title:"오른쪽" },
    { type:"align", value:"justify",icon:"양", title:"양쪽" },

    { type:"ul", icon:"•",  title:"불릿" },
    { type:"ol", icon:"1.", title:"번호" },

    { type:"quote", icon:"❝",  title:"인용" },
    { type:"code",  icon:"</>", title:"코드 블록" },
    { type:"hr",    icon:"━",   title:"구분선" },

    { type:"image", icon:"🌈⚒", title:"사진" },

    { type:"undo", icon:"↺", title:"되돌리기" },
    { type:"redo", icon:"↻", title:"다시실행" },

    { type:"clear", icon:"지우기", title:"전체 지우기" }
  ];

  /* =====================================================
     2) 버튼 생성
  ===================================================== */
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = "toolbar-btn";
    b.innerHTML = btn.icon;
    b.title = btn.title;
    if (btn.id) b.id = btn.id;

    /* ---- 기본 execCommand (굵게/기울임/밑줄) ---- */
    if (btn.cmd) {
      b.onclick = () => document.execCommand(btn.cmd, false, null);
    }

    /* ---- 색상 ---- */
    if (btn.type === "color")
      b.onclick = () => hbOpenColorPopup("color");
    if (btn.type === "bgcolor")
      b.onclick = () => hbOpenColorPopup("background");

    /* ---- 문단 정렬 (즉시 적용) ---- */
    if (btn.type === "align") {
      b.onclick = () => applyParagraphAlign(btn.value);
    }

    /* ---- 불릿/번호 ---- */
    if (btn.type === "ul") b.onclick = () => document.execCommand("insertUnorderedList");
    if (btn.type === "ol") b.onclick = () => document.execCommand("insertOrderedList");

    /* ---- 인용 ---- */
    if (btn.type === "quote") b.onclick = () => wrapBlock("blockquote", {
      padding:"8px 14px",
      borderLeft:"4px solid #AAA",
      background:"#FAFAFA"
    });

    /* ---- 코드 블록 ---- */
    if (btn.type === "code") b.onclick = () => wrapBlock("pre", {
      background:"#F5F5F5",
      padding:"12px",
      borderRadius:"6px",
      fontFamily:"monospace"
    });

    /* ---- 구분선 ---- */
    if (btn.type === "hr") b.onclick = () => document.execCommand("insertHorizontalRule");

    /* ---- 이미지 ---- */
    if (btn.type === "image") {
      b.onclick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = () => {
          const r = new FileReader();
          r.onload = () => document.execCommand("insertImage", false, r.result);
          r.readAsDataURL(input.files[0]);
        };
        input.click();
      };
    }

    /* ---- undo/redo ---- */
    if (btn.type === "undo") b.onclick = () => document.execCommand("undo");
    if (btn.type === "redo") b.onclick = () => document.execCommand("redo");

    /* ---- 전체 지우기 ---- */
    if (btn.type === "clear") {
      b.onclick = () => {
        if (confirm("전체 지울까요?")) editor.innerHTML = "";
      };
    }

    toolbar.appendChild(b);
  });

  /* =====================================================
     3) 드롭다운: 폰트 / 크기 / 줄간격 즉시 적용
  ===================================================== */
  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();
});

/* =========================================================
   🟦 문단 정렬 (즉시 스타일 적용)
========================================================= */
function applyParagraphAlign(type) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let block = sel.anchorNode;
  while (block && !["DIV","P","LI"].includes(block.nodeName)) {
    block = block.parentNode;
  }

  if (!block) return;

  block.style.textAlign =
    type === "left" ? "left" :
    type === "center" ? "center" :
    type === "right" ? "right" :
    "justify";
}

/* =========================================================
   🟦 인용/코드 블록
========================================================= */
function wrapBlock(tag, styles) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const r = sel.getRangeAt(0);
  const newBlock = document.createElement(tag);

  Object.entries(styles).forEach(([k,v]) => newBlock.style[k] = v);

  const frag = r.extractContents();
  newBlock.appendChild(frag);

  r.insertNode(newBlock);
}

/* =========================================================
   🟦 폰트
========================================================= */
function initFontDropdown() {
  const sel = document.getElementById("fontFamilySelect");
  if (!sel) return;

  const list = [
    { name:"기본체", value:"" },
    { name:"함초롱바탕", value:"'HCR Batang', serif" },
    { name:"Noto Sans KR", value:"'Noto Sans KR', sans-serif" },
    { name:"고운돋움", value:"'Gowun Dodum', sans-serif" },
    { name:"나눔명조", value:"'Nanum Myeongjo', serif" }
  ];

  list.forEach(f => {
    const op = document.createElement("option");
    op.value = f.value;
    op.textContent = f.name;
    sel.appendChild(op);
  });

  sel.onchange = () => applyInline("fontFamily", sel.value);
}

/* =========================================================
   🟦 글자 크기
========================================================= */
function initFontSizeDropdown() {
  const sel = document.getElementById("fontSizeSelect");
  if (!sel) return;

  for (let i = 10; i <= 32; i++) {
    const op = document.createElement("option");
    op.value = i + "px";
    op.textContent = i + "px";
    sel.appendChild(op);
  }

  sel.onchange = () => applyInline("fontSize", sel.value);
}

/* =========================================================
   🟦 줄간격
========================================================= */
function initLineHeightDropdown() {
  const sel = document.getElementById("lineHeightSelect");
  if (!sel) return;

  ["100%","130%","150%","180%","200%","250%","300%"]
    .forEach(v => {
      const op = document.createElement("option");
      op.value = v;
      op.textContent = v;
      sel.appendChild(op);
    });

  sel.onchange = () => applyLineHeight(sel.value);
}

/* =========================================================
   🟦 Inline 적용 (빠른 즉시 반영)
========================================================= */
function applyInline(prop, value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const r = sel.getRangeAt(0);

  const span = document.createElement("span");
  span.style[prop] = value;

  const frag = r.extractContents();
  span.appendChild(frag);
  r.insertNode(span);
}

/* =========================================================
   🟦 줄간격: 선택 블록 전체 즉시반응
========================================================= */
function applyLineHeight(value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let block = sel.anchorNode;
  while (block && !["DIV","P","LI"].includes(block.nodeName)) {
    block = block.parentNode;
  }

  if (!block) return;

  block.style.lineHeight = value;
}

