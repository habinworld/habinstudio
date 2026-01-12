/* ==================================================
   📦 게시판 이동 (공용) / 202.01.12
   - postId 기준
   - board 값만 변경
================================================== */
function movePostToBoard(postId, targetBoard) {
  if (!postId || !targetBoard) return;

  const posts = JSON.parse(
    localStorage.getItem("habin_posts") || "[]"
  );

  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return;

  posts[idx].board = targetBoard;

  localStorage.setItem("habin_posts", JSON.stringify(posts));

  location.reload(); // 가장 안전
}

