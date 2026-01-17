/* ---------------------------------------------------
   post-mode.js    /  2026.01.11
   Ha-Bin Studio — Post Mode Switch
   mode: new | edit | view
---------------------------------------------------- */
(function () {
  const params = new URLSearchParams(location.search);
  const STORAGE_KEY = window.HABIN_STORAGE_KEY;

  // 🧷 BOARD 결정 (단일 진실)
  const board = getBoardFromURL();
   
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
   
 const btnUpdate = document.getElementById("hb-btn-update");
btnUpdate &&
btnUpdate.addEventListener("click", () => {
  if (!window.POST_ID) return;

  location.href =
   `post.html?mode=edit&id=${window.POST_ID}&board=${window.CURRENT_BOARD}`;
});
  const btnDelete = document.getElementById("hb-btn-delete");
  const btnCancel = document.getElementById("hb-btn-cancel");
btnCancel &&
  btnCancel.addEventListener("click", () => {
    const board = getBoardFromURL();
    location.href = window.HABIN_LIST_PAGE + "?board=" + board;
  });
  const toolbarBasic    = document.getElementById("hb-toolbar-basic");
  const toolbarAdvanced = document.getElementById("hb-toolbar-advanced");
 /* ============================
   🖼 VIEW 이미지 렌더 (1단계: 무조건 보이게)
============================ */
function renderImagesInView(post) {
  if (!post.images || !post.images.length) return;

  post.images.forEach(id => {
    const src = ImageStore.load(id);
    if (!src) return;

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.style.margin = "12px 0";

    editor.appendChild(img);
  });
}
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

  if (!post) return;

  editor.innerHTML = post.content || "";
  restoreImagesInEditor(post);   
  window.ImageEngine && ImageEngine.renderAll();
}
  /* ============================
     VIEW — 보기
  ============================ */
  function modeView() {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const post = posts.find(p => p.id === window.POST_ID);

  if (!post) return;

  title.value = post.title || "";
  editor.innerHTML = post.content || "";
  renderImagesInView(post);
  window.ImageEngine && ImageEngine.renderAll();

  editor.contentEditable = "false";
  title.readOnly = true;
}
/* ============================
   🖼 EDIT 이미지 복원
============================ */
function restoreImagesInEditor(post) {
  if (!post.images || !post.images.length) return;

  post.images.forEach(id => {
    const src = ImageStore.load(id);
    if (!src) return;

    ImageEngine.insertFromStore(id, src);
  });
}
   
  /* ============================
     MODE SWITCH
  ============================ */
  resetUI();

  mode === "new"  && modeNew();
  mode === "edit" && modeEdit();
  mode === "view" && modeView();

})();


  


