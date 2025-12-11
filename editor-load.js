/* ---------------------------------------------------
   📂 editor-load.js — vFinal 안정판
   Ha-Bin Studio 불러오기 엔진
---------------------------------------------------- */

window.EditorLoad = (function () {

  const STORAGE_KEY = "habin_posts";

  /* -----------------------------
      🔹 저장소 불러오기
  ----------------------------- */
  function loadPosts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /* -----------------------------
      🔹 글 1개 불러오기
  ----------------------------- */
  function load(id) {
    const posts = loadPosts();
    return posts.find(p => p.id === id) || null;
  }

  /* -----------------------------
      🔹 editor.html에서 자동 실행
  ----------------------------- */
  function initEditor() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    // 신규 글이면 종료
    if (!id) return;

    const post = load(id);
    if (!post) {
      alert("글을 불러올 수 없습니다.");
      return;
    }

    // 입력값 채우기
    document.getElementById("hb-title").value = post.title;
    document.getElementById("hb-editor").innerHTML = post.content;

    const noticeBox = document.getElementById("hb-notice");
    if (noticeBox) noticeBox.checked = post.notice ? true : false;
  }

  return {
    initEditor
  };

})();

/* -----------------------------
   🔹 페이지 로드 시 자동 실행
------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  window.EditorLoad.initEditor();
});

  

