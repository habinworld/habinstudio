/* --------------------------------------------------
   main-grid.js
   Ha-Bin Studio · 메인 전시 그리드
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

  // 1️⃣ 글 데이터 불러오기
  const posts = JSON.parse(localStorage.getItem("habin_posts") || "[]");

  // 2️⃣ 메인 그리드 찾기
  const grid = document.getElementById("current-exhibit");
  if (!grid) return;
  if (!posts || posts.length === 0) return;

  // 3️⃣ 최신 글 1개 선택 (전시용)
  const p = posts[posts.length - 1];

  // 4️⃣ 본문 텍스트만 추출
  const textOnly = (p.content || "")
    .replace(/<[^>]*>/g, "")
    .trim();

  // 5️⃣ 미리보기 (4줄 분량 감각)
  const previewText = textOnly.slice(0, 120);

  // 6️⃣ 메인 전시용 날짜 (날짜만)
  const d = new Date(p.date);
  const onlyDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  // 7️⃣ 카드 생성
  const item = document.createElement("div");
  item.className = "grid-item";

  item.innerHTML = `
    <div class="card-title">${p.title}</div>

    <div class="card-preview">
      ${previewText}${textOnly.length > 120 ? "…" : ""}
    </div>

    <div class="card-meta">
      <span class="card-writer">${p.writer || "하빈"}</span>
      <span class="card-date">${onlyDate}</span>
    </div>
  `;

  // 8️⃣ 클릭 → 글 보기
  item.addEventListener("click", () => {
    location.href = "post.html?mode=view&id=" + p.id;
  });

  // 9️⃣ 그리드에 추가
  grid.appendChild(item);

});


