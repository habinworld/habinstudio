/* ------------------------------------------------------
   💾 editor-save.js v8.0 (최종 안정판)
   Ha-Bin Studio — LocalStorage Save Engine
------------------------------------------------------- */

const SaveEngine = (() => {

  /* -----------------------------------------
        0) 기본 상태
  ------------------------------------------ */
  const LS_KEY = "habin_posts";
  let posts = JSON.parse(localStorage.getItem(LS_KEY)) || [];

  const url = new URL(location.href);
  const postId = url.searchParams.get("id"); // null=신규, 숫자=수정

  // DOM
  const titleEl  = document.getElementById("hb-title");
  const bodyEl   = document.getElementById("hb-editor");
  const noticeEl = document.getElementById("hb-notice");

  const saveBtn   = document.getElementById("hb-save");
  const updateBtn = document.getElementById("hb-update");
  const deleteBtn = document.getElementById("hb-delete");


  /* -----------------------------------------
        1) 새 글 저장
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
      id: Date.now(),
      title,
      content,
      notice,
      date: getNow()
    };

    posts.push(newPost);
    localStorage.setItem(LS_KEY, JSON.stringify(posts));

    alert("저장되었습니다.");
    location.href = "list.html";
  }


  /* -----------------------------------------
        2) 기존 글 수정
  ------------------------------------------ */
  function update() {

    const idx = posts.findIndex(p => p.id == postId);
    if (idx === -1) {
      alert("글을 찾을 수 없습니다.");
      return;
    }

    const title = titleEl.value.trim();
    const content = bodyEl.innerHTML.trim();
    const notice = noticeEl.checked;

    if (!title) {
      alert("제목을 입력하세요.");
      titleEl.focus();
      return;
    }

    posts[idx].title = title;
    posts[idx].content = content;
    posts[idx].notice = notice;
    posts[idx].date = getNow();  // 수정 시간 갱신

    localStorage.setItem(LS_KEY, JSON.stringify(posts));

    alert("수정되었습니다.");
    location.href = "list.html";
  }


  /* -----------------------------------------
        3) 삭제
  ------------------------------------------ */
  function remove() {

    if (!confirm("정말 삭제하시겠습니까?")) return;

    posts = posts.filter(p => p.id != postId);
    localStorage.setItem(LS_KEY, JSON.stringify(posts));

    alert("삭제되었습니다.");
    location.href = "list.html";
  }


  /* -----------------------------------------
        4) 날짜 문자열 생성
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
        5) UI 초기 설정 (수정모드/신규모드)
  ------------------------------------------ */
  function initMode() {

    if (postId) {
      // 수정 모드
      saveBtn.style.display = "none";
      updateBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    } else {
      // 신규 작성
      saveBtn.style.display = "inline-block";
      updateBtn.style.display = "none";
      deleteBtn.style.display = "none";
    }
  }


  /* -----------------------------------------
        6) 버튼 이벤트 연결
  ------------------------------------------ */
  function bindEvents() {
    saveBtn?.addEventListener("click", save);
    updateBtn?.addEventListener("click", update);
    deleteBtn?.addEventListener("click", remove);
  }


  /* -----------------------------------------
        7) 초기화
  ------------------------------------------ */
  function init() {
    initMode();
    bindEvents();
  }

  init();


  /* -----------------------------------------
        외부 공개
  ------------------------------------------ */
  return {
    save,
    update,
    remove
  };

})();

