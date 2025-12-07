/* -----------------------------------------------------
   ✒️ Ha-Bin Studio — toolbar.js v2.0
   최신 모듈 구조 / color.js & image.js 완전 연동
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const toolbar = document.getElementById("toolbar");
  const editor = document.getElementById("editor");
  if (!toolbar || !editor) return;

  /* -----------------------------------------------------
     1) 버튼 목록 (모델 구조)
  ----------------------------------------------------- */
  const buttons = [

    // 글자색 / 배경색
    { type: "color", id: "textColorBtn", icon: "🖌️A", title: "글자색" },
    { type: "bgcolor", id: "bgColorBtn", icon: "🎨", title: "배경 채우기" },

    // 기본 서식
    { cmd: "bold", icon: "B", title: "굵게" },
    { cmd: "italic", icon: "I", title: "기울임" },
    { cmd: "underline", icon: "U", title: "밑줄" },

    // 정렬
    { cmd: "justifyLeft", icon: "좌", title: "왼쪽 정렬" },
    { cmd: "justifyCenter", icon: "중", title: "가운데 정렬" },
    { cmd: "justifyRight", icon: "우", title: "오른쪽 정렬" },
    { cmd: "justifyFull", icon: "양", title: "양쪽 정렬" },

    // 목록
    { cmd: "insertUnorderedList", icon: "•", title: "글머리 기호" },
    { cmd: "insertOrderedList", icon: "1.", title: "번호 매기기" },

    // 인용 / 코드 / 구분선
    { type: "quote", icon: "❝", title: "인용" },
    { type: "code", icon: "</>", title: "코드 블록" },
    { type: "hr", icon: "━", title: "구분선" },

    // 이미지
    { type: "image", icon: "🌈⚒", title: "이미지 삽입" },

    // 실행 취소 / 다시 실행
    { cmd: "undo", icon: "↺", title: "실행 취소" },
    { cmd: "redo", icon: "↻", title: "다시 실행" },

    // 전체 지우기
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
    if (btn.id) b.id = btn.id;

    // execCommand 계열
    if (btn.cmd) {
      b.addEventListener("click", () => {
        document.execCommand(btn.cmd, false, null);
        editor.focus();
      });
    }

    // 색상
    if (btn.type === "color") {
      b.addEventListener("click", () => openColorPopup("color"));
    }
    if (btn.type === "bgcolor") {
      b.addEventListener("click", () => openColorPopup("background"));
    }

    // 인용
    if (btn.type === "quote") {
      b.addEventListener("click", () => {
        document.execCommand("formatBlock", false, "blockquote");
      });
    }

    // 코드
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

    // 이미지 (image.js 연동)
    if (btn.type === "image") {
      b.addEventListener("click", () => {
        const file = document.createElement("input");
        file.type = "file";
        file.accept = "image/*";

        file.onchange = () => {
          const reader = new FileReader();
          reader.onload = () => {

            // 1) 삽입
            document.execCommand("insertImage", false, reader.result);

            // 2) 자동 보정
            setTimeout(() => normalizeInsertedImages(), 30);

            // 3) 마지막 이미지 선택 + 핸들 표시
            setTimeout(() => {
              const imgs = document.querySelectorAll("#editor img");
              if (imgs.length > 0) {
                selectImage(imgs[imgs.length - 1]);
              }
            }, 80);
          };
          reader.readAsDataURL(file.files[0]);
        };

        file.click();
      });
    }

    // 전체 지우기
    if (btn.type === "clear") {
      b.addEventListener("click", () => {
        editor.innerHTML = "";
      });
    }

    toolbar.appendChild(b);
  });

  /* -----------------------------------------------------
     3) 드롭다운 3종 (글자체 / 크기 / 줄간격)
  ----------------------------------------------------- */
  initFontDropdown();
  initFontSizeDropdown();
  initLineHeightDropdown();
});


/* -----------------------------------------------------
   4) 공통 inline-style 적용 함수
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
   문단 정규화 엔진 — 줄(line)을 문단(p)으로 교체
----------------------------------------------------- */
function normalizeParagraphs() {
  const editor = document.getElementById("editor");
  if (!editor) return;

  let html = editor.innerHTML;

  // <br>이 여러 개 이어진 것을 하나의 문단으로 변환
  html = html
    .replace(/<br>\s*<br>/g, "</p><p>")
    .replace(/^<br>/, "");

  // <div>로 생긴 문단도 <p>로 통일
  html = html
    .replace(/<div>/g, "<p>")
    .replace(/<\/div>/g, "</p>");

  // 시작이 비어 있으면 <p>로 감싸기
  if (!html.startsWith("<p>")) {
    html = "<p>" + html;
  }
  if (!html.endsWith("</p>")) {
    html += "</p>";
  }

  editor.innerHTML = html;
}

/* -----------------------------------------------------
   줄간격 적용 엔진 (line-height %)
----------------------------------------------------- */
unction applyLineHeight(value) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // 선택 영역의 HTML 복사
  const fragment = range.cloneContents();

  // 선택한 문단만 찾기
  const blocks = fragment.querySelectorAll("p, div, li");

  if (blocks.length === 0) {
    // 선택이 텍스트만 있고 block이 없으면 새 <p>로 감싸기
    const wrapper = document.createElement("p");
    wrapper.style.lineHeight = value;

    const extracted = range.extractContents();
    wrapper.appendChild(extracted);
    range.insertNode(wrapper);
    return;
  }

  // 선택된 문단들만 줄간격 변경
  blocks.forEach(block => {
    block.style.lineHeight = value;
  });

  // 기존 내용 삭제 후 변경된 fragment 삽입
  range.deleteContents();
  range.insertNode(fragment);
}
/* -----------------------------------------------------
   5) 드롭다운 엔진
----------------------------------------------------- */
function initFontDropdown() {
  const select = document.getElementById("fontFamilySelect");
  if (!select) return;

  /* 📌 글자체 옵션 목록 자동 생성 */
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

  /* 글자체 적용 */
  select.addEventListener("change", () => {
    if (select.value) applyInlineStyle("fontFamily", select.value);
  });
}
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
    if (select.value) applyInlineStyle("fontSize", select.value + "px");
  });
}

function initLineHeightDropdown() {
  const select = document.getElementById("lineHeightSelect");
  if (!select) return;

  const values = ["100%", "115%", "150%", "200%", "250%", "300%"];

  values.forEach(v => {
    const op = document.createElement("option");
    op.value = v;
    op.textContent = v;
    select.appendChild(op);
  });

  select.addEventListener("change", () => {
    if (select.value) applyLineHeight(select.value);
});
}
