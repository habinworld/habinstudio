/* ---------------------------------------------------
   editor-save.js / 2026.04.19
   Ha-Bin Studio — Save / Update Engine (CLEAN STABLE)
---------------------------------------------------- */
(function () {
  const STORAGE_KEY = "habin_posts";
  const POST_ID = Number(window.POST_ID);
  const CURRENT_BOARD = (typeof getBoardFromURL === "function" ? getBoardFromURL() : "") || "kr";

  /* ============================
     DOM 요소
  ============================ */
   function initEditorSave() {
    const btnSave = document.getElementById("hb-btn-save");
    const btnDelete = document.getElementById("hb-btn-delete");
    const editorEl = document.getElementById("hb-editor");
    const titleEl = document.getElementById("hb-title");
    const noticeEl = document.getElementById("hb-notice");

    if (!btnSave || !editorEl || !titleEl) {
      console.warn("[editor-save] 필수 DOM 없음", {
        btnSave: !!btnSave,
        editorEl: !!editorEl,
        titleEl: !!titleEl
      });
      return;
    }
/* ============================
   🔒 Step 1 — 저장 전 정규화 (FINAL)
   - 이미지 placeholder ❌
   - img 태그 ❌
   - 이미지 실체 = ImageStore
============================ */
function normalizeContent(html) {
      const temp = document.createElement("div");
      temp.innerHTML = html || "";

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

    function getPosts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch (error) {
        console.error("[editor-save] posts parse 오류", error);
        return [];
      }
    }
   /* ============================
     ✅ order 계산
     - 같은 게시판의 마지막 order + 1000
  ============================ */
 function getNextOrderForBoard(board) {
      const safeBoard = getSafeBoard(board);
      const posts = getPosts();

      const sameBoardPosts = posts.filter(post => {
        return (post.board || "kr") === safeBoard;
      });

      if (!sameBoardPosts.length) return 1000;

      const maxOrder = Math.max(
        ...sameBoardPosts.map(post =>
          typeof post.order === "number" && !Number.isNaN(post.order) ? post.order : 0
        )
      );

      return maxOrder + 1000;
    }
     /* ============================
   💾 저장 엔진 (Storage Engine)
   - 현재: localStorage 저장
   - 미래: 서버 API 연결 예정
============================ */
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
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
      const boxes = editorEl?.querySelectorAll(".hb-img-box[data-img-id]") || [];
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
        board,
        order: getNextOrderForBoard(board),
        title: titleEl?.value.trim() || "제목 없음",
        writer: "하빈",
        content: normalizeContent(editorEl?.innerHTML || ""),
        images: collectImageIds(),
        date: new Date().toISOString(),
        isNotice: noticeEl?.checked === true
      };
    }
    function goListPage(board) {
      const listPage = window.HABIN_LIST_PAGE || "list.html";
      location.href = listPage + "?board=" + getSafeBoard(board);
    }
  /* ============================
     SAVE — 새 글
  ============================ */
  function saveNew() {
      try {
        const title = titleEl?.value.trim() || "";

        if (!title && !hasContent()) {
          alert("제목 또는 내용을 입력하세요.");
          return;
        }

        const posts = getPosts();
        const newPost = collectNewData();

        posts.push(newPost);
        savePosts(posts);

        console.log("[editor-save] 새 글 저장 완료", newPost);

        alert("저장 완료");
        goListPage(newPost.board);
      } catch (error) {
        console.error("[editor-save] saveNew 오류", error);
        alert("저장 중 오류: " + error.message);
      }
    }
   /* ============================
     UPDATE — 기존 글 수정
     - 수정 시 order 유지
  ============================ */
  function updatePost() {
      try {
        if (!Number.isInteger(POST_ID)) {
          alert("수정 실패: 글 ID 없음");
          return;
        }

        const title = titleEl?.value.trim() || "";

        if (!title && !hasContent()) {
          alert("제목 또는 내용을 입력하세요.");
          return;
        }

        const posts = getPosts();

        const nextPosts = posts.map(post =>
          post.id === POST_ID
            ? {
                ...post,
                board: getSafeBoard(post.board),
                order:
                  typeof post.order === "number" && !Number.isNaN(post.order)
                    ? post.order
                    : getNextOrderForBoard(post.board || "kr"),
                title: titleEl?.value.trim() || post.title,
                content: normalizeContent(editorEl?.innerHTML || post.content),
                images: collectImageIds(),
                isNotice: noticeEl?.checked === true
              }
            : post
        );

        savePosts(nextPosts);
        console.log("[editor-save] 수정 완료", POST_ID);

        alert("저장 완료");
        goListPage(window.CURRENT_BOARD);
      } catch (error) {
        console.error("[editor-save] updatePost 오류", error);
        alert("수정 중 오류: " + error.message);
      }
    }
  /* ============================
     DELETE — 삭제
  ============================ */
  function deletePost() {
      try {
        if (!Number.isInteger(POST_ID)) {
          alert("삭제 실패: 글 ID 없음");
          return;
        }

        if (!confirm("정말 삭제할까요?")) return;

        const posts = getPosts().filter(post => post.id !== POST_ID);
        savePosts(posts);

        console.log("[editor-save] 삭제 완료", POST_ID);
        goListPage(window.CURRENT_BOARD);
      } catch (error) {
        console.error("[editor-save] deletePost 오류", error);
        alert("삭제 중 오류: " + error.message);
      }
    }
    
  /* ============================
     버튼 연결 (최종 판단)
  ============================ */
 btnSave.addEventListener("click", () => {
      window.POST_MODE === "edit" ? updatePost() : saveNew();
    });

    if (btnDelete) {
      btnDelete.addEventListener("click", deletePost);
    }

    console.log("[editor-save] 초기화 완료", {
      STORAGE_KEY,
      CURRENT_BOARD,
      POST_MODE: window.POST_MODE
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditorSave);
  } else {
    initEditorSave();
  }
})();


