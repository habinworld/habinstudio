/* ---------------------------------------------------
   post-mode.js    /  2026.01.10
   Ha-Bin Studio — Post Mode Switch
   mode: new | edit | view
---------------------------------------------------- */

(function () {
  const params = new URLSearchParams(location.search);
  const STORAGE_KEY = window.HABIN_STORAGE_KEY;
   
 // 🔑 현재 글 ID (존재 / 비존재, if 없음)
  window.POST_ID = Number(params.get("id")) || null;
  // mode 규칙
  // ?mode=new   → 새 글
  // ?mode=edit  → 수정
  // ?mode=view  → 보기
  const mode = params.get("mode") || "new";
// 🔒 전역 모드 공개 (저장 엔진에서 사용)
  window.POST_MODE = mode;
  // 요소 참조
  const editor = document.getElementById("hb-editor");
  const title  = document.getElementById("hb-title");
 // const btnSave   = document.getElementById("hb-btn-save");----삭제예정
  const btnUpdate = document.getElementById("hb-btn-update");
  btnUpdate &&
  btnUpdate.addEventListener("click", () => {
  if (!window.POST_ID) return;
   const postPage =
    STORAGE_KEY === "habin_posts_en" ? "post.en.html" : "post.html";
   location.href = `${postPage}?mode=edit&id=${window.POST_ID}`;
});
  const btnDelete = document.getElementById("hb-btn-delete");
  const btnCancel = document.getElementById("hb-btn-cancel");
btnCancel &&
  btnCancel.addEventListener("click", () => {
    location.href = window.HABIN_LIST_PAGE;
  });
  const toolbarBasic    = document.getElementById("hb-toolbar-basic");
  const toolbarAdvanced = document.getElementById("hb-toolbar-advanced");

  /* ============================
     공통 초기화 (엑셀 기본값)
  ============================ */
  function resetUI() {
    editor.contentEditable = "false";
    title.readOnly = true;
  }

  /* ============================
     NEW — 새 글
  ============================ */
  function modeNew() {
    editor.contentEditable = "true";
    title.readOnly = false;
  }

  /* ============================
     EDIT — 수정
  ============================ */
  function modeEdit() {
  editor.contentEditable = "true";
  title.readOnly = false;

  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const post = posts.find(p => p.id === window.POST_ID);
  const noticeBox = document.getElementById("hb-notice");

  // 👉 EDIT 1줄 흐름 (본문 → 이미지 → 공지)
  post && (
  editor.innerHTML = post.content || "",
  window.ImageEngine && ImageEngine.renderAll(),
  noticeBox && (noticeBox.style.display = "inline-block",  
    noticeBox.checked = post.isNotice === true)
);
}
  /* ============================
     VIEW — 보기
  ============================ */
  function modeView() {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const post = posts.find(p => p.id === window.POST_ID);

  post && (
    title.value = post.title || "",
    editor.innerHTML = post.content || "",
    window.ImageEngine && ImageEngine.renderAll()
  );

  editor.contentEditable = "false";
  title.readOnly = true;
}

  /* ============================
     MODE SWITCH
  ============================ */
  resetUI();

  mode === "new"  && modeNew();
  mode === "edit" && modeEdit();
  mode === "view" && modeView();

})();


  


