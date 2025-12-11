
/* ---------------------------------------------------
   🎛 toolbar.js — FINAL Stable Edition
   Ha-Bin Studio — Toolbar Auto Renderer (window.Toolbar)
   ✔ 이름 완전 통일 / ✔ EditorCore 100% 호환 / ✔ 팝업과 충돌 없음
---------------------------------------------------- */

window.Toolbar = (function () {

  /* =====================================================
        1) 버튼 정의 — (ID는 전역 표준 규칙)
  ===================================================== */
  const BUTTONS = [
    // 글자 스타일
    { id: "hb-btn-bold", label: "B" },
    { id: "hb-btn-italic", label: "I" },
    { id: "hb-btn-underline", label: "U" },

    // 폰트
    { id: "hb-btn-font-gowun", label: "Gowun" },
    { id: "hb-btn-font-nanum", label: "Nanum" },
    { id: "hb-btn-font-serif", label: "Serif" },

    // 글자 크기(px)
    { id: "hb-btn-size-12", label: "12" },
    { id: "hb-btn-size-14", label: "14" },
    { id: "hb-btn-size-16", label: "16" },
    { id: "hb-btn-size-18", label: "18" },
    { id: "hb-btn-size-20", label: "20" },
    { id: "hb-btn-size-24", label: "24" },

    // 줄간격
    { id: "hb-btn-line-14", label: "LH 1.4" },
    { id: "hb-btn-line-16", label: "LH 1.6" },
    { id: "hb-btn-line-18", label: "LH 1.8" },

    // 색상 / 고급색상
    { id: "hb-btn-color", label: "🎨" },
    { id: "hb-btn-bgcolor", label: "🖍" },
    { id: "hb-btn-advcolor", label: "RGB" },
    { id: "hb-btn-advbg", label: "RGBA" },

    // 정렬
    { id: "hb-btn-align-left", label: "↤" },
    { id: "hb-btn-align-center", label: "↔" },
    { id: "hb-btn-align-right", label: "↦" },
    { id: "hb-btn-align-justify", label: "정렬" },

    // 리스트
    { id: "hb-btn-ul", label: "•" },
    { id: "hb-btn-ol", label: "1." },

    // 초기화
    { id: "hb-btn-clear", label: "지우기" },

    // Undo / Redo
    { id: "hb-btn-undo", label: "↺" },
    { id: "hb-btn-redo", label: "↻" },

    // 이미지 삽입 + 정렬
    { id: "hb-btn-image", label: "📷" },
    { id: "hb-btn-img-left", label: "L" },
    { id: "hb-btn-img-center", label: "C" },
    { id: "hb-btn-img-right", label: "R" }
  ];

  /* =====================================================
        2) Toolbar UI 생성
  ===================================================== */
  function render() {
    const bar = document.getElementById("hb-toolbar");
    if (!bar) return;

    BUTTONS.forEach(btn => {
      const el = document.createElement("button");
      el.id = btn.id;
      el.className = "hb-btn";
      el.textContent = btn.label;
      bar.appendChild(el);
    });

    // 이미지 input(hidden)
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "hb-image-input";
    fileInput.style.display = "none";
    bar.appendChild(fileInput);
  }

  /* =====================================================
        3) 바인딩 헬퍼
  ===================================================== */
  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  /* =====================================================
        4) 전체 이벤트 연결
  ===================================================== */
  function bindEvents() {

    // 글자 스타일
    bind("hb-btn-bold",      () => EditorCore.bold());
    bind("hb-btn-italic",    () => EditorCore.italic());
    bind("hb-btn-underline", () => EditorCore.underline());

    // 폰트
    bind("hb-btn-font-gowun", () => EditorCore.setFont("Gowun Dodum"));
    bind("hb-btn-font-nanum", () => EditorCore.setFont("Nanum Myeongjo"));
    bind("hb-btn-font-serif", () => EditorCore.setFont("Noto Serif KR"));

    // 글자 크기
    bind("hb-btn-size-12", () => EditorCore.setSize(12));
    bind("hb-btn-size-14", () => EditorCore.setSize(14));
    bind("hb-btn-size-16", () => EditorCore.setSize(16));
    bind("hb-btn-size-18", () => EditorCore.setSize(18));
    bind("hb-btn-size-20", () => EditorCore.setSize(20));
    bind("hb-btn-size-24", () => EditorCore.setSize(24));

    // 줄간격
    bind("hb-btn-line-14", () => EditorCore.setLineHeight("1.4"));
    bind("hb-btn-line-16", () => EditorCore.setLineHeight("1.6"));
    bind("hb-btn-line-18", () => EditorCore.setLineHeight("1.8"));

    // 기본색 / 배경색
    bind("hb-btn-color",    e => EditorCore.openBasicColor(e.target, "text"));
    bind("hb-btn-bgcolor",  e => EditorCore.openBasicColor(e.target, "bg"));

    // 고급색상
    bind("hb-btn-advcolor", e => EditorCore.openAdvancedColor(e.target, "text"));
    bind("hb-btn-advbg",    e => EditorCore.openAdvancedColor(e.target, "bg"));

    // 정렬
    bind("hb-btn-align-left",    () => EditorCore.alignLeft());
    bind("hb-btn-align-center",  () => EditorCore.alignCenter());
    bind("hb-btn-align-right",   () => EditorCore.alignRight());
    bind("hb-btn-align-justify", () => EditorCore.alignJustify());

    // 리스트
    bind("hb-btn-ul", () => EditorCore.ul());
    bind("hb-btn-ol", () => EditorCore.ol());

    // 초기화
    bind("hb-btn-clear", () => EditorCore.clear());

    // Undo / Redo
    bind("hb-btn-undo", () => EditorCore.undo());
    bind("hb-btn-redo", () => EditorCore.redo());

    // 이미지 삽입
    const input = document.getElementById("hb-image-input");
    bind("hb-btn-image", () => input.click());

    if (input) {
      input.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) EditorCore.insertImage(file);
        input.value = "";
      });
    }

    // 이미지 정렬
    bind("hb-btn-img-left",   () => EditorCore.imageAlign("left"));
    bind("hb-btn-img-center", () => EditorCore.imageAlign("center"));
    bind("hb-btn-img-right",  () => EditorCore.imageAlign("right"));
  }

  /* =====================================================
        5) Init
  ===================================================== */
  function init() {
    render();
    setTimeout(bindEvents, 0);
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init };

})();

