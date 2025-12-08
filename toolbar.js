/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js v4.0
   Instant Apply Ribbon Engine + AutoExpand + ColorPopup
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  if (!editor) return;

  /* -------------------------------------------------
     🔥 1) 기본 즉시 실행 명령
  ------------------------------------------------- */
  window.hbExec = function (cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 2) 글자색 / 배경색 (color.js에서 호출)
  ------------------------------------------------- */
  window.applyColor = function (color) {
    if (!color) return;

    const type = window.currentColorType; // "color" or "background"

    const span = document.createElement("span");
    if (type === "color") span.style.color = color;
    else span.style.backgroundColor = color;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.surroundContents(span);

    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 3) 폰트 사이즈 즉시 적용
  ------------------------------------------------- */
  window.hbSetFontSize = function (size) {
    if (!size) return;
    document.execCommand("fontSize", false, "7"); 
    const fontTags = editor.querySelectorAll("font[size='7']");
    fontTags.forEach(f => {
      f.removeAttribute("size");
      f.style.fontSize = size + "px";
    });
    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 4) 폰트명 즉시 적용
  ------------------------------------------------- */
  window.hbSetFontFamily = function (family) {
    if (!family) return;

    document.execCommand("fontName", false, family);
    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 5) 줄간격 (line-height)
  ------------------------------------------------- */
  window.hbSetLineHeight = function (lh) {
    if (!lh) return;

    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const parent = range.commonAncestorContainer.parentElement;

    let block = parent.closest("p, div") || parent;
    block.style.lineHeight = lh;

    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 6) 이미지 삽입
  ------------------------------------------------- */
  window.hbInsertImage = function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;

        // 커서 위치에 삽입
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.insertNode(img);
        } else {
          editor.appendChild(img);
        }

        // image.js 핸들 활성화
        if (typeof activateResizeHandle === "function") {
          activateResizeHandle(img);
        }

        editor.focus();
        hbAutoExpand();
      };

      reader.readAsDataURL(file);
    });

    input.click();
  };

  /* -------------------------------------------------
     🔥 7) HR 삽입
  ------------------------------------------------- */
  window.hbInsertHR = function () {
    document.execCommand("insertHorizontalRule");
    editor.focus();
    hbAutoExpand();
  };

  /* -------------------------------------------------
     🔥 8) 링크 삽입
  ------------------------------------------------- */
  window.hbInsertLink = function () {
    const url = prompt("URL 입력:");
    if (!url) return;
    document.execCommand("createLink", false, url);
  };

  /* -------------------------------------------------
     🔥 9) 자동 확장 엔진
  ------------------------------------------------- */
  function hbAutoExpand() {
    editor.style.height = "auto";
    editor.style.height = editor.scrollHeight + "px";
  }

  editor.addEventListener("input", hbAutoExpand);
  hbAutoExpand();
});

 
