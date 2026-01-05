/* ---------------------------------------------------
   editor-save.js
   Ha-Bin Studio — Save / Update Engine
---------------------------------------------------- */

(function () {

  const btnSave   = document.getElementById("hb-btn-save");
  const btnUpdate = document.getElementById("hb-btn-update");
  const btnDelete = document.getElementById("hb-btn-delete");

     function normalizeContent(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // 1️⃣ 실제 이미지 제거 (엑셀 핵심)
    temp.querySelectorAll("img").forEach(img => img.remove());

    // 2️⃣ 이미지 박스에 placeholder 보장
    temp.querySelectorAll(".hb-img-box[data-img-id]").forEach(box => {
      if (!box.querySelector(".hb-img-ph")) {
        const ph = document.createElement("span");
        ph.className = "hb-img-ph";
        ph.setAttribute("contenteditable", "false");
        ph.textContent = "[이미지]";
        box.appendChild(ph);
      }
    });

    return temp.innerHTML;
  }

  /* ============================
     데이터 수집 (엑셀: 한 행)
  ============================ */
 function collectData() {
  const titleEl  = document.getElementById("hb-title");
  const noticeEl = document.getElementById("hb-notice");

  return {
    id: Date.now(),
    title: (titleEl && titleEl.value.trim()) || "제목 없음",
    writer: "하빈",
    content: document.getElementById("hb-editor").innerHTML,
    date: new Date().toISOString(),
    isNotice: noticeEl ? noticeEl.checked : false
  };
}

  /* ============================
     SAVE — 새 글
  ============================ */
  function saveNew() {
    const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
    const data = collectData();

    posts.push(data);
    localStorage.setItem("habin_posts", JSON.stringify(posts));

    alert("저장 완료");
    location.href = "list.html";
  }

   /* ============================
   UPDATE — 기존 글 수정 (헌법 준수)
============================ */
function updatePost() {
  const id = window.POST_ID;
  const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");

  const nextPosts =
    id &&
    posts.map(post =>
      post.id === id
        ? {
            ...post,
            title: document.getElementById("hb-title")?.value.trim(),
            content: document.getElementById("hb-editor")?.innerHTML,
            isNotice: document.getElementById("hb-notice")?.checked === true,
            date: new Date().toISOString()
          }
        : post
    );

  nextPosts &&
    localStorage.setItem("habin_posts", JSON.stringify(nextPosts));
  nextPosts && alert("저장 완료");
  nextPosts &&
    (location.href = `post.html?mode=view&id=${id}`);
}

  /* ============================
     DELETE — 삭제
  ============================ */
  function deletePost() {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id"));

    if (!confirm("정말 삭제할까요?")) return;

    let posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
    posts = posts.filter(post => post.id !== id);

    localStorage.setItem("habin_posts", JSON.stringify(posts));
    location.href = "list.html";
  }

  /* ============================
     버튼 연결
  ============================ */
  btnSave &&
btnSave.addEventListener("click", () => {
  window.POST_ID ? updatePost() : saveNew();
});


  if (btnDelete) {
    btnDelete.addEventListener("click", deletePost);
  }

})();

