/* --------------------------------------------------------
   toolbar.js v7.0 — Skeleton (Absolute Stable Base)
   - 자동생성 방식
   - 중복생성 차단
   - 이벤트 모듈 분리
   - 팝업/기능은 다른 JS에서 처리
--------------------------------------------------------- */

const ToolbarV7 = (() => {

  let initialized = false;   // 중복 실행 차단용 Lock

  /* -----------------------------
     0. 초기화 진입
  ----------------------------- */
  function init() {
    if (initialized) return;   // 중복 생성 방지
    initialized = true;

    const toolbar = document.getElementById("hb-toolbar");
    if (!toolbar) return console.error("❌ Toolbar element not found.");

    createButtons(toolbar);
    bindEvents();
  }

  /* -----------------------------
     1. 버튼 자동 생성
  ----------------------------- */
  function createButtons(toolbar) {
    toolbar.innerHTML = ""; // 초기화 (안전)

    const btnList = [

      // 글씨체
      { id: "hb-font",     icon: "🅰️", label: "글씨체" },

      // 글자 크기
      { id: "hb-fontsize", icon: "🔠", label: "크기" },

      // 글자색
     { id: "hb-color",    icon: "🖍️", label: "글자색" },

      // 배경색
      { id: "hb-bgcolor",  icon: "🎨", label: "배경" },

      // 굵게 / 기울임 / 밑줄
      { id: "hb-bold",     icon: "B",   label: "굵게" },
      { id: "hb-italic",   icon: "I",   label: "기울임" },
      { id: "hb-underline",icon: "U",   label: "밑줄" },

      // 정렬
      { id: "hb-left",     icon: "📎",  label: "왼쪽" },
      { id: "hb-center",   icon: "📐",  label: "가운데" },
      { id: "hb-right",    icon: "📏",  label: "오른쪽" },
      { id: "hb-justify",  icon: "📚",  label: "양쪽" },

      // 리스트
      { id: "hb-ul",       icon: "•",   label: "목록" },
      { id: "hb-ol",       icon: "1.",  label: "번호" },

      // 이미지 삽입
      { id: "hb-image",    icon: "🖼️", label: "이미지" },

      // 서식 초기화
      { id: "hb-clear",    icon: "♻️", label: "초기화" },

      // Undo / Redo
      { id: "hb-undo",     icon: "↩️", label: "Undo" },
      { id: "hb-redo",     icon: "↪️", label: "Redo" }

    ];

    btnList.forEach(btn => {
      const b = document.createElement("button");
      b.id = btn.id;
      b.className = "hb-tb-btn";
      b.innerHTML = btn.icon;
      b.title = btn.label;

      toolbar.appendChild(b);
    });
  }

  /* -----------------------------
     2. 이벤트 바인딩
     (기능 자체는 다른 JS에서 처리)
  ----------------------------- */
  function bindEvents() {
    const events = [

      // 글씨체 선택
      { id: "hb-font",     action: () => openFontSelector() },

      // 글자 크기
      { id: "hb-fontsize", action: () => openFontSizeSelector() },

      // 색상 팝업
      { id: "hb-color",    action: () => ColorV7.openBasic() },
      { id: "hb-bgcolor",  action: () => ColorV7.openBackground() },

      // 기본 서식
      { id: "hb-bold",     action: () => EditorCore.exec("bold") },
      { id: "hb-italic",   action: () => EditorCore.exec("italic") },
      { id: "hb-underline",action: () => EditorCore.exec("underline") },

      // 정렬
      { id: "hb-left",     action: () => EditorCore.exec("justifyLeft") },
      { id: "hb-center",   action: () => EditorCore.exec("justifyCenter") },
      { id: "hb-right",    action: () => EditorCore.exec("justifyRight") },
      { id: "hb-justify",  action: () => EditorCore.exec("justifyFull") },

      // 리스트
      { id: "hb-ul",       action: () => EditorCore.exec("insertUnorderedList") },
      { id: "hb-ol",       action: () => EditorCore.exec("insertOrderedList") },

      // 이미지
      { id: "hb-image",    action: () => ImageV7.openInsert() },

      // 초기화
      { id: "hb-clear",    action: () => EditorCore.clearFormat() },

      // Undo / Redo
      { id: "hb-undo",     action: () => EditorCore.undo() },
      { id: "hb-redo",     action: () => EditorCore.redo() },
    ];

    events.forEach(ev => {
      const el = document.getElementById(ev.id);
      if (el) el.addEventListener("click", ev.action);
      else console.warn(`⚠️ Toolbar button missing: ${ev.id}`);
    });
  }


  /* -----------------------------
      외부에서 init 호출
  ----------------------------- */
  return { init };

})();

/* -----------------------------
   DOM 로드 후 자동 초기화
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  ToolbarV7.init();
});


 
