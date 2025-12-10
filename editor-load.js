/* ------------------------------------------------------
   📥 editor-load.js v8.0 — Ha-Bin Studio Load Engine
   글 불러오기 / 수정 모드 초기화 (독립 실행)
------------------------------------------------------- */

const LoadEngine = (() => {

  /* ----------------------------------------
        0) 기본 구성
  ----------------------------------------- */

  const LS_KEY = "habin_posts";
  const posts = JSON.parse(localStorage.getItem(LS_KEY)) || [];

  const url = new URL(location.href);
  const postId = url.searchParams.get("id"); // null이면 신규, 값 있으면 수정

  // DOM
  const titleEl  = document.getElementById("hb-title");
  const bodyEl   = document.getElementById("hb-editor");
  const noticeEl = document.getElementById("hb-notice");

  const saveBtn   = document.getElementById("hb-save");
  const updateBtn = document.getElementById("hb-update");
  const deleteBtn = document.getElementById("hb-delete");


  /* ----------------------------------------
        1) 글 로드
  ----------------------------------------- */
  function loadPost() {

    if (!postId) return; // 신규 작성이면 스킵

    const post = posts.find(p => p.id == postId);
    if (!post) {
      alert("글을 불러올 수 없습니다.");
      return;
    }

    // 제목 / 본문 / 공지 로드
    titleEl.value = post.title || "";
    bodyEl.innerHTML = post.content || "";
    noticeEl.checked = post.notice ? true : false;
  }


  /* ----------------------------------------
        2) UI 버튼 상태 설정
  ----------------------------------------- */
  function setButtons() {

    if (!postId) {
      // 신규 작성 모드
      saveBtn.style.display   = "inline-block";
      updateBtn.style.display = "none";
      deleteBtn.style.display = "none";
    } else {
      // 수정 모드
      saveBtn.style.display   = "none";
      updateBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    }
  }


  /* ----------------------------------------
        3) 로딩 과정 실행
  ----------------------------------------- */
  function init() {
    setButtons();
    loadPost();
  }

  init();


  /* ----------------------------------------
        외부로 공개 (필요하면)
  ----------------------------------------- */
  return {
    loadPost
  };

})();

