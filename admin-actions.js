/* ==================================================
   📦 게시판 이동 (공용) / 202.01.12
   - postId 기준
   - board 값만 변경
================================================== */
<select
  onchange="movePostToBoard(${p.id}, this.value)"
>
  <option value="">이동</option>
  <option value="kr">📚 한글</option>
  <option value="en">🌐 English</option>
  <option value="studio">✨ Studio</option>
  <option value="forge">🔥 대장간</option>
  <option value="qna">❓ 질문</option>
</select>




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

