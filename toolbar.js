/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js v6.0 (Universal Align)
   글자/이미지 통합 정렬 버튼 (좌·중·우·양쪽)
   선택된 요소 자동 감지 → 서로 다른 정렬 적용
   Bold, Italic, Underline, Color, Lists, Quote, Code,
   HR, Image Insert, Undo/Redo, Clear All 포함
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");
  const editor  = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* =======================================================
     1) 버튼 테이블 (툴바 생성)
     ======================================================= */
  const btnList = [
    { type:"font-family", icon:"글꼴" },
    { type:"font-size",   icon:"크기" },
    { type:"line-height", icon:"줄간격" },

    /* 글자 꾸미기 */
    { cmd:"bold",      icon:"B",   t:"굵게" },
    { cmd:"italic",    icon:"I",   t:"기울임" },
    { cmd:"underline", icon:"U",   t:"밑줄" },

    /* 색상 */
    { type:"color-open", icon:"🖌A", t:"글자색" },
    { type:"bg-open",    icon:"🎨",  t:"배경색" },

    /* 🔥 Universal Align (텍스트 + 이미지 통합) */
    { type:"align-universal", value:"left",   icon:"좌", t:"왼쪽 정렬" },
    { type:"align-universal", value:"center", icon:"중", t:"가운데 정렬" },
    { type:"align-universal", value:"right",  icon:"우", t:"오른쪽 정렬" },
    { type:"align-universal", value:"justify",icon:"양", t:"양쪽 정렬 (텍스트 전용)" },

    /* 리스트 */
    { type:"ul", icon:"•",  t:"불릿 목록" },
    { type:"ol", icon:"1.", t:"번호 목록" },

    /* 블록 */
    { type:"quote", icon:"❝",  t:"인용" },
    { type:"code",  icon:"</>", t:"코드 블럭" },
    { type:"hr",    icon:"━",   t:"구분선" },

    /* 이미지 */
    { type:"img", icon:"🌈⚒", t:"이미지 삽입" },

    /* 기타 */
    { type:"undo", icon:"↺", t:"되돌리기" },
    { type:"redo", icon:"↻", t:"다시실행" },
    { type:"clear", icon:"지움", t:"전체지우기" }
  ];

  /* =======================================================
     2) 버튼 생성
     ======================================================= */
  btnList.forEach(item => {
    const b = document.createElement("button");
    b.className = "hb-btn";
    b.innerHTML = item.icon;
    if (item.t) b.title = item.t;

    /* execCommand 계열 */
    if (item.cmd)
      b.onclick = () => document.execCommand(item.cmd, false, null);

    /* 색상 팝업 */
    if (item.type === "color-open")
      b.onclick = () => hbOpenColorPopup("color");

    if (item.type === "bg-open")
      b.onclick = () => hbOpenColorPopup("background");

    /* Universal Align */
    if (item.type === "align-universal") {
      b.onclick = () => hbUniversalAlign(item.value);
    }

    /* 목록 */
    if (item.type === "ul") b.onclick = () => document.execCommand("insertUnorderedList");
    if (item.type === "ol") b.onclick = () => document.execCommand("insertOrderedList");

    /* 인용/코드 */
    if (item.type === "quote") b.onclick = () => insertBlock("blockquote");
    if (item.type === "code")  b.onclick = () => insertBlock("pre");

    /* 구분선 */
    if (item.type === "hr")
      b.onclick = () => document.execCommand("insertHorizontalRule");

    /* 이미지 */
    if (item.type === "img")
      b.onclick = () => hbInsertImage();

    /* undo/redo */
    if (item.type === "undo") b.onclick = () => document.execCommand("undo");
    if (item.type === "redo") b.onclick = () => document.execCommand("redo");

    /* 전체 지우기 */
    if (item.type === "clear") {
      b.onclick = () => {
        if (confirm("전체 삭제하시겠습니까?"))
          editor.innerHTML = "";
      };
    }

    toolbar.appendChild(b);
  });

  /* 드롭다운 */
  makeFontFamilySelect();
  makeFontSizeSelect();
  makeLineHeightSelect();
});



/* =======================================================
   3) Universal Align System (텍스트 + 이미지 자동판별)
   ======================================================= */
function hbUniversalAlign(type) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let node = sel.anchorNode;
  if (!node) return;

  // 텍스트 노드면 부모로 올리기
  while (node && node.nodeType === 3) node = node.parentNode;
  if (!node) return;

  /* ----------------------------
     👉 Case 1: 이미지 정렬
     ---------------------------- */
  if (node.tagName === "IMG") {
    if (type === "left")  hbAlignImageLeft(node);
    if (type === "center")hbAlignImageCenter(node);
    if (type === "right") hbAlignImageRight(node);
    // 이미지에는 양쪽정렬 없음
    return;
  }

  /* ----------------------------
     👉 Case 2: 텍스트 정렬
     ---------------------------- */
  let block = node;
  while (block && !["P","DIV","LI"].includes(block.tagName)) {
    block = block.parentNode;
  }
  if (!block) return;

  block.style.textAlign = type;
}


/* =======================================================
   이미지 정렬 (이미지.js에서 자동 연동)
   Universal Align은 이미지.js의 함수 호출
   ======================================================= */

function hbAlignImageLeft(img) {
  img.style.position = "relative";
  img.style.float = "left";
  img.style.display = "inline";
  img.style.margin = "6px 12px 6px 0";

  refreshSelectBox();
}

function hbAlignImageCenter(img) {
  img.style.float = "none";
  img.style.display = "block";
  img.style.margin = "0 auto";

  refreshSelectBox();
}

function hbAlignImageRight(img) {
  img.style.position = "relative";
  img.style.float = "right";
  img.style.display = "inline";
  img.style.margin = "6px 0 6px 12px";

  refreshSelectBox();
}



/* =======================================================
   4) 텍스트 관련 기능 (기존 유지)
   ======================================================= */

/* 블록 삽입 */
function insertBlock(tag) {
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


/* 글꼴 */
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

/* 글자 크기 */
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

/* 줄간격 */
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

/* Inline 스타일 적용 */
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

/* 줄간격 */
function applyLineHeight(v) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  let block = sel.anchorNode;
  while (block && !["DIV","P","LI"].includes(block.tagName)) {
    block = block.parentNode;
  }
  if (!block) return;

  block.style.lineHeight = v;
}


