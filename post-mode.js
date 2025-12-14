/* ---------------------------------------------------
   post-mode.js
   Ha-Bin Studio — Post Mode Switch
   mode: new | edit | view
---------------------------------------------------- */

(function () {
  const params = new URLSearchParams(location.search);

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
  const btnDelete = document.getElementById("hb-btn-delete");
  const btnCancel = document.getElementById("hb-btn-cancel");

  const toolbarBasic    = document.getElementById("hb-toolbar-basic");
  const toolbarAdvanced = document.getElementById("hb-toolbar-advanced");

  /* ============================
     공통 초기화 (엑셀 기본값)
  ============================ */
  function resetUI() {
    editor.contentEditable = "false";
    title.readOnly = true;

    btnSave.style.display   = "none";
    btnUpdate.style.display = "none";
    btnDelete.style.display = "none";

    toolbarBasic.style.display    = "none";
    toolbarAdvanced.style.display = "none";
  }

  /* ============================
     NEW — 새 글
  ============================ */
  function modeNew() {
    editor.contentEditable = "true";
    title.readOnly = false;

    btnSave.style.display = "inline-block";

    toolbarBasic.style.display    = "block";
    toolbarAdvanced.style.display = "block";
  }

  /* ============================
     EDIT — 수정
  ============================ */
  function modeEdit() {
    editor.contentEditable = "true";
    title.readOnly = false;

    btnUpdate.style.display = "inline-block";
    btnDelete.style.display = "inline-block";

    toolbarBasic.style.display    = "block";
    toolbarAdvanced.style.display = "block";
  }

  /* ============================
     VIEW — 보기
  ============================ */
  function modeView() {
    editor.contentEditable = "false";
    title.readOnly = true;

    toolbarBasic.style.display    = "none";
    toolbarAdvanced.style.display = "none";
  }

  /* ============================
     MODE SWITCH
  ============================ */
  resetUI();

  switch (mode) {
    case "edit":
      modeEdit();
      break;
    case "view":
      modeView();
      break;
    default:
      modeNew();
  }

})();


  


