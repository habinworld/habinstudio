/* ---------------------------------------------------
   🛠 toolbar.js v8.0 — UI Link Engine
   Connect Toolbar Buttons ↔ EditorCore (v8.0)
---------------------------------------------------- */

const Toolbar = (() => {

  /* =========================
        1) 버튼 → 함수 매핑
  ========================= */
  const MAP = {
    // 글꼴
    "hb-font": (el) => EditorCore.setFont(el.value),

    // 글자 크기
    "hb-fontsize": (el) => EditorCore.setFontSize(el.value),

    // 줄간격
    "hb-lineheight": (el) => EditorCore.setLineHeight(el.value),

    // 색상
    "hb-color": (el) => ColorBasic.open(el, "text"),
    "hb-bgcolor": (el) => ColorBasic.open(el, "bg"),

    // 고급 색상
    "hb-advcolor": (el) => EditorCore.openAdvancedColor("text", el),
    "hb-advbg": (el) => EditorCore.openAdvancedColor("bg", el),

    // 글자 효과
    "hb-bold": () => EditorCore.bold(),
    "hb-italic": () => EditorCore.italic(),
    "hb-underline": () => EditorCore.underline(),

    // 정렬
    "hb-left": () => EditorCore.alignLeft(),
    "hb-center": () => EditorCore.alignCenter(),
    "hb-right": () => EditorCore.alignRight(),
    "hb-justify": () => EditorCore.alignJustify(),

    // 리스트
    "hb-ul": () => EditorCore.ul(),
    "hb-ol": () => EditorCore.ol(),

    // 서식 초기화
    "hb-clear": () => EditorCore.clearFormat(),

    // Undo / Redo
    "hb-undo": () => EditorCore.undo(),
    "hb-redo": () => EditorCore.redo(),

    // 이미지 삽입
    "hb-image": (el) => {
      const input = document.getElementById("hb-image-input");
      input.click();
    },

    // 이미지 정렬
    "hb-img-left": () => EditorCore.imageAlign("left"),
    "hb-img-center": () => EditorCore.imageAlign("center"),
    "hb-img-right": () => EditorCore.imageAlign("right"),
  };


  /* =========================
        2) 버튼 자동 바인딩
  ========================= */
  function bindEvents() {
    document.querySelectorAll(".hb-btn").forEach(btn => {
      const id = btn.id;

      if (MAP[id]) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          MAP[id](btn);
        });
      }
    });

    /* 이미지 input 이벤트 연결 */
    const imgInput = document.getElementById("hb-image-input");
    if (imgInput) {
      imgInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) EditorCore.insertImage(file);
        imgInput.value = "";
      });
    }
  }


  /* =========================
        3) 초기 실행
  ========================= */
  document.addEventListener("DOMContentLoaded", bindEvents);

  return { bindEvents };

})();

