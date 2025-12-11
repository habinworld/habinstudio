/* ---------------------------------------------------
   💾 editor-save.js — vFinal 안정판
   Ha-Bin Studio 저장 엔진
   - 새 글 등록
   - 기존 글 수정
   - 글 삭제
---------------------------------------------------- */

window.EditorSave = (function () {

  const STORAGE_KEY = "habin_posts";

  /* -----------------------------
      🔹 저장소 불러오기
  ----------------------------- */
  function loadPosts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /* -----------------------------
      🔹 저장소 저장하기
  ----------------------------- */
  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  /* -----------------------------
      🔹 글 등록
  ----------------------------- */
  function create() {
    const title   = document.getElementById("hb-title").value.trim();
    const content = document.getElementById("hb-editor").innerHTML.trim();
    const notice  = document.getElementById("hb-notice").checked ? 1 : 0;

    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }

    const posts = loadPosts();

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      notice,
      writer: "하빈",
      date: new Date().toLocaleString("ko-KR")
    };

    posts.push(newPost);
    savePosts(posts);

    location.href = "list.html";
  }

  /* -----------------------------
      🔹 글 수정
  ----------------------------- */
  function update(id) {
    const title   = document.getElementById("hb-title").value.trim();
    const content = document.getElementById("hb-editor").innerHTML.trim();
    const notice  = document.getElementById("hb-notice").checked ? 1 : 0;

    if (!title) {
      alert("제목을 입력하세요.");
      return;
    }

    const posts = loadPosts();
    const idx = posts.findIndex(p => p.id === id);

    if (idx === -1) {
      alert("글을 찾을 수 없습니다.");
      return;
    }

    posts[idx].title = title;
    posts[idx].content = content;
    posts[idx].notice = notice;
    posts[idx].date = new Date().toLocaleString("ko-KR");

    savePosts(posts);

    location.href = "list.html";
  }

  /* -----------------------------
      🔹 글 삭제
  ----------------------------- */
  function remove(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const posts = loadPosts();
    const filtered = posts.filter(p => p.id !== id);

    savePosts(filtered);

    location.href = "list.html";
  }

  return {
    create,
    update,
    remove,
    loadPosts
  };

})();

