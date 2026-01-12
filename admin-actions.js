/* ==================================================
   🔐 관리자 행동 엔진 (admin-actions.js) 2026.01.12
   - 공지 토글
   - 위 / 아래 이동
   - 삭제
   - 게시판 이동
   - 단일 저장소: habin_posts
================================================== */

/* --- 안전 가드: 관리자 아니면 아무 것도 못 함 --- */
if (!window.IS_ADMIN) {
  console.warn("admin-actions.js loaded without admin.");
}

/* --- 공용 저장 헬퍼 (단일 진실) --- */
function saveAllPosts() {
  localStorage.setItem("habin_posts", JSON.stringify(allPosts));
}

function findIndexById(id) {
  return allPosts.findIndex(p => p.id === id);
}

/* ===============================
   📌 공지 토글
================================ */
function toggleNotice(i) {
  if (!window.IS_ADMIN) return;

  const postId = posts[i]?.id;
  if (!postId) return;

  const idx = findIndexById(postId);
  if (idx === -1) return;

  allPosts[idx].isNotice = !allPosts[idx].isNotice;
  saveAllPosts();
  location.reload();
}

/* ===============================
   ▲ 위로 이동
================================ */
function moveUp(index) {
  if (index <= 0) return;

  const a = posts[index].id;
  const b = posts[index - 1].id;

  const ia = allPosts.findIndex(p => p.id === a);
  const ib = allPosts.findIndex(p => p.id === b);

  if (ia === -1 || ib === -1) return;

  // ✅ 데이터만 교체
  [allPosts[ia], allPosts[ib]] = [allPosts[ib], allPosts[ia]];

  // ✅ 저장
  saveAllPosts();

  // ✅ 화면만 다시 그림 (핵심)
  renderList();
  renderPagination();
  renderGrid();
}

/* ===============================
   ▼ 아래로 이동
================================ */
function moveDown(index) {
  if (index >= posts.length - 1) return;

  const a = posts[index].id;
  const b = posts[index + 1].id;

  const ia = allPosts.findIndex(p => p.id === a);
  const ib = allPosts.findIndex(p => p.id === b);

  if (ia === -1 || ib === -1) return;

  [allPosts[ia], allPosts[ib]] = [allPosts[ib], allPosts[ia]];

  saveAllPosts();

  renderList();
  renderPagination();
  renderGrid();
}
/* ===============================
   🗑 글 삭제
================================ */
function deletePost(i) {
  if (!window.IS_ADMIN) return;

  const postId = posts[i]?.id;
  if (!postId) return;

  const idx = findIndexById(postId);
  if (idx === -1) return;

  if (!confirm("정말 삭제하시겠습니까?")) return;

  allPosts.splice(idx, 1);
  saveAllPosts();
  location.reload();
}

/* ===============================
   📦 게시판 이동 (board 값만 변경)
================================ */
function movePostToBoard(postId, targetBoard) {
  if (!window.IS_ADMIN) return;
  if (!postId || !targetBoard) return;

  const idx = findIndexById(postId);
  if (idx === -1) return;

  allPosts[idx].board = targetBoard;
  saveAllPosts();
  location.reload();
}

