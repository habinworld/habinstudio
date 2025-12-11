/* -------------------------------------------------------
   ✨ editor-core.js — Final Stable Edition
   Ha-Bin Studio Editor Core (전역 window.EditorCore)
   - 이름 통일 규칙 100% 준수
   - TextEngine / ColorEngine / ImageEngine 모두와 연결
-------------------------------------------------------- */

window.EditorCore = (function () {

  const editor = document.getElementById("hb-editor");


  /* =====================================================
        🔵 헬퍼 1) 현재 Range 가져오기
  ===================================================== */
  function getRange() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    return sel.getRangeAt(0);
  }


  /* =====================================================
        🔵 헬퍼 2) execCommand 안전 실행
  ===================================================== */
  function cmd(command, value = null) {
    document.execCommand(command, false, value);
    editor.focus();
  }


  /* =====================================================
        ✏️ 1) 글자 스타일
  ===================================================== */
  function bold()      { cmd("bold"); }
  function italic()    { cmd("italic"); }
  function underline() { cmd("underline"); }


  /* =====================================================
        🖋 2) 폰트 설정
  ===================================================== */
  function setFont(fontName) {
    cmd("fontName", fontName);
  }

  /* =====================================================
        🔠 3) 글자 크기
  ===================================================== */
  function setSize(px) {
    // execCommand로는 px 직접 안되므로 span 래핑 방식
    wrapInlineStyle(`font-size:${px}px`);
  }


  /* =====================================================
        📏 4) 줄간격
  ===================================================== */
  function setLineHeight(lh) {
    wrapBlockStyle(`line-height:${lh}`);
  }


  /* =====================================================
        🎨 5) 기본 색상 / 배경색
        (ColorBasic 엔진이 호출됨)
  ===================================================== */
  function openBasicColor(btn, target) {
    window.ColorBasic.open(btn, target);
  }

  /* =====================================================
        🎨 6) 고급 색상 팝업
  ===================================================== */
  function openAdvancedColor(btn, target) {
    window.ColorAdvanced.open(btn, target);
  }


  /* =====================================================
        📐 7) 정렬
  ===================================================== */
  function alignLeft()    { cmd("justifyLeft"); }
  function alignCenter()  { cmd("justifyCenter"); }
  function alignRight()   { cmd("justifyRight"); }
  function alignJustify() { cmd("justifyFull"); }


  /* =====================================================
        🔢 8) 목록
  ===================================================== */
  function ul() { cmd("insertUnorderedList"); }
  function ol() { cmd("insertOrderedList"); }


  /* =====================================================
        🧹 9) 초기화
  ===================================================== */
  function clear() {
    editor.innerHTML = "";
  }


  /* =====================================================
        ↩️ 10) Undo / Redo
  ===================================================== */
  function undo() { cmd("undo"); }
  function redo() { cmd("redo"); }


  /* =====================================================
        🖼 11) 이미지 삽입
        (ImageEngine이 파일을 base64로 변환해서 span으로 넣음)
  ===================================================== */
  function insertImage(file) {
    if (!window.ImageEngine) return;

    window.ImageEngine.load(file, function (base64) {
      const img = document.createElement("img");
      img.src = base64;
      img.className = "hb-img";
      editor.appendChild(img);

      // 포커스 유지
      editor.focus();
    });
  }


  /* =====================================================
        🖼 12) 이미지 정렬
        left / center / right
  ===================================================== */
  function imageAlign(dir) {
    const sel = getRange();
    if (!sel) return;

    let node = sel.startContainer;

    // 이미지가 아닌 경우 → 가장 가까운 img 탐색
    while (node && node.tagName !== "IMG") {
      node = node.parentNode;
    }
    if (!node) return;

    node.style.display = "block";
    node.style.margin = "10px auto";

    if (dir === "left") {
      node.style.marginLeft = "0";
      node.style.marginRight = "auto";
    }
    if (dir === "center") {
      node.style.marginLeft = "auto";
      node.style.marginRight = "auto";
    }
    if (dir === "right") {
      node.style.marginLeft = "auto";
      node.style.marginRight = "0";
    }

    editor.focus();
  }


  /* =====================================================
        🔧 내부 함수 — Inline 스타일 래핑
  ===================================================== */
  function wrapInlineStyle(styleText) {
    const range = getRange();
    if (!range) return;

    const span = document.createElement("span");
    span.style = styleText;
    range.surroundContents(span);
  }

  /* =====================================================
        🔧 내부 함수 — Block 스타일 래핑
  ===================================================== */
  function wrapBlockStyle(styleText) {
    const range = getRange();
    if (!range) return;

    let target = range.startContainer;

    // 블록 요소(LI, P 등)를 찾을 때까지 올라감
    while (target && target !== editor && !isBlockElement(target)) {
      target = target.parentNode;
    }
    if (!target || target === editor) return;

    target.style = styleText;
  }

  function isBlockElement(node) {
    return ["DIV", "P", "LI", "UL", "OL"].includes(node.tagName);
  }


  /* =====================================================
        📌 공개 API
  ===================================================== */
  return {
    bold,
    italic,
    underline,
    setFont,
    setSize,
    setLineHeight,
    alignLeft,
    alignCenter,
    alignRight,
    alignJustify,
    ul,
    ol,
    clear,
    undo,
    redo,
    openBasicColor,
    openAdvancedColor,
    insertImage,
    imageAlign,
  };

})();



