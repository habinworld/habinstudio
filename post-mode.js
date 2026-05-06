/* ---------------------------------------------------
   post-mode.js    /  2026.05.05
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

const isAdmin = window.HABIN_IS_ADMIN === true;
// view가 아니고 + 관리자가 아니면 차단
!isAdmin && mode !== "view" &&
  (location.href = window.HABIN_LIST_PAGE + "?board=" + board);   
   
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
  // 🔥 이 줄이 핵심
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
    ImageStore.load(id).then(src => {
      if (!src) return;

      // insertFromStore를 쓸 거면 "Promise 이후"에 넣어야 함
      window.ImageEngine && ImageEngine.insertFromStore && ImageEngine.insertFromStore(id, src);
    });
  });
}
   
  /* ============================
     MODE SWITCH
  ============================ */
  resetUI();

  mode === "new"  && modeNew();
  mode === "edit" && modeEdit();
  mode === "view" && modeView();
   
  // 🔒 관리자 버튼 최종 표시 제어
const isAdminFinal =
  localStorage.getItem("habin_admin") === "true";

["hb-btn-save", "hb-btn-update", "hb-btn-delete"].forEach(id => {
  const btn = document.getElementById(id);
  btn && (btn.style.display = isAdminFinal ? "inline-flex" : "none");
});
})();

  


