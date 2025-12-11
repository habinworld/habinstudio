
/* ---------------------------------------------------
   🎛 toolbar.js v8.0 — 안정판 (No import!)
   Ha-Bin Studio — UI → EditorCore 연결 엔진
---------------------------------------------------- */

const Toolbar = (() => {

  function bind(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  }

  /* ===============================
        텍스트 스타일
  =============================== */
  bind("hb-bold", () => EditorCore.bold());
  bind("hb-italic", () => EditorCore.italic());
  bind("hb-underline", () => EditorCore.underline());

  /* ===============================
        글씨체
  =============================== */
  bind("hb-font-gowun", () => EditorCore.setFont("Gowun Dodum"));
  bind("hb-font-nanum", () => EditorCore.setFont("Nanum Myeongjo"));
  bind("hb-font-serif", () => EditorCore.setFont("Noto Serif KR"));

  /* ===============================
        글자 크기
  =============================== */
  bind("hb-size-12", () => EditorCore.setSize(12));
  bind("hb-size-14", () => EditorCore.setSize(14));
  bind("hb-size-16", () => EditorCore.setSize(16));
  bind("hb-size-18", () => EditorCore.setSize(18));
  bind("hb-size-20", () => EditorCore.setSize(20));
  bind("hb-size-24", () => EditorCore.setSize(24));

  /* ===============================
        줄간격
  =============================== */
  bind("hb-line-14", () => EditorCore.setLineHeight("1.4"));
  bind("hb-line-16", () => EditorCore.setLineHeight("1.6"));
  bind("hb-line-18", () => EditorCore.setLineHeight("1.8"));

  /* ===============================
        색상 — 기본
  =============================== */
  bind("hb-color", (e) => EditorCore.openBasicColor(e.target, "text"));
  bind("hb-bgcolor", (e) => EditorCore.openBasicColor(e.target, "bg"));

  /* ===============================
        색상 — 고급
  =============================== */
  bind("hb-advcolor", (e) => EditorCore.openAdvancedColor(e.target, "text"));
  bind("hb-advbg", (e) => EditorCore.openAdvancedColor(e.target, "bg"));

  /* ===============================
        정렬
  =============================== */
  bind("hb-align-left", () => EditorCore.alignLeft());
  bind("hb-align-center", () => EditorCore.alignCenter());
  bind("hb-align-right", () => EditorCore.alignRight());
  bind("hb-align-justify", () => EditorCore.alignJustify());

  /* ===============================
        리스트
  =============================== */
  bind("hb-ul", () => EditorCore.ul());
  bind("hb-ol", () => EditorCore.ol());

  /* ===============================
        서식 초기화
  =============================== */
  bind("hb-clear", () => EditorCore.clear());

  /* ===============================
        Undo / Redo
  =============================== */
  bind("hb-undo", () => EditorCore.undo());
  bind("hb-redo", () => EditorCore.redo());

  /* ===============================
        이미지 업로드
  =============================== */
  const imgInput = document.getElementById("hb-image-input");
  if (imgInput) {
    imgInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) EditorCore.insertImage(file);
      imgInput.value = "";
    });
  }

  bind("hb-image", () => imgInput?.click());
  bind("hb-img-left", () => EditorCore.imageAlign("left"));
  bind("hb-img-center", () => EditorCore.imageAlign("center"));
  bind("hb-img-right", () => EditorCore.imageAlign("right"));

  /* ===============================
        저장 / 불러오기
  =============================== */
  bind("hb-save", () => EditorCore.save("habin_post"));
  bind("hb-load", () => EditorCore.load("habin_post"));

  return {};

})();

/* ===============================
   초기화 (DOM 생성 후 실행)
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Toolbar v8.0 Ready");
});

