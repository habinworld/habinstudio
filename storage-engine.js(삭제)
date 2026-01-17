/* ---------------------------------------------------
   💾 storage-engine.js — 전역 Storage 안정판
   Ha-Bin Studio · window.Storage 등록
---------------------------------------------------- */
window.Storage = (function () {

  /* ---------------------------------------------
      1) 저장 — HTML 내용 저장
  --------------------------------------------- */
  function save(key, value) {
    if (!key) return;

    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("Storage save error:", e);   // 🔺 개선: 에러 메시지 명확화
    }
  }

  /* ---------------------------------------------
      2) 불러오기 — 저장된 HTML 반환
  --------------------------------------------- */
  function load(key) {
    if (!key) return null;

    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("Storage load error:", e);   // 🔺 개선
      return null;
    }
  }

  /* ---------------------------------------------
      3) 삭제 — 수정모드에서 글 삭제 시 사용
  --------------------------------------------- */
  function remove(key) {
    if (!key) return;

    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Storage remove error:", e);  // 🔺 개선
    }
  }

  /* ---------------------------------------------
      4) 글 ID 자동 생성기
         - 글 작성 시 고유 ID 필요
  --------------------------------------------- */
  function createPostId() {
    // 🔺 개선: 중복 없는 timestamp+random 조합
    return "post_" + Date.now() + "_" + Math.floor(Math.random() * 999999);
  }

  /* ---------------------------------------------
      5) 외부 노출 API
  --------------------------------------------- */
  return {
    save,      // HTML 저장
    load,      // HTML 불러오기
    remove,    // 삭제
    createPostId   // 새 글 ID 생성
  };

})();   // 🔺 수정: 즉시 실행 함수(IIFE) + window 등록

