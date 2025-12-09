/* -----------------------------------------------------
   🖼️ Ha-Bin Studio — image.js v5.2 (Universal Align 최적화판)
   - 이미지 선택 박스(selectBox)
   - 8방향 리사이즈 핸들
   - 드래그 이동
   - 정렬(left/center/right)과 충돌 없음
   - Universal Align(hbUniversalAlign)과 완전 연동
----------------------------------------------------- */

let selectedImg = null;
let selectBox = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let resizing = false;
let currentHandle = null;

/* ================================
   1) 이미지 클릭 → selectBox 생성
================================ */
document.addEventListener("click", e => {
  const img = e.target.closest("img");

  if (img) {
    e.preventDefault();
    selectImage(img);
  } else {
    removeSelectBox();
  }
});

/* ================================
   이미지 선택
================================ */
function selectImage(img) {
  selectedImg = img;
  createSelectBox();
  updateSelectBox();
}

/* ================================
   선택 박스 제거
================================ */
function removeSelectBox() {
  if (selectBox) selectBox.remove();
  selectBox = null;
  selectedImg = null;
}

/* ================================
   선택 박스 생성
================================ */
function createSelectBox() {
  removeSelectBox();

  selectBox = document.createElement("div");
  selectBox.className = "hb-img-select";

  // 8방향 리사이즈 핸들
  const dirs = ["nw","n","ne","e","se","s","sw","w"];

  dirs.forEach(d => {
    const h = document.createElement("div");
    h.className = "hb-handle hb-" + d;
    h.dataset.dir = d;
    selectBox.appendChild(h);
  });

  // 드래그 이동
  selectBox.addEventListener("mousedown", startDrag);

  document.body.appendChild(selectBox);
}

/* ================================
   선택 박스 UI 위치 업데이트
================================ */
function updateSelectBox() {
  if (!selectedImg || !selectBox) return;

  const r = selectedImg.getBoundingClientRect();

  selectBox.style.left = r.left + window.scrollX + "px";
  selectBox.style.top  = r.top  + window.scrollY + "px";
  selectBox.style.width  = r.width  + "px";
  selectBox.style.height = r.height + "px";
}

/* ================================
   스크롤/창 크기 변경 → selectBox 보정
================================ */
window.addEventListener("scroll", updateSelectBox);
window.addEventListener("resize", updateSelectBox);



/* =========================================================
   2) 리사이즈 (8핸들)
========================================================= */

document.addEventListener("mousedown", e => {
  if (e.target.classList.contains("hb-handle")) {
    resizing = true;
    currentHandle = e.target.dataset.dir;
    e.preventDefault();
  }
});

document.addEventListener("mousemove", e => {
  if (!resizing || !selectedImg) return;

  const imgRect = selectedImg.getBoundingClientRect();

  let w = imgRect.width;
  let h = imgRect.height;

  const dx = e.movementX;
  const dy = e.movementY;

  // 방향별 크기 조정
  if (currentHandle.includes("e")) w += dx;
  if (currentHandle.includes("w")) w -= dx;
  if (currentHandle.includes("s")) h += dy;
  if (currentHandle.includes("n")) h -= dy;

  if (w < 30) w = 30;
  if (h < 30) h = 30;

  // 적용
  selectedImg.style.width = w + "px";
  selectedImg.style.height = "auto";

  updateSelectBox();
});

document.addEventListener("mouseup", () => {
  resizing = false;
  currentHandle = null;
});



/* =========================================================
   3) 이미지 드래그 이동
========================================================= */

function startDrag(e) {
  if (e.target.classList.contains("hb-handle")) return;

  if (!selectedImg) return;

  dragOffsetX = e.clientX - selectedImg.getBoundingClientRect().left;
  dragOffsetY = e.clientY - selectedImg.getBoundingClientRect().top;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", stopDrag);
}

function dragMove(e) {
  if (!selectedImg) return;

  selectedImg.style.position = "absolute";
  selectedImg.style.left = (e.clientX - dragOffsetX) + "px";
  selectedImg.style.top  = (e.clientY - dragOffsetY) + "px";

  updateSelectBox();
}

function stopDrag() {
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", stopDrag);
}



/* =========================================================
   4) Universal Align에서 호출되는 박스 보정
========================================================= */
function refreshSelectBox() {
  setTimeout(updateSelectBox, 20);
}


/* =========================================================
   5) 이미지 삽입 (toolbar.js에서 호출)
========================================================= */
function hbInsertImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
      document.execCommand("insertImage", false, reader.result);

      // 최신 IMG 자동 선택
      setTimeout(() => {
        const imgs = document.querySelectorAll("#editor img");
        const last = imgs[imgs.length - 1];
        selectImage(last);
      }, 10);
    };
    reader.readAsDataURL(input.files[0]);
  };

  input.click();
}



