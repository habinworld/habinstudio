/* -----------------------------------------------------
   🎛 toolbar.js v8.0 — Modular Toolbar Renderer
   Ha-Bin Studio (Excel Layout Model)
------------------------------------------------------ */

const Toolbar = (() => {

  let built = false;              // 중복 생성 방지
  const toolbar = document.getElementById("hb-toolbar");

  /* =====================================================
       1) 버튼 리스트 (v8.0, 완전 모듈형)
  ===================================================== */
  const BUTTONS = [
    // 글씨체
    { id: "hb-font", icon: "🅰️", hint: "글씨체" },

    // 글자 크기
    { id: "hb-fontsize", icon: "🔠", hint: "글자크기" },

    // 색상
    { id: "hb-color-basic", icon: "🖌️", hint: "기본색" },
    { id: "hb-color-bg",    icon: "🎨", hint: "배경색" },

    // 고급 색상
    { id: "hb-color-adv", icon: "🌈", hint: "고급텍스트" },
    { id: "hb-bg-adv",    icon: "🌈🎨", hint: "고급배경" },

    // Bold / Italic / Underline
    { id: "hb-bold", icon: "B", hint: "굵게" },
    { id: "hb-italic", icon: "I", hint: "기울임" },
    { id: "hb-underline", icon: "U", hint: "밑줄" },

    // 정렬
    { id: "hb-left", icon: "📎", hint: "왼쪽정렬" },
    { id: "hb-center", icon: "📐", hint: "가운데" },
    { id: "hb-right", icon: "📏", hint: "오른쪽" },
    { id: "hb-justify", icon: "📚", hint: "양쪽정렬" },

    // 리스트
    { id: "hb-ul", icon: "•", hint: "순서없는 목록" },
    { id: "hb-ol", icon: "1.", hint: "번호 목록" },

    // 이미지 삽입
    { id: "hb-image-insert", icon: "🖼️", hint: "이미지" },

    // 이미지 정렬
    { id: "hb-img-left", icon: "↤", hint: "이미지 왼쪽" },
    { id: "hb-img-center", icon: "↔", hint: "이미지 가운데" },
    { id: "hb-img-right", icon: "↦", hint: "이미지 오른쪽" },

    // 서식 초기화
    { id: "hb-clear", icon: "♻️", hint: "서식 초기화" },

    // Undo / Redo
    { id: "hb-undo", icon: "↩️", hint: "Undo" },
    { id: "hb-redo", icon: "↪️", hint: "Redo" }
  ];


  /* =====================================================
       2) Toolbar 자동 생성
  ===================================================== */
  function build() {
    if (built) return;
    built = true;

    BUTTONS.forEach(btn => {
      const B = document.createElement("button");
      B.className = "hb-btn";
      B.id = btn.id;
      B.innerHTML = btn.icon;
      B.title = btn.hint;
      toolbar.appendChild(B);
    });

    // 이미지 입력 hidden input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.id = "hb-image-file";
    input.style.display = "none";
    toolbar.appendChild(input);
  }


  /* =====================================================
       3) 이벤트 연결 – EditorCore + Color + Image 모듈과 연결
  ===================================================== */
  function bind() {

    /* ---------- 글씨체 ---------- */
    document.getElementById("hb-font").onclick = () => {
      const font = prompt("글씨체 입력 (예: Gowun Dodum)");
      if (font) EditorCore.setFont(font);
    };

    /* ---------- 글자크기 ---------- */
    document.getElementById("hb-fontsize").onclick = () => {
      const px = prompt("글자 크기(px)", "18");
      if (px) EditorCore.setFontSize(px);
    };

    /* ---------- 기본 색상 ---------- */
    document.getElementById("hb-color-basic").onclick = (e) => {
      ColorBasic.open(e.target, "text");
    };
    document.getElementById("hb-color-bg").onclick = (e) => {
      ColorBasic.open(e.target, "bg");
    };

    /* ---------- 고급 색상 ---------- */
    document.getElementById("hb-color-adv").onclick = (e) => {
      ColorAdvanced.open(e.target, "text");
    };
    document.getElementById("hb-bg-adv").onclick = (e) => {
      ColorAdvanced.open(e.target, "bg");
    };

    /* ---------- Bold / Italic / Underline ---------- */
    document.getElementById("hb-bold").onclick = () => EditorCore.bold();
    document.getElementById("hb-italic").onclick = () => EditorCore.italic();
    document.getElementById("hb-underline").onclick = () => EditorCore.underline();

    /* ---------- 정렬 ---------- */
    document.getElementById("hb-left").onclick = () => EditorCore.alignLeft();
    document.getElementById("hb-center").onclick = () => EditorCore.alignCenter();
    document.getElementById("hb-right").onclick = () => EditorCore.alignRight();
    document.getElementById("hb-justify").onclick = () => EditorCore.alignJustify();

    /* ---------- 리스트 ---------- */
    document.getElementById("hb-ul").onclick = () => EditorCore.ul();
    document.getElementById("hb-ol").onclick = () => EditorCore.ol();

    /* ---------- 이미지 삽입 ---------- */
    document.getElementById("hb-image-insert").onclick = () => {
      document.getElementById("hb-image-file").click();
    };
    document.getElementById("hb-image-file").onchange = e => {
      if (e.target.files.length > 0) {
        EditorCore.insertImage(e.target.files[0]);
        e.target.value = "";
      }
    };

    /* ---------- 이미지 정렬 ---------- */
    document.getElementById("hb-img-left").onclick   = () => EditorCore.imageAlign("left");
    document.getElementById("hb-img-center").onclick = () => EditorCore.imageAlign("center");
    document.getElementById("hb-img-right").onclick  = () => EditorCore.imageAlign("right");

    /* ---------- 초기화 ---------- */
    document.getElementById("hb-clear").onclick = () => EditorCore.clear();

    /* ---------- Undo / Redo ---------- */
    document.getElementById("hb-undo").onclick = () => EditorCore.undo();
    document.getElementById("hb-redo").onclick = () => EditorCore.redo();
  }


  /* =====================================================
       4) 초기화
  ===================================================== */
  build();
  bind();

  return { build };
})();


 
