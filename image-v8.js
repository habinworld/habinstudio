/* ---------------------------------------------------
   🖼 image-v8.5.js — Full Image Engine (전역 안정판)
   Ha-Bin Studio — Insert / Select / Align / Resize
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");

  /* ================================================
      1) 이미지 삽입
  ================================================= */
  function insert(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const box = document.createElement("div");
      box.className = "hb-img-box align-center";

      const img = document.createElement("img");
      img.className = "hb-img";
      img.src = e.target.result;

      // 박스 구조 완성
      box.appendChild(img);

      // 리사이즈 핸들 추가
      addResizeHandles(box);

      insertNodeAtCursor(box);
      selectBox(box);
    };

    reader.readAsDataURL(file);
  }

  /* ================================================
      2) 커서 위치에 노드 삽입
  ================================================= */
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

  /* ================================================
      3) 이미지 선택 처리
  ================================================= */
  function selectBox(box) {
    deselectAll();
    box.classList.add("hb-img-selected");
  }

  function deselectAll() {
    document.querySelectorAll(".hb-img-box").forEach(b => {
      b.classList.remove("hb-img-selected");
    });
  }

  // 클릭해서 이미지 선택
  document.addEventListener("click", function (e) {
    const box = e.target.closest(".hb-img-box");
    if (box) {
      selectBox(box);
    } else {
      deselectAll();
    }
  });

  /* ================================================
      4) 정렬 (left / center / right)
  ================================================= */
  function align(direction) {
    const box = document.querySelector(".hb-img-box.hb-img-selected");
    if (!box) return;

    box.classList.remove("align-left", "align-center", "align-right");
    box.classList.add("align-" + direction);
  }

  /* ================================================
      5) 리사이즈 핸들 추가
  ================================================= */
  function addResizeHandles(box) {
    ["nw", "ne", "sw", "se"].forEach(pos => {
      const h = document.createElement("div");
      h.className = "hb-resize-handle " + pos;
      h.dataset.pos = pos;
      box.appendChild(h);
    });

    enableResize(box);
  }

  /* ================================================
      6) 리사이즈 기능
  ================================================= */
  function enableResize(box) {
    const img = box.querySelector(".hb-img");

    let startX, startY, startWidth;

    box.addEventListener("mousedown", function (e) {
      const handle = e.target.closest(".hb-resize-handle");
      if (!handle) return;

      e.preventDefault();

      startX = e.clientX;
      startY = e.clientY;
      startWidth = img.offsetWidth;

      const pos = handle.dataset.pos;

      function onMove(ev) {
        const dx = ev.clientX - startX;

        // 좌우 핸들에 따라 크기 계산
        let newWidth = startWidth;

        if (pos === "ne" || pos === "se") {
          newWidth = startWidth + dx;
        } else if (pos === "nw" || pos === "sw") {
          newWidth = startWidth - dx;
        }

        if (newWidth > 80) img.style.width = newWidth + "px";
      }

      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  }

  /* ================================================
      7) 외부 API
  ================================================= */
  return {
    insert,
    align
  };

})();






