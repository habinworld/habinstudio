/* =====================================================
   main_preview.js / 2026.01.13
   - 메인 프리뷰 엔진 (Table + Grid = 1세트)
   - index에서는 이 엔진을 "호출만" 한다
   ===================================================== */

/* 🔑 단일 진실 */
const STORAGE_KEY = "habin_posts";

/* 📌 메인 프리뷰 엔트리 */
function renderMainPreview(config = {}) {
  const {
    board = "kr",
    limit = 8,
    tableTargetId = "main-post-list",
    gridTargetId  = "current-exhibit"
  } = config;

  const posts = loadPostsByBoard(board);
  const pagePosts = posts.slice(0, limit);

  renderPreviewTable(pagePosts, tableTargetId, posts.length);
  renderPreviewGrid(pagePosts, gridTargetId);
}

/* =====================================================
   데이터 영역
   ===================================================== */

function loadPostsByBoard(board) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return all
    .filter(p => p.board === board)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* =====================================================
   Table (리스트 프리뷰)
   ===================================================== */

function renderPreviewTable(posts, targetId, totalCount) {
  const tbody = document.getElementById(targetId);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (posts.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="4" class="empty">작성된 글이 없습니다.</td></tr>`;
    return;
  }

  posts.forEach((p, idx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${totalCount - idx}</td>
      <td>${p.writer || "하빈"}</td>
      <td>
        <a href="post.html?mode=view&id=${p.id}" class="title-link">
          ${p.isNotice ? "📌 " : ""}${p.title}
        </a>
      </td>
      <td>${formatDateSafe(p.date)}</td>
    `;

    if (p.isNotice) tr.classList.add("notice-row");
    tbody.appendChild(tr);
  });
}

/* =====================================================
   Grid (비주얼 프리뷰)
   ===================================================== */

function renderPreviewGrid(posts, targetId) {
  if (typeof renderMainGrid !== "function") return;

  const container = document.getElementById(targetId);
  if (!container) return;

  renderMainGrid(posts);
}

/* =====================================================
   Utils
   ===================================================== */

function formatDateSafe(date) {
  if (typeof formatDate === "function") {
    return formatDate(date);
  }
  const d = new Date(date);
  return isNaN(d) ? "" : d.toISOString().slice(0, 10);
}

/* =====================================================
   EXPORT (전역)
   ===================================================== */
window.renderMainPreview = renderMainPreview;

