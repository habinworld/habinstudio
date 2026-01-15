/* ---------------------------------------------------
   editor-save.js / 2026.01.11
   Ha-Bin Studio — Save / Update Engine (CLEAN STABLE)
---------------------------------------------------- */

(function () {
  const POST_ID = window.POST_ID;
  const STORAGE_KEY = window.HABIN_STORAGE_KEY;
  const CURRENT_BOARD = getBoardFromURL();  
  /* ============================
     DOM 요소
  ============================ */
  const btnSave   = document.getElementById("hb-btn-save");
  const btnDelete = document.getElementById("hb-btn-delete");
  const editorEl  = document.getElementById("hb-editor");
  const titleEl   = document.getElementById("hb-title");
  const noticeEl  = document.getElementById("hb-notice");

  /* ============================
     🔒 Step 1 — 저장 전 정규화
  ============================ */
  function normalizeContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

   // 이미지 박스 placeholder 보장
    temp.querySelectorAll(".hb-img-box[data-img-id]").forEach(box => {
      if (!box.querySelector(".hb-img-ph")) {
        const ph = document.createElement("span");
        ph.className = "hb-img-ph";
        ph.textContent = "[이미지]";
        ph.setAttribute("contenteditable", "false");
        box.appendChild(ph);
      }
    });

    return temp.innerHTML;
  }

  /* ============================
     데이터 수집 (새 글 전용)
  ============================ */
  function collectNewData() {
    return {
      id: Date.now(),
      board: window.CURRENT_BOARD,   // 🧷 이 한 줄 
      title: titleEl?.value.trim() || "제목 없음",
      writer: "하빈",
      content: normalizeContent(editorEl?.innerHTML || ""),
      date: new Date().toISOString(),
      isNotice: noticeEl?.checked === true
    };
  }

  /* ============================
     SAVE — 새 글
  ============================ */
  function saveNew() {
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
posts.push(collectNewData());
     
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    setTimeout(() => {
  alert("저장 완료");
  location.href = window.HABIN_LIST_PAGE + "?board=" + window.CURRENT_BOARD;
}, 0);
}
  /* ============================
     UPDATE — 기존 글 수정
  ============================ */
  function updatePost() {
    if (!Number.isInteger(POST_ID)) {
      alert("수정 실패: 글 ID 없음");
      return;
    }

    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const nextPosts = posts.map(post =>
      post.id === POST_ID
        ? {
            ...post,
            title: titleEl?.value.trim() || post.title,
            content: normalizeContent(editorEl?.innerHTML || post.content),
            isNotice: noticeEl?.checked === true
          }
        : post
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));
    setTimeout(() => {
  alert("저장 완료");
  location.href = window.HABIN_LIST_PAGE + "?board=" + window.CURRENT_BOARD;
}, 0);
  }

  /* ============================
     DELETE — 삭제
  ============================ */
  function deletePost() {
    if (!Number.isInteger(POST_ID)) {
      alert("삭제 실패: 글 ID 없음");
      return;
    }

    if (!confirm("정말 삭제할까요?")) return;

    let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
     posts = posts.filter(post => post.id !== POST_ID);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    location.href = window.HABIN_LIST_PAGE + "?board=" + window.CURRENT_BOARD;
  }
    
  /* ============================
     버튼 연결 (최종 판단)
  ============================ */
  btnSave && btnSave.addEventListener("click", () => {
    window.POST_MODE === "edit" ? updatePost() : saveNew();
  });

  btnDelete && btnDelete.addEventListener("click", deletePost);

})();


