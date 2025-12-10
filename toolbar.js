/* ---------------------------------------------------
   🛠 toolbar.js v7.0 — FULL CONNECTED VERSION
   Ha-Bin Studio — Toolbar Generator + Event Bridge
---------------------------------------------------- */

const Toolbar = (() => {

  let loaded = false;
  const toolbar = document.getElementById("toolbar");

  /* ===============================
        1) 버튼 목록 (하빈 확정 이모지)
  ================================ */
  const btnList = [

    // 글씨체
    { id: "hb-font",      icon: "🅰️",   label: "글씨체" },

    // 글자 크기
    { id: "hb-fontsize",  icon: "🔠",   label: "크기" },

    // 기본 색상 선택
    { id: "hb-color",     icon: "🖌️",   label: "글자색" },
    { id: "hb-bgcolor",   icon: "🎨",   label: "배경색" },

    // 고급 색상
    { id: "hb-advcolor",  icon: "🌈⚒",   label: "고급텍스트" },
    { id: "hb-advbg",     icon: "🌈🎨",  label: "고급배경" },

    // Bold / Italic / Underline
    { id: "hb-bold",      icon: "B",    label: "굵게" },
    { id: "hb-italic",    icon: "I",    label: "기울임" },
    { id: "hb-underline", icon: "U",    label: "밑줄" },

    // 정렬
    { id: "hb-left",      icon: "📎",   label: "왼쪽" },
    { id: "hb-center",    icon: "📐",   label: "가운데" },
    { id: "hb-right",     icon: "📏",   label: "오른쪽" },
    { id: "hb-justify",   icon: "📚",   label: "양쪽" },

    // 리스트
    { id: "hb-ul",        icon: "•",    label: "목록" },
    { id: "hb-ol",        icon: "1.",   label: "번호" },

    // 이미지
    { id: "hb-image",     icon: "🖼️",  label: "이미지" },

    // 이미지 정렬
    { id: "hb-img-left",   icon: "↤",  label: "사진왼쪽" },
    { id: "hb-img-center", icon: "↔",  label: "사진가운데" },
    { id: "hb-img-right",  icon: "↦",  label: "사진오른쪽" },

    // 서식 초기화
    { id: "hb-clear",     icon: "♻️",   label: "초기화" },

    // Undo / Redo
    { id: "hb-undo",      icon: "↩️",   label: "Undo" },
    { id: "hb-redo",      icon: "↪️",   label: "Redo" }
  ];

  /* ===============================
        2) 툴바 자동 생성
  ================================ */
  function buildToolbar() {
    if (loaded) return;
    loaded = true;

    btnList.forEach(btn => {
      const b = document.createElement("button");
      b.id = btn.id;
      b.className = "hb-btn";
      b.innerHTML = btn.icon;
      b.title = btn.label;
      toolbar.appendChild(b);
    });

    /* 이미지 입력용 hidden input */
    const imgInput = document.createElement("input");
    imgInput.type = "file";
    imgInput.accept = "image/*";
    imgInput.id = "hb-image-input";
    imgInput.style.display = "none";
    toolbar.appendChild(imgInput);
  }

  /* ===============================
        3) 버튼 이벤트 연결
  ================================ */
  function bindEvents() {

    /* -------- 글씨체 -------- */
    document.getElementById("hb-font").onclick = () => {
      const f = prompt("글씨체 입력 (예: Gowun Dodum, Nanum Myeongjo)");
      if (f) EditorCore.setFont(f);
    };

    /* -------- 글자 크기 -------- */
    document.getElementById("hb-fontsize").onclick = () => {
      const size = prompt("글자 크기(px) 입력", "18");
      if (size) EditorCore.setFontSize(size);
    };

    /* -------- 기본 색상 -------- */
    document.getElementById("hb-color").onclick = (e) => {
      e.stopPropagation();
      ColorEngine.openPopup(e.target, "text");
    };

    document.getElementById("hb-bgcolor").onclick = (e) => {
      e.stopPropagation();
      ColorEngine.openPopup(e.target, "bg");
    };

    /* -------- 고급 색상 -------- */
    document.getElementById("hb-advcolor").onclick = (e) => {
      e.stopPropagation();
      AdvancedColor.openPopup(e.target, "text");
    };

    document.getElementById("hb-advbg").onclick = (e) => {
      e.stopPropagation();
      AdvancedColor.openPopup(e.target, "bg");
    };

    /* -------- Bold / Italic / Underline -------- */
    document.getElementById("hb-bold").onclick = () => EditorCore.bold();
    document.getElementById("hb-italic").onclick = () => EditorCore.italic();
    document.getElementById("hb-underline").onclick = () => EditorCore.underline();

    /* -------- 텍스트 정렬 -------- */
    document.getElementById("hb-left").onclick = () => EditorCore.alignLeft();
    document.getElementById("hb-center").onclick = () => EditorCore.alignCenter();
    document.getElementById("hb-right").onclick = () => EditorCore.alignRight();
    document.getElementById("hb-justify").onclick = () => EditorCore.alignJustify();

    /* -------- 리스트 -------- */
    document.getElementById("hb-ul").onclick = () => EditorCore.ul();
    document.getElementById("hb-ol").onclick = () => EditorCore.ol();

    /* -------- 이미지 삽입 -------- */
    document.getElementById("hb-image").onclick = () => {
      document.getElementById("hb-image-input").click();
    };
    document.getElementById("hb-image-input").onchange = (e) => {
      if (e.target.files.length > 0) {
        EditorCore.insertImage(e.target.files[0]);
      }
    };

    /* -------- 이미지 정렬 -------- */
    document.getElementById("hb-img-left").onclick = () => EditorCore.imageAlign("left");
    document.getElementById("hb-img-center").onclick = () => EditorCore.imageAlign("center");
    document.getElementById("hb-img-right").onclick = () => EditorCore.imageAlign("right");

    /* -------- 서식 초기화 -------- */
    document.getElementById("hb-clear").onclick = () => EditorCore.clear();

    /* -------- Undo / Redo -------- */
    document.getElementById("hb-undo").onclick = () => EditorCore.undo();
    document.getElementById("hb-redo").onclick = () => EditorCore.redo();
  }

  /* ===============================
        4) 초기 실행
  ================================ */
  buildToolbar();
  bindEvents();

  return { buildToolbar };

})();


 
