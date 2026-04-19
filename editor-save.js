/* ---------------------------------------------------
   editor-save.js / 2026.04.19
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
   🔒 Step 1 — 저장 전 정규화 (FINAL)
   - 이미지 placeholder ❌
   - img 태그 ❌
   - 이미지 실체 = ImageStore
============================ */
function normalizeContent(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // 🔥 img 태그 제거 (이미지는 ImageStore에만 존재)
  temp.querySelectorAll(".hb-img-box img").forEach(img => {
    img.remove();
  });

  return temp.innerHTML;
}
   /* ============================
     ✅ 게시판값 정리
  ============================ */
  function getSafeBoard(board) {
    return board || window.CURRENT_BOARD || CURRENT_BOARD || "kr";
  }
   /* ============================
     ✅ order 계산
     - 같은 게시판의 마지막 order + 1000
  ============================ */
  function getNextOrderForBoard(board) {
    const safeBoard = getSafeBoard(board);
    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const sameBoardPosts = posts.filter(post => {
      return (post.board || "kr") === safeBoard;
    });

    if (!sameBoardPosts.length) return 1000;

    const maxOrder = Math.max(
      ...sameBoardPosts.map(post => {
        return typeof post.order === "number" && !Number.isNaN(post.order)
          ? post.order
          : 0;
      })
    );

    return maxOrder + 1000;
  }
  /* ============================
   ✅ 콘텐츠 존재 판단 (추가 위치 = 여기)
   - 텍스트 OR 이미지 중 하나라도 있으면 true
============================ */
function hasContent() {
    const text = (editorEl?.innerText || "")
      .replace(/\u200B/g, "")
      .replace(/\s+/g, "")
      .trim();

    const imageCount = collectImageIds().length;

    return !!text || imageCount > 0;
  }
 /* ============================
     🖼 이미지 ID 수집 (헌법 제10조)
  ============================ */
  function collectImageIds() {
    const boxes = editorEl.querySelectorAll(".hb-img-box[data-img-id]");
    const ids = [];

    boxes.forEach(box => {
      const id = box.dataset.imgId;
      if (id) ids.push(id);
    });

    return ids;
  }  
  /* ============================
     데이터 수집 (새 글 전용)
  ============================ */
  function collectNewData() {
    const board = getSafeBoard(window.CURRENT_BOARD);

    return {
      id: Date.now(),
      board: board,
      order: getNextOrderForBoard(board),
      title: titleEl?.value.trim() || "제목 없음",
      writer: "하빈",
      content: normalizeContent(editorEl?.innerHTML || ""),
      images: collectImageIds(),
      date: new Date().toISOString(),
      isNotice: noticeEl?.checked === true
    };
  }

  /* ============================
     SAVE — 새 글
  ============================ */
  function saveNew() {
    const title = titleEl?.value.trim() || "";

    if (!title && !hasContent()) {
      alert("제목 또는 내용을 입력하세요.");
      return;
    }

    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    posts.push(collectNewData());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

    setTimeout(() => {
      alert("저장 완료");
      location.href = window.HABIN_LIST_PAGE + "?board=" + getSafeBoard(window.CURRENT_BOARD);
    }, 0);
  }
   /* ============================
     UPDATE — 기존 글 수정
     - 수정 시 order 유지
  ============================ */
  function updatePost() {
    if (!Number.isInteger(POST_ID)) {
      alert("수정 실패: 글 ID 없음");
      return;
    }

    const title = titleEl?.value.trim() || "";

    if (!title && !hasContent()) {
      alert("제목 또는 내용을 입력하세요.");
      return;
    }

    const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const nextPosts = posts.map(post =>
      post.id === POST_ID
        ? {
            ...post,
            board: getSafeBoard(post.board),
            order: typeof post.order === "number" && !Number.isNaN(post.order)
              ? post.order
              : getNextOrderForBoard(post.board || "kr"),
            title: titleEl?.value.trim() || post.title,
            content: normalizeContent(editorEl?.innerHTML || post.content),
            images: collectImageIds(),
            isNotice: noticeEl?.checked === true
          }
        : post
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));

    setTimeout(() => {
      alert("저장 완료");
      location.href = window.HABIN_LIST_PAGE + "?board=" + getSafeBoard(window.CURRENT_BOARD);
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


