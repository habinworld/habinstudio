/* ---------------------------------------------------
   🖼 ImageEngine — vFinal Stable
   Ha-Bin Studio
   역할:
   - 이미지 삽입 (커서 기준)
   - 본문 폭 기준 자동 축소
   - 선택 / 해제
   - 리사이즈 (비율 유지)
   - 정렬 (left / center / right)
   ❌ EditorCore / Toolbar DOM 관여 없음
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");
  let currentBox = null;

  /* ===================================================
     1) 이미지 삽입
  =================================================== */
  function insert(file) {
    const reader = new FileReader();

    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;

      /* 🔒 본문 폭 기준 자동 축소 */
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.display = "block";

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
    currentBox.classList.add("hb-img-selected");
  }

  function clearSelection() {
    document
      .querySelectorAll(".hb-img-selected")
      .forEach(el => el.classList.remove("hb-img-selected"));
    currentBox = null;
  }

  editor.addEventListener("click", e => {
    if (!e.target.closest(".hb-img-box")) {
      clearSelection();
    }
  });

  /* ===================================================
     4) 정렬
  =================================================== */
  function align(direction) {
    if (!currentBox) return;

    currentBox.classList.remove("align-left", "align-center", "align-right");

    if (direction === "left") currentBox.classList.add("align-left");
    else if (direction === "right") currentBox.classList.add("align-right");
    else currentBox.classList.add("align-center");
  }

  /* ===================================================
     5) 리사이즈 핸들
  =================================================== */
  function addResizeHandles(box) {
    ["se"].forEach(pos => {
      const h = document.createElement("div");
      h.className = "hb-resize-handle " + pos;
      box.appendChild(h);

      h.addEventListener("mousedown", e => initResize(e, box));
    });
  }

  /* ===================================================
     6) 리사이즈 (비율 유지)
  =================================================== */
  function initResize(e, box) {
    e.preventDefault();
    e.stopPropagation();

    const img = box.querySelector("img");
    const rect = img.getBoundingClientRect();

    const startX = e.clientX;
    const startW = rect.width;
    const ratio  = rect.width / rect.height;

    function resizeMove(ev) {
      const dx = ev.clientX - startX;
      const newW = Math.max(80, startW + dx);

      img.style.width  = newW + "px";
      img.style.height = (newW / ratio) + "px";
    }

    function stopResize() {
      document.removeEventListener("mousemove", resizeMove);
      document.removeEventListener("mouseup", stopResize);
    }

    document.addEventListener("mousemove", resizeMove);
    document.addEventListener("mouseup", stopResize);
  }

  /* ===================================================
     7) 외부 API
  =================================================== */
  return {
    insert,
    align
  };

})();

   




