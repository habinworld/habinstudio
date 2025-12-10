/* ------------------------------------------------------
   📥 editor-load.js v8.0 (storage.js 기반 리팩토링판)
   Ha-Bin Studio — Load Controller
------------------------------------------------------- */

const LoadEngine = (() => {

  const url = new URL(location.href);
  const postId = url.searchParams.get("id");

  // DOM
  const titleEl  = document.getElementById("hb-title");
  const bodyEl   = document.getElementById("hb-editor");
  const noticeEl = document.getElementById("hb-notice");

  const saveBtn   = document.getElementById("hb-save");
  const updateBtn = document.getElementById("hb-update");
  const deleteBtn = document.getElementById("hb-delete");

  /* -----------------------------------------
        1) 글 로드
  ------------------------------------------ */
  function load() {

    if (!postId) return;

    const post = StorageEngine.get(postId);
    if (!post) {
      alert("글 데이터를 불러올 수 없습니다.");
      return;
    }

    titleEl.value = post.title || "";
    bodyEl.innerHTML = post.content || "";
    noticeEl.checked = !!post.notice;
  }

  /* -----------------------------------------
        2) 버튼 UI 설정
  ------------------------------------------ */
  function initMode() {
    if (postId) {
      saveBtn.style.display   = "none";
      updateBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    } else {
      saveBtn.style.display   = "inline-block";
      updateBtn.style.display = "none";
      deleteBtn.style.display = "none";
    }
  }

  /* -----------------------------------------
        초기화
  ------------------------------------------ */
  (function init() {
    initMode();
    load();
  })();

})();

  

