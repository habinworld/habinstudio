/* --------------------------------------------------
   main-grid.js / 2026.02.02
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
    const item = document.createElement("div");
    item.className = "grid-item";

    const thumbId = extractFirstImageIdFromContent(p.content);

    // ✅ 썸네일이 있을 때만 thumb DOM을 만든다 (빈 액자 금지)
    item.innerHTML = `
      ${thumbId ? `<div class="grid-thumb" data-img-id="${thumbId}"></div>` : ``}

      <div class="card-title">
        ${p.isNotice ? "📌 " : ""}${p.title || ""}
      </div>
    `;

    item.onclick = () => {
      location.href = `post.html?mode=view&id=${p.id}&board=${window.CURRENT_BOARD}`;
    };

    grid.appendChild(item);
  });

  // ✅ 썸네일 있는 카드만 로딩됨
  renderGridThumbs();
}

/* 🖼 그리드 썸네일 로더 */
async function renderGridThumbs(){
  const boxes = document.querySelectorAll(".grid-thumb[data-img-id]");
  for (const box of boxes) {
    const id = box.dataset.imgId;
    if (!id) continue;

    const src = await ImageStore.load(id);
    if (src) box.style.backgroundImage = `url(${src})`;
  }
}


