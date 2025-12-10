/* ---------------------------------------------------
   🖼 image.js v7.0 — Image Engine (Insert / Resize / Align / Move)
   Ha-Bin Studio Editor
---------------------------------------------------- */

const ImageEngine = (() => {
  
  let currentBox = null;
  let startX = 0, startY = 0, startW = 0, startH = 0;

  /* ===============================
        1) 이미지 삽입
  ================================ */
  function insertImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "hb-img";

      const box = document.createElement("div");
      box.className = "hb-img-box align-center"; // 기본 정렬 center
      box.contentEditable = false;

      box.appendChild(img);
      createResizeHandles(box);

      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      range.collapse(false);
      range.insertNode(box);

      selectBox(box);
    };

    reader.readAsDataURL(file);
  }

  /* ===============================
        2) 이미지 박스 선택
  ================================ */
  function selectBox(box) {
    if (currentBox) currentBox.classList.remove("hb-img-selected");

    currentBox = box;
    box.classList.add("hb-img-selected");
  }

  document.addEventListener("click", e => {
    const box = e.target.closest(".hb-img-box");
    if (box) selectBox(box);
    else if (currentBox) currentBox.classList.remove("hb-img-selected");
  });

  /* ===============================
        3) 정렬 (left / center / right)
  ================================ */
  function align(direction) {
    if (!currentBox) return;
    currentBox.classList.remove("align-left", "align-center", "align-right");
    currentBox.classList.add(`align-${direction}`);
  }

  /* ===============================
        4) 리사이즈 핸들 생성
  ================================ */
  function createResizeHandles(box) {
    const positions = ["nw", "ne", "sw", "se"];

    positions.forEach(pos => {
      const h = document.createElement("div");
      h.className = `hb-resize-handle ${pos}`;
      h.dataset.position = pos;
      box.appendChild(h);
    });
  }

  /* ===============================
        5) 리사이즈 이벤트
  ================================ */
  document.addEventListener("mousedown", e => {
    if (!e.target.classList.contains("hb-resize-handle")) return;

    e.preventDefault();
    const handle = e.target;
    currentBox = handle.closest(".hb-img-box");

    startX = e.clientX;
    startY = e.clientY;

    const img = currentBox.querySelector("img");
    startW = img.offsetWidth;
    startH = img.offsetHeight;

    function move(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      const img = currentBox.querySelector("img");

      let newW = startW;
      let newH = startH;

      if (handle.dataset.position.includes("e")) newW = startW + dx;
      if (handle.dataset.position.includes("s")) newH = startH + dy;
      if (handle.dataset.position.includes("w")) newW = startW - dx;
      if (handle.dataset.position.includes("n")) newH = startH - dy;

      img.style.width = Math.max(30, newW) + "px";
      img.style.height = "auto";
    }

    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  /* ===============================
        6) 이미지 박스 드래그 이동
  ================================ */
  document.addEventListener("mousedown", e => {
    const box = e.target.closest(".hb-img-box");
    if (!box || e.target.classList.contains("hb-resize-handle")) return;

    selectBox(box);

    let offsetX = e.offsetX;
    let offsetY = e.offsetY;

    function move(ev) {
      box.style.position = "relative";
      box.style.left = ev.clientX - offsetX + "px";
      box.style.top  = ev.clientY - offsetY + "px";
    }

    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  /* ===============================
        외부 인터페이스
  ================================ */
  return {
    insertImage,
    align
  };

})();




