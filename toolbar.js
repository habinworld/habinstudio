/* ---------------------------------------------------
   🎛 toolbar.js — FINAL Split Edition
   Ha-Bin Studio — BASIC / ADVANCED Toolbar
   구조 확정 / 기능 확장 안전            26. 5. 5
---------------------------------------------------- */
window.Toolbar = (function () {
   const EditorCore = window.EditorCore;

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
  { value: "'Noto Sans KR', sans-serif", label: "고딕" },
  { value: "'Nanum Gothic', sans-serif", label: "나눔" },
  { value: "'Gowun Dodum', sans-serif", label: "고운" },
  { value: "'Nanum Myeongjo', serif", label: "명조" },
  { value: "'HCR Batang', '함초롱바탕', serif", label: "함초롱" },
  { value: "'Gulim', '굴림', sans-serif", label: "굴림" },
  { value: "'Dotum', '돋움', sans-serif", label: "돋움" },
  { value: "'Gungsuh', '궁서', serif", label: "궁서" },
  { value: "'Batang', '바탕', serif", label: "바탕" },
  { value: "'Arial', sans-serif", label: "Arial" },
  { value: "'Times New Roman', serif", label: "Times" }    
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
// ===============================
// 📏 Line-height Toolbar
// ===============================

{
  id: "hb-line-height",
  popup: true,
  label: "1.0",
  options: [
    { value: "1.0", label: "1.0" },
    { value: "1.2", label: "1.2" },
    { value: "1.4", label: "1.4" },
    { value: "1.6", label: "1.6" },
    { value: "1.8", label: "1.8" },
    { value: "2.0", label: "2.0" },
    { value: "2.2", label: "2.2" },
    { value: "2.4", label: "2.4" },
    { value: "2.6", label: "2.6" },
    { value: "2.8", label: "2.8" },
    { value: "3.0", label: "3.0" }
  ]
},

   { 
  id: "hb-btn-color", 
  label: '🖌️ <span class="hb-color-chip" id="hb-current-text"></span>', 
  icon: true, 
  popup: true 
},

{ 
  id: "hb-btn-bgcolor", 
  label: '🎨 <span class="hb-color-chip" id="hb-current-bg"></span>', 
  icon: true, 
  popup: true 
},

    { id: "hb-btn-image",     label: "🖼️", icon: true },
    { id: "hb-btn-img-left",  label: "L" },
    { id: "hb-btn-img-center",label: "C" },
    { id: "hb-btn-img-right", label: "R" },
    { id: "hb-btn-img-delete", label: "DEL" },
  ];
 
  /* =====================================================
     2) 렌더링
  ===================================================== */
function render(containerId, items) {
  const bar = document.getElementById(containerId);
  if (!bar) return; // DOM 안전장치 (헌법 예외)

  items.forEach(item => {

    // 존재하면 생성: select
    item.options && item.id !== "hb-line-height" && (() => {
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
      b.innerHTML = item.label;

      bar.appendChild(b);
       
    })();
  });
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

   // 이미지 버튼 → 즉시 input 클릭 (존재/비존재)
 bind("hb-btn-image", () => {
  document.getElementById("hb-image-input")?.click();
});
   // 이미지 정렬,삭제
  bind("hb-btn-img-left",   () => EditorCore.imageAlign("left"));
  bind("hb-btn-img-center", () => EditorCore.imageAlign("center"));
  bind("hb-btn-img-right",  () => EditorCore.imageAlign("right"));
  bind("hb-btn-img-delete", () => EditorCore.removeImage());

  /* ---------- ADVANCED ---------- */

  const font = document.getElementById("hb-font-family");
  const size = document.getElementById("hb-font-size");
  const line = document.getElementById("hb-line-height");
  const btnColor = document.getElementById("hb-btn-color-btn");
  const btnBgColor = document.getElementById("hb-btn-bgcolor-btn");

/* -------------------------------
   font-family (속도 안정화)
-------------------------------- */
font && font.addEventListener("change", e => {
  const v = e.target.value;
  EditorCore.setFont(v);
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

/* ===============================
   📏 Line-height Toolbar (Final)
================================ */
const lhBtn = document.getElementById("hb-line-height-btn");
const LH_OPTIONS = [
  "1.0","1.2","1.4","1.6","1.8",
  "2.0","2.2","2.4","2.6","2.8","3.0"
];

lhBtn && lhBtn.addEventListener("mousedown", e => {
  e.preventDefault();
  e.stopPropagation();

  const r = lhBtn.getBoundingClientRect();

  Popup.openAt(
    r.left,
    r.bottom,
    LH_OPTIONS.map(v => ({ value: v, label: v })),
    v => {
      EditorCore.requestLineHeight(v);
       const lineBtn = document.getElementById("hb-line-height-btn");
  lineBtn && (lineBtn.innerHTML = v + " ▼");

  setTimeout(hbUpdateToolbarState, 0); 
    }
  );
});
/* =====================================================
   COLOR — Toolbar (MODE Entry Only)
   역할:
   - 색상 UI 진입만 담당
   - 판단 / 적용 / 팝업 제어 ❌
===================================================== */

btnColor && btnColor.addEventListener("click", e => {
  e.stopPropagation();
  openTextColorUI(btnColor, HB_COLOR_POPUP);
});

btnBgColor && btnBgColor.addEventListener("click", e => {
  e.stopPropagation();
  openBgColorUI(btnBgColor, HB_COLOR_POPUP);
});
 }  
  /* =====================================================
     5) Init
  ===================================================== */
 function init() {
  render("hb-toolbar-basic", BASIC_BUTTONS);
  render("hb-toolbar-advanced", ADVANCED_BUTTONS);
  bindEvents();
  hbSetInitialToolbarLabels();  
  document.addEventListener("selectionchange", hbupdateToolbarState);  
}

return { init };

})();

