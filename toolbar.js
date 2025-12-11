/* ---------------------------------------------------
   🎛 toolbar.js v8.1 (Auto Render + Bind)
   Ha-Bin Studio — Toolbar UI + EditorCore 연결
---------------------------------------------------- */

window.Toolbar = (() => {

  /* ====================================================
        1) 버튼 정의 테이블 (자동 생성용)
  ==================================================== */
  const BUTTONS = [
    // 글자 스타일
    { id: "hb-bold", label: "B" },
    { id: "hb-italic", label: "I" },
    { id: "hb-underline", label: "U" },

    // 폰트
    { id: "hb-font-gowun", label: "Gowun" },
    { id: "hb-font-nanum", label: "Nanum" },
    { id: "hb-font-serif", label: "Serif" },

    // 글씨 크기
    { id: "hb-size-12", label: "12" },
    { id: "hb-size-14", label: "14" },
    { id: "hb-size-16", label: "16" },
    { id: "hb-size-18", label: "18" },
    { id: "hb-size-20", label: "20" },
    { id: "hb-size-24", label: "24" },

    // 줄간격
    { id: "hb-line-14", label: "LH 1.4" },
    { id: "hb-line-16", label: "LH 1.6" },
    { id: "hb-line-18", label: "LH 1.8" },

    // 색상
    { id: "hb-color", label: "🎨색" },
    { id: "hb-bgcolor", label: "🖍배경" },
    { id: "hb-advcolor", label: "RGB" },
    { id: "hb-advbg", label: "RGBA" },

    // 정렬
    { id: "hb-align-left", label: "↤" },
    { id: "hb-align-center", label: "↔" },
    { id: "hb-align-right", label: "↦" },
    { id: "hb-align-justify", label: "정렬" },

    // 리스트
    { id: "hb-ul", label: "• 목록" },
    { id: "hb-ol", label: "1. 목록" },

    // 기본 서식
    { id: "hb-clear", label: "지우기" },

    // Undo / Redo
    { id: "hb-undo", label: "↺" },
    { id: "hb-redo", label: "↻" },

    // 이미지
    { id: "hb-image", label: "📷" },
    { id: "hb-img-left", label: "L" },
    { id: "hb-img-center", label: "C" },
    { id: "hb-img-right", label: "R" }
  ];

  /* ====================================================
        2) toolbar UI 자동 생성
  ==================================================== */
  function render() {
    const bar = document.getElementById("hb-toolbar");
    if (!bar) return;

    bar.classList.add("hb-toolbar");

    BUTTONS.forEach(btn => {
      const el = document.createElement("button");
      el.id = btn.id;
      el.className = "hb-btn";
      el.textContent = btn.label;
      bar.appendChild(el);
    });

    // 이미지 input(hidden) 추가
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "hb-image-input";
    fileInput.style.display = "none";
    bar.appendChild(fileInput);
  }

  /* ====================================================
        3) 버튼 → EditorCore 바인딩
  ==================================================== */
  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  function bindEvents() {

    // 글자 스타일
    bind("hb-bold", () => EditorCore.bold());
    bind("hb-italic", () => EditorCore.italic());
    bind("hb-underline", () => EditorCore.underline());

    // 폰트
    bind("hb-font-gowun", () => EditorCore.setFont("Gowun Dodum"));
    bind("hb-font-nanum", () => EditorCore.setFont("Nanum Myeongjo"));
    bind("hb-font-serif", () => EditorCore.setFont("Noto Serif KR"));

    // 글자 크기
    bind("hb-size-12", () => EditorCore.setSize(12));
    bind("hb-size-14", () => EditorCore.setSize(14));
    bind("hb-size-16", () => EditorCore.setSize(16));
    bind("hb-size-18", () => EditorCore.setSize(18));
    bind("hb-size-20", () => EditorCore.setSize(20));
    bind("hb-size-24", () => EditorCore.setSize(24));

    // 줄간격
    bind("hb-line-14", () => EditorCore.setLineHeight("1.4"));
    bind("hb-line-16", () => EditorCore.setLineHeight("1.6"));
    bind("hb-line-18", () => EditorCore.setLineHeight("1.8"));

    // 기본 색상 / 고급색상
    bind("hb-color", (e) => EditorCore.openBasicColor(e.target, "text"));
    bind("hb-bgcolor", (e) => EditorCore.openBasicColor(e.target, "bg"));
    bind("hb-advcolor", (e) => EditorCore.openAdvancedColor(e.target, "text"));
    bind("hb-advbg", (e) => EditorCore.openAdvancedColor(e.target, "bg"));

    // 정렬
    bind("hb-align-left", () => EditorCore.alignLeft());
    bind("hb-align-center", () => EditorCore.alignCenter());
    bind("hb-align-right", () => EditorCore.alignRight());
    bind("hb-align-justify", () => EditorCore.alignJustify());

    // 리스트
    bind("hb-ul", () => EditorCore.ul());
    bind("hb-ol", () => EditorCore.ol());

    // 서식 초기화
    bind("hb-clear", () => EditorCore.clear());

    // Undo / Redo
    bind("hb-undo", () => EditorCore.undo());
    bind("hb-redo", () => EditorCore.redo());

    // 이미지
    const input = document.getElementById("hb-image-input");
    bind("hb-image", () => input.click());

    if (input) {
      input.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) EditorCore.insertImage(file);
        input.value = "";
      });
    }

    bind("hb-img-left", () => EditorCore.imageAlign("left"));
    bind("hb-img-center", () => EditorCore.imageAlign("center"));
    bind("hb-img-right", () => EditorCore.imageAlign("right"));
  }

  /* ====================================================
        최초 실행
  ==================================================== */
  function init() {
    render();
    setTimeout(bindEvents, 0); // 렌더 후 바인딩
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init };

})();



