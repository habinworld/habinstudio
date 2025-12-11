/* ---------------------------------------------------
   🖼 image-engine.js — vFinal 안정판
   Ha-Bin Studio · window.ImageEngine 등록
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");
  let currentBox = null;   // 현재 선택된 이미지 박스

  /* ---------------------------------------------------
        1) 이미지 삽입
  ---------------------------------------------------- */
  function insert(file) {
    const reader = new FileReader();

    reader.onload = function (e) {

      // 이미지 요소
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "hb-img";

      // 이미지 박스
      const box = document.createElement("div");
      box.className = "hb-img-box align-center"; // 기본 중앙 정렬
      box.appendChild(img);

      // 리사이즈 핸들 생성
      addResizeHandles(box);

      // 클릭 시 선택되도록
      box.addEventListener("click", (ev) => selectBox(ev, box));

      // 커서에 삽입
      insertNodeAtCursor(box);

      selectBox(null, box); // 삽입 후 자동 선택
    };

    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------------
        2) 커서 위치에 노드 삽입
  ---------------------------------------------------- */
  function insertNodeAtCursor(node) {
    const sel = window.getSelection();

    if (!sel || sel.rangeCount === 0) {
      editor.appendChild(node);
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ---------------------------------------------------
        3) 이미지 박스 선택
  ---------------------------------------------------- */
  function selectBox(ev, box) {
    if (ev) ev.stopPropagation();

    // 기존 선택 제거
    if (currentBox && currentBox !== box) {
      currentBox.classList.remove("hb-img-selected");
    }

    // 새로운 선택 적용
    currentBox = box;
    currentBox.classList.add("hb-img-selected");
  }

  // 에디터 빈 공간 클릭하면 선택 해제
  editor.addEventListener("click", (e) => {
    if (!e.target.classList.contains("hb-img") &&
        !e.target.classList.contains("hb-img-box") &&
        !e.target.classList.contains("hb-resize-handle")) {

      if (currentBox) currentBox.classList.remove("hb-img-selected");
      currentBox = null;
    }
  });


  /* ---------------------------------------------------
        4) 정렬 (left / center / right)
  ---------------------------------------------------- */
  function align(direction) {
    if (!currentBox) return;

    currentBox.classList.remove("align-left", "align-center", "align-right");

    if (direction === "left") currentBox.classList.add("align-left");
    else if (direction === "right") currentBox.classList.add("align-right");
    else currentBox.classList.add("align-center");
  }


  /* ---------------------------------------------------
        5) 리사이즈 핸들 4개 추가
  ---------------------------------------------------- */
  function addResizeHandles(box) {
    const positions = ["nw", "ne", "sw", "se"];

    positions.forEach(pos => {
      const h = document.createElement("div");
      h.className = "hb-resize-handle " + pos;
      box.appendChild(h);

      h.addEventListener("mousedown", (e) => initResize(e, box, pos));
    });
  }


  /* ---------------------------------------------------
        6) 리사이즈 동작
  ---------------------------------------------------- */
  let startX, startY, startW, startH;

  function initResize(e, box, corner) {
    e.preventDefault();
    e.stopPropagation();

    const img = box.querySelector("img");
    const rect = img.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;

    function resizeMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newW = startW, newH = startH;

      if (corner.includes("e")) newW += dx;
      if (corner.includes("w")) newW -= dx;
      if (corner.includes("s")) newH += dy;
      if (corner.includes("n")) newH -= dy;

      img.style.width = Math.max(50, newW) + "px";
      img.style.height = "auto";
    }

    function stopResize() {
      window.removeEventListener("mousemove", resizeMove);
      window.removeEventListener("mouseup", stopResize);
    }

    window.addEventListener("mousemove", resizeMove);
    window.addEventListener("mouseup", stopResize);
  }


  /* ---------------------------------------------------
        7) 외부 API
  ---------------------------------------------------- */
  return {
    insert,
    align
  };

})();






