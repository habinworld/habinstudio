/* ---------------------------------------------------
   🖼 ImageEngine — vFinal (ALL-IN-ONE)
   Ha-Bin Studio
   기능:
   - 삽입 / 선택 / 해제
   - 전방위 리사이즈 (8방향)
   - 정렬 (left / center / right)
   - 삭제 (DEL 버튼 + Delete/Backspace)
   ❌ EditorCore / Toolbar 개입 없음
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");
  let currentBox = null;

  const HANDLES = ["n","s","e","w","ne","nw","se","sw"];

  /* ===================================================
     1) 이미지 삽입
  =================================================== */
  function insert(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.display = "block";
      img.style.maxWidth = "100%";
      img.style.height = "auto";

      const box = document.createElement("div");
      box.className = "hb-img-box align-center";
      box.appendChild(img);

      addResizeHandles(box);

      box.addEventListener("click", ev => {
        ev.stopPropagation();
        selectBox(box);
      });

      insertNodeAtCursor(box);
      selectBox(box);
    };
    reader.readAsDataURL(file);
  }

  /* ===================================================
     2) 커서 위치 삽입
  =================================================== */
  function insertNodeAtCursor(node) {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      editor.appendChild(node);
      return;
    }
    const range = sel.getRangeAt(0);
    range.collapse(false);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ===================================================
     3) 선택 / 해제
  =================================================== */
  function selectBox(box) {
    clearSelection();
    currentBox = box;
    box.classList.add("hb-img-selected");
  }

  function clearSelection() {
    document.querySelectorAll(".hb-img-selected")
      .forEach(el => el.classList.remove("hb-img-selected"));
    currentBox = null;
  }

  editor.addEventListener("click", e => {
    if (!e.target.closest(".hb-img-box")) clearSelection();
  });

  /* ===================================================
     4) 정렬
  =================================================== */
  function align(direction) {
    if (!currentBox) return;
    currentBox.classList.remove("align-left","align-center","align-right");
    if (direction === "left") currentBox.classList.add("align-left");
    else if (direction === "right") currentBox.classList.add("align-right");
    else currentBox.classList.add("align-center");
  }

  /* ===================================================
     5) 리사이즈 핸들
  =================================================== */
  function addResizeHandles(box) {
    HANDLES.forEach(dir => {
      const h = document.createElement("div");
      h.className = "hb-resize-handle " + dir;
      box.appendChild(h);
      h.addEventListener("mousedown", e => initResize(e, box, dir));
    });
  }

  /* ===================================================
     6) 전방위 리사이즈
  =================================================== */
  function initResize(e, box, dir) {
    e.preventDefault();
    e.stopPropagation();

    const img = box.querySelector("img");
    const rect = img.getBoundingClientRect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.width;
    const startH = rect.height;
    const ratio  = startW / startH;

    function resizeMove(ev) {
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;

      let w = startW;
      let h = startH;

      if (dir.includes("e")) w = startW + dx;
      if (dir.includes("w")) w = startW - dx;
      if (dir.includes("s")) h = startH + dy;
      if (dir.includes("n")) h = startH - dy;

      if (ev.shiftKey) h = w / ratio;

      img.style.width  = Math.max(40, w) + "px";
      img.style.height = Math.max(40, h) + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", resizeMove);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", stop);
  }

  /* ===================================================
     7) 삭제
  =================================================== */
  function remove() {
    if (!currentBox) return;
    const target = currentBox;
    clearSelection();
    target.remove();
  }

  document.addEventListener("keydown", e => {
    if (!currentBox) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove();
    }
  });

  /* ===================================================
     8) 외부 API
  =================================================== */
  return {
    insert,
    align,
    remove
  };

})();


   




