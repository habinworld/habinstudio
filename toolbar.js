/* ---------------------------------------------------
   🎛 toolbar.js — FINAL Split Edition
   Ha-Bin Studio — BASIC / ADVANCED Toolbar
   구조 확정 / 기능 확장 안전
---------------------------------------------------- */

window.Toolbar = (function () {

  /* =====================================================
     1) 버튼 정의 (헌법 고정)
  ===================================================== */

  // 즉시 실행 — BASIC (1줄)
  const BASIC_BUTTONS = [
    { id: "hb-btn-bold",      label: "B" },
    { id: "hb-btn-italic",    label: "I" },
    { id: "hb-btn-underline", label: "U" },

    { id: "hb-btn-undo", label: "↺", icon: true },
    { id: "hb-btn-redo", label: "↻", icon: true },

    { id: "hb-btn-align-left",   label: "L" },
    { id: "hb-btn-align-center", label: "C" },
    { id: "hb-btn-align-right",  label: "R" },

    { id: "hb-btn-ul", label: "•" },
    { id: "hb-btn-ol", label: "1." }
  ];

  // 설정 / 구조 — ADVANCED (1줄)
  const ADVANCED_BUTTONS = [
   {
  id: "hb-font-family",
  options: [
    { value: "'Gowun Dodum', sans-serif", label: "Gowun" },
    { value: "'Nanum Myeongjo', serif",   label: "Nanum" },
     { value: "'HCR Batang', '함초롱바탕', serif", label: "함초롱" }, 
    { value: "'Noto Serif KR', serif",    label: "Serif" }
  ]
},
{
  id: "hb-font-size",
options: Array.from({ length: 33 }, (_, i) => {
  const size = (i + 4) * 2; // 8 ~ 72 (짝수)
  return {
    value: size,
    label: String(size)
  };
})
},
   {
  id: "hb-line-height",
  options: [
    { value: "1.2", label: "1.2" },
    { value: "1.4", label: "1.4" },
    { value: "1.6", label: "1.6" },
    { value: "1.8", label: "1.8" }
  ]
},

    { id: "hb-btn-color",     label: "🖌️", icon: true },
    { id: "hb-btn-bgcolor",   label: "🎨", icon: true },

    { id: "hb-btn-image",     label: "🖼️", icon: true },
    { id: "hb-btn-img-left",  label: "L" },
    { id: "hb-btn-img-center",label: "C" },
    { id: "hb-btn-img-right", label: "R" }
  ];

  /* =====================================================
     2) 렌더링
  ===================================================== */
function render(containerId, items) {
  const bar = document.getElementById(containerId);
  if (!bar) return; // DOM 안전장치 (헌법 예외)

  items.forEach(item => {

    // 존재하면 생성: select
    item.options && (() => {
      const s = document.createElement("select");
      s.id = item.id;
      s.className = "hb-select";

      item.options.forEach(opt => {
        const o = document.createElement("option");
         // ⭐ 핵심: 객체 / 문자열 둘 다 지원
    const value = (opt && opt.value) || opt;
    const label = (opt && opt.label) || opt;
        o.value = value;
        o.textContent = label;
        s.appendChild(o);
      });

      bar.appendChild(s);
    })();

    // 존재하면 생성: button
    item.label && (() => {
      const b = document.createElement("button");
      b.id = item.id;
      b.className = "hb-btn";

      item.icon && b.classList.add("icon");
      b.textContent = item.label;

      bar.appendChild(b);
    })();

  });

  // 이미지 input (ADVANCED 전용)
  containerId === "hb-toolbar-advanced" && (() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.id = "hb-image-input";
    input.style.display = "none";
    bar.appendChild(input);
  })();
}

  

  /* =====================================================
     3) 바인딩 헬퍼
  ===================================================== */

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  /* =====================================================
     4) 이벤트 연결 (현재 사용 중인 것만)
  ===================================================== */

  function bindEvents() {

    // BASIC
    bind("hb-btn-bold",      () => EditorCore.bold());
    bind("hb-btn-italic",    () => EditorCore.italic());
    bind("hb-btn-underline", () => EditorCore.underline());

    bind("hb-btn-undo", () => EditorCore.undo());
    bind("hb-btn-redo", () => EditorCore.redo());

    bind("hb-btn-align-left",   () => EditorCore.alignLeft());
    bind("hb-btn-align-center", () => EditorCore.alignCenter());
    bind("hb-btn-align-right",  () => EditorCore.alignRight());

    bind("hb-btn-ul", () => EditorCore.ul());
    bind("hb-btn-ol", () => EditorCore.ol());

    // ADVANCED — 자리만 (확장 예정)
    bind("hb-btn-color",   e => EditorCore.openBasicColor(e.target, "text"));
    bind("hb-btn-bgcolor", e => EditorCore.openBasicColor(e.target, "bg"));

    const input = document.getElementById("hb-image-input");
    bind("hb-btn-image", () => input && input.click());

    if (input) {
      input.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) EditorCore.insertImage(file);
        input.value = "";
      });
    }

    bind("hb-btn-img-left",   () => EditorCore.imageAlign("left"));
    bind("hb-btn-img-center", () => EditorCore.imageAlign("center"));
    bind("hb-btn-img-right",  () => EditorCore.imageAlign("right"));
      // ADVANCED — select (폰트 / 크기 / 줄간격)
  const font = document.getElementById("hb-font-family");
  const size = document.getElementById("hb-font-size");
  const line = document.getElementById("hb-line-height");

  // ADVANCED — font family (속도 안정화)
const font = document.getElementById("hb-font-family");

let ffTimer = null;

font && font.addEventListener("change", e => {
  const v = e.target.value;

  if (ffTimer) cancelAnimationFrame(ffTimer);

  ffTimer = requestAnimationFrame(() => {
    EditorCore.setFont(v);
  });
});


  // ADVANCED — font size (속도 안정화)
const size = document.getElementById("hb-font-size");

let fsTimer = null;

size && size.addEventListener("change", e => {
  const v = e.target.value;

  // ⛔ 연속 호출 제거
  if (fsTimer) cancelAnimationFrame(fsTimer);

  // ✅ 다음 프레임 1회만 실행
  fsTimer = requestAnimationFrame(() => {
    EditorCore.setSize(v);
  });
});


  line && line.addEventListener("change", e =>
    EditorCore.setLineHeight(e.target.value)
  );
 
  }

  /* =====================================================
     5) Init
  ===================================================== */
 function init() {
  render("hb-toolbar-basic", BASIC_BUTTONS);
  render("hb-toolbar-advanced", ADVANCED_BUTTONS);
  setTimeout(bindEvents, 0);
}

document.addEventListener("DOMContentLoaded", init);

return { init };

})();

