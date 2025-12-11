/* ------------------------------------------------------
   💾 editor-save.js v8.0 (storage.js 기반 리팩토링판)
   Ha-Bin Studio — Save / Update / Delete Controller
------------------------------------------------------- */

const SaveEngine = (() => {

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
        날짜 생성
  ------------------------------------------ */
  function getNow() {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}`;
  }

  /* -----------------------------------------
        1) 저장
  ------------------------------------------ */
  function save() {
    const title = titleEl.value.trim();
    const content = bodyEl.innerHTML.trim();
    const notice = noticeEl.checked;

    if (!title) {
      alert("제목을 입력하세요.");
      titleEl.focus();
      return;
    }

    const newPost = {
      id: StorageEngine.generateId(),
      title,
      content,
      notice,
      date: getNow()
    };

    StorageEngine.add(newPost);

    alert("저장되었습니다.");
    location.href = "list.html";
  }

  /* -----------------------------------------
        2) 수정
  ------------------------------------------ */
  function update() {
    const title = titleEl.value.trim();
    const content = bodyEl.innerHTML.trim();
    const notice = noticeEl.checked;

    if (!title) {
      alert("제목을 입력하세요.");
      titleEl.focus();
      return;
    }

    const success = StorageEngine.update(postId, {
      title,
      content,
      notice,
      date: getNow()
    });

    if (!success) {
      alert("수정 실패: 글을 찾을 수 없습니다.");
      return;
    }

    alert("수정되었습니다.");
    location.href = "list.html";
  }

  /* -----------------------------------------
        3) 삭제
  ------------------------------------------ */
  function remove() {

    if (!confirm("정말 삭제하시겠습니까?")) return;

    StorageEngine.remove(postId);

    alert("삭제되었습니다.");
    location.href = "list.html";
  }

  /* -----------------------------------------
        4) UI 초기화
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
        5) 이벤트 바인딩
  ------------------------------------------ */
  function bind() {
    saveBtn?.addEventListener("click", save);
    updateBtn?.addEventListener("click", update);
    deleteBtn?.addEventListener("click", remove);
  }

  /* -----------------------------------------
        6) 초기 실행
  ------------------------------------------ */
  (function init() {
    initMode();
    bind();
  })();

})();

