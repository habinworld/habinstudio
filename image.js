/* -------------------------------------------------------
   🖼 image.js v8.0 — Image Engine (Insert / Resize / Align)
   Ha-Bin Studio Editor — Stable Architecture
-------------------------------------------------------- */

const ImageEngine = (() => {

  /* 🔵 내부 상태 */
  let selectedBox = null;

  /* 에디터 DOM */
  const editor = document.getElementById("editor");


  /* ======================================================
        1) 이미지 삽입
  ====================================================== */
  function insertImage(file) {
    const reader = new FileReader();

    reader.onload = e => {
      const box = createImageBox(e.target.result);
      insertAtCursor(box);
      selectBox(box);
    };

    reader.readAsDataURL(file);
  }


  /* ------------------------------------------------------
        이미지 박스 생성
  ------------------------------------------------------ */
  function createImageBox(src) {
    const box = document.createElement("div");
    box.className = "hb-img-box align-center";  // 기본 정렬: center
    box.contentEditable = "false";

    const img = document.createElement("img");
    img.src = src;
    img.className = "hb-img";

    box.appendChild(img);

    createResizeHandles(box);

    return box;
  }


  /* ------------------------------------------------------
        커서 위치에 삽입
  ------------------------------------------------------ */
  function insertAtCursor(node) {
    const sel = window.getSelection();
    if (!sel.rangeCount) {
      editor.appendChild(node);
      return;
    }

    const range = sel.getRangeAt(0);
    range.collapse(false);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
  }


  /* ======================================================
        2) 이미지 선택
  ====================================================== */
  function selectBox(box) {
    if (selectedBox) selectedBox.classList.remove("hb-img-selected");

    selectedBox = box;
    box.classList.add("hb-img-selected");
  }

  document.addEventListener("click", e => {
    const box = e.target.closest(".hb-img-box");

    if (box) selectBox(box);
    else if (selectedBox) selectedBox.classList.remove("hb-img-selected");
  });


  /* ======================================================
        3) 정렬
  ====================================================== */
  function align(direction) {
    if (!selectedBox) return;

    selectedBox.classList.remove("align-left", "align-center", "align-right");
    selectedBox.classList.add(`align-${direction}`);
  }


  /* ======================================================
        4) Resize 핸들 생성
  ====================================================== */
  function createResizeHandles(box) {
    const handles = ["se", "sw", "ne", "nw"];

    handles.forEach(pos => {
      const h = document.createElement("div");
      h.className = `hb-resize-handle ${pos}`;
      h.dataset.pos = pos;
      box.appendChild(h);
    });
  }


  /* ======================================================
        5) Resize 이벤트
  ====================================================== */
  document.addEventListener("mousedown", e => {
    if (!e.target.classList.contains("hb-resize-handle")) return;

    e.preventDefault();

    const handle = e.target;
    const box = handle.closest(".hb-img-box");
    const img = box.querySelector("img");

    selectBox(box);

    let startX = e.clientX;
    let startY = e.clientY;

    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newW = startWidth;
      let newH = startHeight;

      const pos = handle.dataset.pos;

      if (pos.includes("e")) newW += dx;
      if (pos.includes("s")) newH += dy;
      if (pos.includes("w")) newW -= dx;
      if (pos.includes("n")) newH -= dy;

      newW = Math.max(40, newW);

      img.style.width = newW + "px";
      img.style.height = "auto";
    }

    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });


  /* ======================================================
        외부 API
  ====================================================== */
  return {
    insertImage,
    align
  };

})();




