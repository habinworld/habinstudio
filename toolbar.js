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
  popup: true, 
  label: "글자체",     
  options: [
  { value: "'Noto Sans KR', sans-serif", label: "고딕 (Noto)" },
  { value: "'Nanum Gothic', sans-serif", label: "고딕 (나눔)" },
  { value: "'Gowun Dodum', sans-serif", label: "고딕 (고운)" },
  { value: "'Nanum Myeongjo', serif", label: "명조 (나눔)" },
  { value: "'HCR Batang', '함초롱바탕', serif", label: "명조 (함초롱)" }
  ]
},
{
  id: "hb-font-size",
  popup: true, 
  label: "크 기",    
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
  popup: true, 
  label: "줄간격", 
  options: [
    ...Array.from({ length: 20 }, (_, i) => {
      const h = (i + 6) / 5; // 1.2 ~ 5.0 (0.2 단위)
      return {
        value: String(h),
        label: h.toFixed(1)
      };
    }),
    { value: "null", label: "기본" } // ← 중요 (문자열 null)
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
      // ⭐ 핵심: popup이면 버튼 ID를 분리
      b.id = item.popup ? `${item.id}-btn` : item.id; 
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
      // ADVANCED — select (폰트 / 크기 / 줄간격,글자색, 배경색)
  const font = document.getElementById("hb-font-family");
const size = document.getElementById("hb-font-size");
const line = document.getElementById("hb-line-height");
const btnColor = document.getElementById("hb-btn-color");
const btnBgColor = document.getElementById("hb-btn-bgcolor");

/* -------------------------------
   font-family (속도 안정화)
-------------------------------- */
let ffTimer = null;

font && font.addEventListener("change", e => {
  const v = e.target.value;
  if (ffTimer) cancelAnimationFrame(ffTimer);

  ffTimer = requestAnimationFrame(() => {
    EditorCore.setFont(v);
  });
});
const fontBtn = document.getElementById("hb-font-family-btn");
const fontSel = document.getElementById("hb-font-family");

fontBtn && fontSel && fontBtn.addEventListener("click", e => {
  e.stopPropagation();
  const r = fontBtn.getBoundingClientRect();

  Popup.openAt(
    r.left,
    r.bottom,
    fontSel.options
      ? Array.from(fontSel.options).map(o => ({
          value: o.value,
          label: o.textContent
        }))
      : [],
    value => {
      fontSel.value = value;
      EditorCore.setFont(value);
    }
  );
});
/* -------------------------------
   font-size (속도 안정화)
-------------------------------- */
let fsTimer = null;

size && size.addEventListener("change", e => {
  const v = e.target.value;
  if (fsTimer) cancelAnimationFrame(fsTimer);

  fsTimer = requestAnimationFrame(() => {
    EditorCore.setSize(v);
  });
});
  const sizeBtn = document.getElementById("hb-font-size-btn");
const sizeSel = document.getElementById("hb-font-size");

sizeBtn && sizeSel && sizeBtn.addEventListener("click", e => {
  e.stopPropagation();
  const r = sizeBtn.getBoundingClientRect();

  Popup.openAt(
    r.left,
    r.bottom,
    Array.from(sizeSel.options).map(o => ({
      value: o.value,
      label: o.textContent
    })),
    value => {
      sizeSel.value = value;
      EditorCore.setSize(value);
    }
  );
});   
/* -------------------------------
   line-height (속도 + 안정 통일)
-------------------------------- */
let lhTimer = null;

line && line.addEventListener("change", e => {
  const v = e.target.value;
  if (lhTimer) cancelAnimationFrame(lhTimer);

  lhTimer = requestAnimationFrame(() => {
    EditorCore.setLineHeight(v);
  });
});
const lineBtn = document.getElementById("hb-line-height-btn");
const lineSel = document.getElementById("hb-line-height");

lineBtn && lineSel && lineBtn.addEventListener("click", e => {
  e.stopPropagation();
  const r = lineBtn.getBoundingClientRect();

  Popup.openAt(
    r.left,
    r.bottom,
    Array.from(lineSel.options).map(o => ({
      value: o.value,
      label: o.textContent
    })),
    value => {
      lineSel.value = value;
      EditorCore.setLineHeight(value === "null" ? null : value);
    }
  );
});
     // 글자색
btnColor && btnColor.addEventListener("click", e => {
  e.stopPropagation();
  const r = btnColor.getBoundingClientRect();
  ColorBasicEngine.openAt(r.left, r.bottom, "text");
});

     // 배경색
btnBgColor && btnBgColor.addEventListener("click", e => {
  e.stopPropagation();
   // ⭐ 여기 추가 (selection 저장)
  EditorCore.saveBgRange();

  const r = btnBgColor.getBoundingClientRect();
  ColorBasicEngine.openAt(r.left, r.bottom, "bg");
});
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

