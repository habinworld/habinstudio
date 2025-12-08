/* -----------------------------------------------------
   🌇 Ha-Bin Studio — image.js v3.5 (Stable)
   이미지 기본 스타일 + 드래그 리사이즈 + 안전 로직
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  if (!editor) return;

  editor.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      activateResizeHandles(e.target);
    } else {
      removeHandles();
    }
  });
});

/* -----------------------------------------------------
   리사이즈 핸들 생성
----------------------------------------------------- */
function activateResizeHandles(img) {
  removeHandles();

  img.classList.add("hb-img-selected");

  const handles = ["nw", "ne", "sw", "se"];
  handles.forEach(pos => {
    const h = document.createElement("div");
    h.className = `hb-img-handle hb-img-handle-${pos}`;
    h.dataset.position = pos;
    document.body.appendChild(h);

    positionHandle(h, img);

    h.addEventListener("mousedown", initResize(img, pos));
  });
}

/* -----------------------------------------------------
   핸들 위치 계산
----------------------------------------------------- */
function positionHandle(handle, img) {
  const rect = img.getBoundingClientRect();
  const s = 10;

  const map = {
    "nw": [rect.left - s, rect.top - s],
    "ne": [rect.right - s, rect.top - s],
    "sw": [rect.left - s, rect.bottom - s],
    "se": [rect.right - s, rect.bottom - s],
  };

  const [x, y] = map[handle.dataset.position];
  handle.style.left = x + "px";
  handle.style.top  = y + "px";
}

/* -----------------------------------------------------
   리사이즈 시작
----------------------------------------------------- */
function initResize(img, corner) {
  return function (e) {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;

    function resize(ev) {
      let w = startWidth + (ev.clientX - startX);
      let h = startHeight + (ev.clientY - startY);

      if (w < 40) w = 40;
      if (h < 40) h = 40;

      img.style.width = w + "px";
      img.style.height = "auto";

      updateAllHandles(img);
    }

    function stop() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stop);
  };
}

/* -----------------------------------------------------
   핸들 4개 다시 배치
----------------------------------------------------- */
function updateAllHandles(img) {
  document.querySelectorAll(".hb-img-handle").forEach(h => {
    positionHandle(h, img);
  });
}

/* -----------------------------------------------------
   핸들 제거
----------------------------------------------------- */
function removeHandles() {
  document.querySelectorAll(".hb-img-handle").forEach(h => h.remove());
  document.querySelectorAll(".hb-img-selected").forEach(i => {
    i.classList.remove("hb-img-selected");
  });
}


