/* ==================================================
   📦 게시판 이동 (공용) / 202.01.12
   - postId 기준
   - board 값만 변경
================================================== */
/* ==================================================
   🔐 관리자 행동 엔진 (admin-actions.js)
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
function moveUp(i) {
  if (!window.IS_ADMIN) return;

  const postId = posts[i]?.id;
  if (!postId) return;

  const idx = findIndexById(postId);
  if (idx <= 0) return;

  [allPosts[idx - 1], allPosts[idx]] =
    [allPosts[idx], allPosts[idx - 1]];

  saveAllPosts();
  location.reload();
}

/* ===============================
   ▼ 아래로 이동
================================ */
function moveDown(i) {
  if (!window.IS_ADMIN) return;

  const postId = posts[i]?.id;
  if (!postId) return;

  const idx = findIndexById(postId);
  if (idx === -1 || idx >= allPosts.length - 1) return;

  [allPosts[idx], allPosts[idx + 1]] =
    [allPosts[idx + 1], allPosts[idx]];

  saveAllPosts();
  location.reload();
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

