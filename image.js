/* -----------------------------------------------------
   🖼️ Ha-Bin Studio — image.js
   이미지 자동축소 + 리사이즈 핸들 엔진
   (v1.0 정상화 버전)
----------------------------------------------------- */

let currentImg = null;
let resizeHandle = null;
let startX, startY, startWidth, startHeight;

/* -----------------------------------------------------
   1) 이미지 삽입 시 자동 보정
----------------------------------------------------- */
function normalizeInsertedImages() {
  const images = document.querySelectorAll("#editor img");
  images.forEach(img => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.cursor = "pointer";
  });
}

/* -----------------------------------------------------
   2) 이미지 클릭 → 리사이즈 핸들 생성
----------------------------------------------------- */
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest("#editor")) {
    selectImage(e.target);
  } 
  else if (!e.target.classList.contains("hb-resize-handle")) {
    removeResizeHandles(); // 이미지 아닌 곳 클릭하면 제거
  }
});

function selectImage(img) {
  removeResizeHandles();
  currentImg = img;

  // 리사이즈 핸들 생성
  createHandle(img, "se");  // 하나만 사용 (정상화 버전)
}

/* -----------------------------------------------------
   3) 핸들 생성
----------------------------------------------------- */
function createHandle(img, position) {
  const handle = document.createElement("div");
  handle.className = "hb-resize-handle";
  handle.dataset.position = position;
  document.body.appendChild(handle);

  positionHandle(img, handle);

  handle.addEventListener("mousedown", startResizing);

  resizeHandle = handle;
}

/* -----------------------------------------------------
   4) 핸들 위치 계산
----------------------------------------------------- */
function positionHandle(img, handle) {
  const rect = img.getBoundingClientRect();
  const size = 8; // 8px 정사각형

  handle.style.width = size + "px";
  handle.style.height = size + "px";
  handle.style.position = "absolute";
  handle.style.left = (rect.right - size/2) + "px";
  handle.style.top = (rect.bottom - size/2) + "px";
  handle.style.border = "2px solid #FF69B4";
  handle.style.background = "transparent";
  handle.style.cursor = "se-resize";
  handle.style.zIndex = "99999";
}

/* -----------------------------------------------------
   5) 드래그 시작
----------------------------------------------------- */
function startResizing(e) {
  e.preventDefault();
  
  startX = e.clientX;
  startY = e.clientY;

  startWidth = currentImg.offsetWidth;
  startHeight = currentImg.offsetHeight;

  document.addEventListener("mousemove", resizing);
  document.addEventListener("mouseup", stopResizing);
}

/* -----------------------------------------------------
   6) 드래그 중 (비율 유지 리사이즈)
----------------------------------------------------- */
function resizing(e) {
  if (!currentImg) return;

  const dx = e.clientX - startX;

  let newWidth = startWidth + dx;
  if (newWidth < 50) newWidth = 50;  // 최소 크기 제한

  currentImg.style.width = newWidth + "px";
  currentImg.style.height = "auto";

  positionHandle(currentImg, resizeHandle);
}

/* -----------------------------------------------------
   7) 드래그 종료
----------------------------------------------------- */
function stopResizing() {
  document.removeEventListener("mousemove", resizing);
  document.removeEventListener("mouseup", stopResizing);
}

/* -----------------------------------------------------
   8) 핸들 제거
----------------------------------------------------- */
function removeResizeHandles() {
  const handles = document.querySelectorAll(".hb-resize-handle");
  handles.forEach(h => h.remove());
  currentImg = null;
}

