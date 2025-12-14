/* ---------------------------------------------------
   post-mode.js
   Ha-Bin Studio — Post Mode Switch
   mode: new | edit | view
---------------------------------------------------- */

(function () {
  const params = new URLSearchParams(location.search);
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

  const btnSave   = document.getElementById("hb-btn-save");
  const btnUpdate = document.getElementById("hb-btn-update");
   btnUpdate &&
  btnUpdate.addEventListener("click", () => {
    window.POST_ID &&
      (location.href = `post.html?mode=edit&id=${window.POST_ID}`);
  });
  const btnDelete = document.getElementById("hb-btn-delete");
  const btnCancel = document.getElementById("hb-btn-cancel");
btnCancel &&
  btnCancel.addEventListener("click", () => {
    location.href = "list.html";
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
  }

  /* ============================
     VIEW — 보기
  ============================ */
  function modeView() {
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


  


