/* =====================================================
   main_preview.js / 2026.01.31
   - 메인 프리뷰 엔진 (Table + Grid = 1세트)
   - index에서는 이 엔진을 "호출만" 한다
   ===================================================== */
(() => {
  /* 🔒 단일진실: 보드 읽기만 */
  const BOARD = window.CURRENT_BOARD;
  if (!BOARD) {
    console.error("CURRENT_BOARD is not defined");
    return;
  }

  const itemsPerPage = 8;

  /* 📦 원본 저장소 */
  const allPosts = JSON.parse(localStorage.getItem("habin_posts") || "[]");

  /* 🖥 화면 출력용 파생 데이터 */
  const posts = allPosts
    .filter(p => p.board === BOARD)
    .reverse(); // 🔥 최신 글이 위로 오도록 
    
  /* 📄 페이지 상태 */
  let currentPage = parseInt(
    new URLSearchParams(location.search).get("page"),
    10
  );
  if (!currentPage || currentPage < 1) currentPage = 1;

  const totalPages = Math.ceil(posts.length / itemsPerPage);
   /* 0️⃣ 메인프리뷰 테이블 썸네일용 */
  function extractFirstImageIdFromContent(html){
    const temp = document.createElement("div");
    temp.innerHTML = html || "";
    const box = temp.querySelector(".hb-img-box[data-img-id]");
    return box ? (box.dataset.imgId || null) : null;
  }

  function getPagePosts() {
    const start = (currentPage - 1) * itemsPerPage;
    return posts.slice(start, start + itemsPerPage);
  }

  /* =========================
     🧾 테이블 렌더
  ========================= */
  function renderTable() {
    const tbody = document.getElementById("main-post-list");
    if (!tbody) return;

    const pagePosts = getPagePosts();
    tbody.innerHTML = "";

    if (pagePosts.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="4">작성된 글이 없습니다.</td></tr>`;
      return;
    }

    pagePosts.forEach((p, idx) => {
      const tr = document.createElement("tr");
      
      tr.innerHTML = `
        <td>${posts.length - ((currentPage - 1) * itemsPerPage + idx)}</td>
        <td>${p.writer || "하빈"}</td>
        <td>
  <a href="post.html?mode=view&id=${p.id}" class="title-link">
    ${p.isNotice ? "📌 " : ""}${p.title}
  </a>
</td>
        <td>${formatDate(p.date)}</td>
      `;
      if (p.isNotice) tr.classList.add("notice-row");
      tbody.appendChild(tr);
    });
  }

  /* =========================
     📄 페이지네이션 렌더
  ========================= */
  function renderPagination() {
    const pag = document.getElementById("pagination");
    if (!pag || totalPages <= 1) return;

    pag.innerHTML = "";

    if (currentPage > 1) {
      pag.innerHTML +=
        `<a href="?page=${currentPage - 1}" class="page-btn">이전</a>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      pag.innerHTML +=
        `<a href="?page=${i}" class="page-btn ${i === currentPage ? "active" : ""}">
          ${i}
        </a>`;
    }

    if (currentPage < totalPages) {
      pag.innerHTML +=
        `<a href="?page=${currentPage + 1}" class="page-btn">다음</a>`;
    }
  }

  /* =========================
     🧱 그리드 렌더
  ========================= */
  function renderGrid() {
    if (typeof renderMainGrid === "function") {
      renderMainGrid(getPagePosts());
    }
  }
/* =========================
   📢 공지 렌더 (메인 프리뷰)
========================= */

const NOTICE_LIMIT = 8;

const notices = allPosts
  .filter(p => (p.board) === BOARD && p.isNotice === true)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, NOTICE_LIMIT);

const noticeSection = document.getElementById("notice-section");
const noticeList = document.getElementById("notice-list");

if (noticeSection && noticeList && notices.length > 0) {
  noticeSection.style.display = "block";

  noticeList.innerHTML = notices
    .map((n, idx) => `
      <div class="notice-item"
           onclick="location.href='post.html?mode=view&id=${n.id}'">
        <span class="notice-no">${notices.length - idx}</span>
        <span class="notice-writer">관리자</span>
        <span class="notice-title">${n.title}</span>
        <span class="notice-date">${formatDate(n.date)}</span>
      </div>
    `)
    .join("")
     + `
    <div class="notice-more">
      <a href="list.html">+ 공지 더보기</a>
    </div>
    `;
   }

  /* ▶ 실행 */
  renderTable();
  renderPagination();
  renderGrid();
 
})();



