/* ------------------------------------------------------
   📦 storage.js v8.0 — Ha-Bin Studio Storage Engine
   LocalStorage CRUD 공통 엔진 (안정판)
------------------------------------------------------- */

const StorageEngine = (() => {

  const LS_KEY = "habin_posts";

  /* -----------------------------------------
        0) 내부 데이터 로딩
  ------------------------------------------ */
  function _load() {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  }

  /* -----------------------------------------
        1) 전체 저장 (덮어쓰기)
  ------------------------------------------ */
  function _save(posts) {
    localStorage.setItem(LS_KEY, JSON.stringify(posts));
  }

  /* -----------------------------------------
        2) 모든 글 가져오기
  ------------------------------------------ */
  function getAll() {
    return _load();
  }

  /* -----------------------------------------
        3) 특정 글 가져오기
  ------------------------------------------ */
  function get(id) {
    const posts = _load();
    return posts.find(p => p.id == id) || null;
  }

  /* -----------------------------------------
        4) 새 글 추가
  ------------------------------------------ */
  function add(data) {
    const posts = _load();
    posts.push(data);
    _save(posts);
    return true;
  }

  /* -----------------------------------------
        5) 글 수정
  ------------------------------------------ */
  function update(id, newData) {
    const posts = _load();
    const idx = posts.findIndex(p => p.id == id);
    if (idx === -1) return false;

    posts[idx] = { ...posts[idx], ...newData };
    _save(posts);
    return true;
  }

  /* -----------------------------------------
        6) 글 삭제
  ------------------------------------------ */
  function remove(id) {
    let posts = _load();
    posts = posts.filter(p => p.id != id);
    _save(posts);
    return true;
  }

  /* -----------------------------------------
        7) 고유 ID 생성
  ------------------------------------------ */
  function generateId() {
    return Date.now();
  }

  /* -----------------------------------------
        8) 최신순 정렬
  ------------------------------------------ */
  function sortByDateDesc() {
    const posts = _load();
    return posts.sort((a, b) => (b.id - a.id));
  }

  /* -----------------------------------------
        9) 공지 먼저 + 최신순 정렬
  ------------------------------------------ */
  function sortByNoticeThenDate() {
    const posts = _load();
    return posts.sort((a, b) => {
      if (a.notice && !b.notice) return -1;
      if (!a.notice && b.notice) return 1;
      return b.id - a.id;
    });
  }

  /* -----------------------------------------
        외부 인터페이스
  ------------------------------------------ */
  return {
    getAll,
    get,
    add,
    update,
    remove,
    generateId,
    sortByDateDesc,
    sortByNoticeThenDate
  };

})();

