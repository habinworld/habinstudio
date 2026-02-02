/* --------------------------------------------------
   main-grid.js / 2026.01.08
   Ha-Bin Studio · 리스트 보조 카드 뷰
   역할:
   - 데이터 판단 ❌
   - localStorage 접근 ❌
   - 전달받은 글 목록을 카드형으로 렌더링 ⭕
-------------------------------------------------- */
/* 0️⃣ 썸네일용: 본문에서 첫 이미지 id 추출 */
function extractFirstImageIdFromContent(html){
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
  const box = temp.querySelector(".hb-img-box[data-img-id]");
  return box ? (box.dataset.imgId || null) : null;
}
function renderMainGrid(postList) {
  const grid = document.getElementById("current-exhibit");
  if (!grid) return;

  grid.innerHTML = "";

  postList.forEach(p => {

    /* 1️⃣ 본문 HTML 제거 → 텍스트만 */
    const textOnly = (p.content || "")
      .replace(/<[^>]*>/g, "")
      .trim();

    /* 2️⃣ 미리보기: 약 4줄 분량 (120자) */
    const previewText = textOnly.slice(0, 120);

    /* 3️⃣ 날짜 포맷 (YYYY-M-D) */
    const d = new Date(p.date);
    const onlyDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    /* 4️⃣ 카드 생성 */
    const item = document.createElement("div");
    item.className = "grid-item";
    const thumbId = extractFirstImageIdFromContent(p.content);
    item.innerHTML = `
    <div class="grid-thumb" ${thumbId ? `data-img-id="${thumbId}"` : ""}></div>
      <div class="card-title">
        ${p.isNotice ? "📌 " : ""}${p.title}
      </div>

      <div class="card-preview">
        ${previewText}${textOnly.length > 120 ? "…" : ""}
      </div>

      <div class="card-meta">
        <span class="card-writer">${p.writer || "하빈"}</span>
        <span class="card-date">${onlyDate}</span>
      </div>
    `;

    /* 5️⃣ 클릭 → 글 보기 (list와 100% 동일 규칙) */
    item.onclick = () => {
    location.href =
    `post.html?mode=view&id=${p.id}&board=${window.CURRENT_BOARD}`;
};

    /* 6️⃣ 그리드에 추가 */
    grid.appendChild(item);
  });
 /* 7️⃣ 썸네일 이미지 로딩 */
renderGridThumbs();  
}
/* 🖼 그리드 썸네일 로더 */
async function renderGridThumbs(){
  const boxes = document.querySelectorAll(".grid-thumb[data-img-id]");
  for(const box of boxes){
    const id = box.dataset.imgId;
    if(!id) continue;

    const src = await ImageStore.load(id);
    if(src){
      box.style.backgroundImage = `url(${src})`;
    }
  }
}

