/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js
   풀옵션 텍스트 에디터 엔진
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const toolbar = document.getElementById("toolbar");
  const editor = document.getElementById("editor");

  if (!toolbar || !editor) return;

  /* -----------------------------------------------------
     📌 1) 툴바 버튼 목록
  ----------------------------------------------------- */
  const buttons = [
    { cmd: "bold", icon: "B" },
    { cmd: "italic", icon: "I" },
    { cmd: "underline", icon: "U" },

    { type: "color", icon: "🎨 글자색" },
    { type: "bgcolor", icon: "🖍 배경색" },

    { type: "font-size", icon: "A+" },
    { type: "line-height", icon: "↕ 줄간격" },

    { cmd: "justifyLeft", icon: "좌" },
    { cmd: "justifyCenter", icon: "중" },
    { cmd: "justifyRight", icon: "우" },
    { cmd: "justifyFull", icon: "양쪽" },

    { cmd: "insertUnorderedList", icon: "• 리스트" },
    { cmd: "insertOrderedList", icon: "1. 번호" },

    { cmd: "outdent", icon: "← 내어쓰기" },
    { cmd: "indent", icon: "→ 들여쓰기" },

    { type: "link", icon: "🔗 링크" },
    { type: "image", icon: "🖼 이미지" },

    { type: "quote", icon: "❝ 인용" },
    { type: "code", icon: "</> 코드" },
    { type: "hr", icon: "━ 구분선" },

    { cmd: "undo", icon: "↺" },
    { cmd: "redo", icon: "↻" },

    { type: "clear", icon: "지우기" }
  ];

  /* -----------------------------------------------------
     📌 2) 툴바 UI 생성
  ----------------------------------------------------- */
  buttons.forEach(btn => {
    const b = document.createElement("button");
    b.className = "toolbar-btn";
    b.textContent = btn.icon;

    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    if (btn.type === "color") {
      b.addEventListener("click", () => pickColor("foreColor"));
    }

    if (btn.type === "bgcolor") {
      b.addEventListener("click", () => pickColor("hiliteColor"));
    }

    if (btn.type === "font-size") {
      b.addEventListener("click", () => {
        const size = prompt("글자 크기(px)를 입력하세요 (예: 18)");
        if (size) document.execCommand("fontSize", false, "7"); 
        applyFontSize(size);
      });
    }

    if (btn.type === "line-height") {
      b.addEventListener("click", () => {
        const lh = prompt("줄간격을 입력하세요 (예: 1.6)");
        if (lh) document.execCommand("insertHTML", false,
          `<span style="line-height:${lh}; display:inline-block;">${document.getSelection()}</span>`
        );
      });
    }

    if (btn.type === "link") {
      b.addEventListener("click", () => {
        const url = prompt("링크 주소 입력:");
        if (url) document.execCommand("createLink", false, url);
      });
    }

    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const file = document.createElement("input");
        file.type = "file";
        file.accept = "image/*";
        file.onchange = () => {
          const reader = new FileReader();
          reader.onload = () => {
            document.execCommand("insertImage", false, reader.result);
          };
          reader.readAsDataURL(file.files[0]);
        };
        file.click();
      });
    }

    if (btn.type === "quote") {
      b.addEventListener("click", () => {
        document.execCommand("formatBlock", false, "blockquote");
      });
    }

    if (btn.type === "code") {
      b.addEventListener("click", () => {
        document.execCommand("insertHTML", false,
          `<pre style="background:#F5F5F5; padding:10px; border-radius:6px;">${document.getSelection()}</pre>`
        );
      });
    }

    if (btn.type === "hr") {
      b.addEventListener("click", () => {
        document.execCommand("insertHorizontalRule");
      });
    }

    if (btn.type === "clear") {
      b.addEventListener("click", () => {
        editor.innerHTML = "";
      });
    }

    toolbar.appendChild(b);
  });


  /* -----------------------------------------------------
     📌 3) 글자색 / 배경색 선택기
  ----------------------------------------------------- */
  function pickColor(cmd) {
    const color = document.createElement("input");
    color.type = "color";
    color.style.visibility = "hidden";
    document.body.appendChild(color);

    color.addEventListener("input", () => {
      document.execCommand(cmd, false, color.value);
    });

    color.click();
    editor.focus();
  }

  /* -----------------------------------------------------
     📌 4) font-size 직접 적용
     (execCommand fontSize “7” + span replace 방식)
  ----------------------------------------------------- */
  function applyFontSize(size) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = `${size}px`;
    range.surroundContents(span);
  }

  /* -----------------------------------------------------
     📌 5) 자동 임시저장
  ----------------------------------------------------- */
  setInterval(() => {
    localStorage.setItem("autosave_title", 
      document.getElementById("post-title").value);
    localStorage.setItem("autosave_content", editor.innerHTML);
  }, 2000);

  /* -----------------------------------------------------
     📌 6) 임시저장 불러오기
  ----------------------------------------------------- */
  if (!document.getElementById("post-title").value) {
    const t = localStorage.getItem("autosave_title");
    const c = localStorage.getItem("autosave_content");
    if (t) document.getElementById("post-title").value = t;
    if (c) editor.innerHTML = c;
  }

});

