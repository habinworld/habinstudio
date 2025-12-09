/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js v6.0 (Universal Align Final)
   글자/이미지 통합 정렬 · 즉시반응 · 에디터 심장모듈
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const editor  = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* =======================================================
     1) 버튼 테이블 (UI 자동 생성)
  ======================================================= */
  const btnList = [
    { type:"font-family", icon:"글꼴" },
    { type:"font-size",   icon:"크기" },
    { type:"line-height", icon:"줄간격" },

    /* 스타일 */
    { cmd:"bold",      icon:"B",   t:"굵게" },
    { cmd:"italic",    icon:"I",   t:"기울임" },
    { cmd:"underline", icon:"U",   t:"밑줄" },

    /* 색상 */
    { type:"color-open", icon:"🖌A", t:"글자색(고급)" },
    { type:"bg-open",    icon:"🎨",  t:"배경색(고급)" },

    /* Universal Align (글자·이미지 자동감지) */
    { type:"align-universal", value:"left",   icon:"좌", t:"왼쪽 정렬" },
    { type:"align-universal", value:"center", icon:"중", t:"가운데 정렬" },
    { type:"align-universal", value:"right",  icon:"우", t:"오른쪽 정렬" },
    { type:"align-universal", value:"justify",icon:"양", t:"양쪽 정렬(텍스트만)" },

    /* 목록 */
    { type:"ul", icon:"•",  t:"불릿 목록" },
    { type:"ol", icon:"1.", t:"번호 목록" },

    /* 블록 */
    { type:"quote", icon:"❝",  t:"인용" },
    { type:"code",  icon:"</>", t:"코드 블럭" },
    { type:"hr",    icon:"━",   t:"구분선" },

    /* 이미지 */
    { type:"img", icon:"🖼", t:"이미지 삽입" },

    /* 링크 */
    { type:"link", icon:"🔗", t:"링크 삽입" },

    /* 기타 */
    { type:"undo", icon:"↺", t:"되돌리기" },
    { type:"redo", icon:"↻", t:"다시 실행" },
    { type:"clear", icon:"지움", t:"전체 삭제" }
  ];

  /* =======================================================
     2) 버튼 생성
  ======================================================= */
  btnList.forEach(item => {
    const b = document.createElement("button");
    b.className = "hb-btn";
    b.innerHTML = item.icon;
    if (item.t) b.title = item.t;

    /* execCommand */
    if (item.cmd)
      b.onclick = () => document.execCommand(item.cmd, false, null);

    /* 색상팝업 */
    if (item.type === "color-open") {
      b.id = "textColorBtn";
      b.onclick = () => {
        lastClickedButton = b;
        hbOpenColorPopup("color");
      };
    }
    if (item.type === "bg-open") {
      b.id = "bgColorBtn";
      b.onclick = () => {
        lastClickedButton = b;
        hbOpenColorPopup("background");
      };
    }

    /* 정렬 통합 */
    if (item.type === "align-universal") {
      b.onclick = () => hbUniversalAlign(item.value);
    }

    /* 목록 */
    if (item.type === "ul") b.onclick = () => document.execCommand("insertUnorderedList");
    if (item.type === "ol") b.onclick = () => document.execCommand("insertOrderedList");

    /* 인용/코드 */
    if (item.type === "quote") b.onclick = () => hbInsertBlock("blockquote");
    if (item.type === "code")  b.onclick = () => hbInsertBlock("pre");

    /* 구분선 */
    if (item.type === "hr") b.onclick = () => document.execCommand("insertHorizontalRule");

    /* 이미지 */
    if (item.type === "img") b.onclick = () => hbInsertImage();

    /* 링크 */
    if (item.type === "link") b.onclick = () => hbInsertLink();

    /* Undo/Redo */
    if (item.type === "undo") b.onclick = () => document.execCommand("undo");
    if (item.type === "redo") b.onclick = () => document.execCommand("redo");

    /* 전체 삭제 */
    if (item.type === "clear") {
      b.onclick = () => {
        if (confirm("전체 삭제하시겠습니까?")) editor.innerHTML = "";
      };
    }

    toolbar.appendChild(b);
  });

  /* 드롭다운 */
  makeFontFamilySelect();
  makeFontSizeSelect();
  makeLineHeightSelect();
});


/* ============================================================
   Universal Align — 하빈 전용 최신판
============================================================ */
function hbUniversalAlign(type) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let node = sel.anchorNode;
  while (node && node.nodeType === 3) node = node.parentNode;
  if (!node) return;

  /* 이미지 정렬 */
  if (node.tagName === "IMG") {
    hbAlignImage(node, type);
    return;
  }

  /* 텍스트 정렬 */
  hbAlignText(node, type);
}


/* 텍스트 정렬 */
function hbAlignText(node, type) {
  let block = node;
  while (block && !["P","DIV","LI"].includes(block.tagName)) {
    block = block.parentNode;
  }
  if (!block) return;

  block.style.textAlign =
    type === "left"   ? "left" :
    type === "center" ? "center" :
    type === "right"  ? "right" :
    "justify";
}


/* 이미지 정렬 */
function hbAlignImage(img, type) {
  img.style.display = "block";

  if (type === "left") {
    img.style.float = "left";
    img.style.margin = "6px 12px 6px 0";
  }
  else if (type === "center") {
    img.style.float = "none";
    img.style.margin = "6px auto";
  }
  else if (type === "right") {
    img.style.float = "right";
    img.style.margin = "6px 0 6px 12px";
  }
  else {
    alert("이미지는 양쪽정렬을 지원하지 않습니다.");
  }

  refreshSelectBox();
}


/* ============================================================
   블록 삽입 (인용/코드)
============================================================ */
function hbInsertBlock(tag) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const r = sel.getRangeAt(0);
  const block = document.createElement(tag);

  if (tag === "blockquote") {
    block.style.padding = "8px 14px";
    block.style.borderLeft = "4px solid #AAA";
    block.style.background = "#FAFAFA";
  }

  if (tag === "pre") {
    block.style.padding = "12px";
    block.style.background = "#F5F5F5";
    block.style.borderRadius = "6px";
    block.style.fontFamily = "monospace";
  }

  const frag = r.extractContents();
  block.appendChild(frag);
  r.insertNode(block);
}


/* ============================================================
   링크
============================================================ */
function hbInsertLink() {
  const url = prompt("링크 URL을 입력하세요:");
  if (url) document.execCommand("createLink", false, url);
}


/* ============================================================
   드롭다운: 폰트/크기/줄간격
============================================================ */
function makeFontFamilySelect() {
  const toolbar = document.getElementById("toolbar");
  const sel = document.createElement("select");
  sel.className = "hb-select";

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
  toolbar.insertBefore(sel, toolbar.firstChild);
}

function makeFontSizeSelect() {
  const toolbar = document.getElementById("toolbar");
  const sel = document.createElement("select");
  sel.className = "hb-select";

  [13,14,15,16,17,18,20,22,24,28,32].forEach(sz => {
    const op = document.createElement("option");
    op.value = sz + "px";
    op.textContent = sz + "px";
    sel.appendChild(op);
  });

  sel.onchange = () => applyInline("fontSize", sel.value);
  toolbar.insertBefore(sel, toolbar.children[1]);
}

function makeLineHeightSelect() {
  const toolbar = document.getElementById("toolbar");
  const sel = document.createElement("select");
  sel.className = "hb-select";

  ["1.4","1.6","1.8","2.0","2.4","3.0"].forEach(v => {
    const op = document.createElement("option");
    op.value = v;
    op.textContent = v;
    sel.appendChild(op);
  });

  sel.onchange = () => applyLineHeight(sel.value);
  toolbar.insertBefore(sel, toolbar.children[2]);
}


/* ============================================================
   인라인 스타일
============================================================ */
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

function applyLineHeight(v) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let block = sel.anchorNode;
  while (block && !["DIV","P","LI"].includes(block.tagName))
    block = block.parentNode;

  if (!block) return;
  block.style.lineHeight = v;
}

 
