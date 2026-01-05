/* ---------------------------------------------------
   editor-save.js
   Ha-Bin Studio — Save / Update Engine (CLEAN STABLE)
---------------------------------------------------- */

(function () {

  /* ============================
     🧭 Step 0 — URL에서 글 ID 확정 (단일 진실)
  ============================ */
  const params = new URLSearchParams(location.search);
  const POST_ID = Number(params.get("id")); // 없으면 NaN

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

    // 실제 img 제거
    temp.querySelectorAll("img").forEach(img => img.remove());

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
    const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
    posts.push(collectNewData());
     
    localStorage.setItem("habin_posts", JSON.stringify(posts));
    setTimeout(() => {
  alert("저장 완료");
  location.href = "list.html";
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

    const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");

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

    localStorage.setItem("habin_posts", JSON.stringify(nextPosts));
    setTimeout(() => {
  alert("저장 완료");
  location.href = "list.html";
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

    let posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
    posts = posts.filter(post => post.id !== POST_ID);

    localStorage.setItem("habin_posts", JSON.stringify(posts));
   location.href = "list.html";
  }
    /* ============================
     CANCEL — 취소
  ============================ */
  document.getElementById("hb-btn-cancel")
  ?.addEventListener("click", () => {
    location.href = "list.html";
  });
  /* ============================
     버튼 연결 (최종 판단)
  ============================ */
  btnSave && btnSave.addEventListener("click", () => {
    Number.isInteger(POST_ID) ? updatePost() : saveNew();
  });

  btnDelete && btnDelete.addEventListener("click", deletePost);

})();


