/* -----------------------------------------------------
   🌇 Ha-Bin Studio — image.js v3.4
   기본 이미지 스타일 + 드래그 리사이즈 핸들(4방향)
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  if (!editor) return;

  editor.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      activateResizeHandle(e.target);
    }
  });
});

function activateResizeHandle(img) {
  removeHandles();

  img.style.position = "relative";

  const handle = document.createElement("div");
  handle.className = "hb-img-handle";
  document.body.appendChild(handle);

  const rect = img.getBoundingClientRect();
  handle.style.left = rect.right - 10 + "px";
  handle.style.top = rect.bottom - 10 + "px";

  let startX, startWidth;

  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startX = e.clientX;
    startWidth = img.offsetWidth;

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stop);
  });

  function resize(e) {
    img.style.width = startWidth + (e.clientX - startX) + "px";
  }

  function stop() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stop);
  }
}

function removeHandles() {
  const h = document.querySelectorAll(".hb-img-handle");
  h.forEach(x => x.remove());
}

