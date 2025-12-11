/* ---------------------------------------------------
   🖼 image-v8.5.js — 이미지 삽입 + 선택 + 리사이즈 + 정렬
   Ha-Bin Studio — 전역(window.ImageEngine) 안정판
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");

  /* ============================================
        📌 이미지 삽입
  ============================================ */
  function insert(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const box = createImageBox(e.target.result);
      insertNodeAtCursor(box);
    };

    reader.readAsDataURL(file);
  }

  /* 이미지 박스 + 이미지 + 핸들 생성 */
  function createImageBox(src) {
    const box = document.createElement("div");
    box.className = "hb-img-box";

    const img = document.createElement("img");
    img.src = src;
    img.className = "hb-img";

    box.appendChild(img);

    // 핸들 4개 생성
    ["nw", "ne", "sw", "se"].forEach(pos => {
      const h = document.createElement("div");
      h.className = `hb-resize-handle ${pos}`;
      box.appendChild(h);
    });

    // 클릭 시 선택
    box.addEventListener("click", function (e) {
      e.stopPropagation();
      selectBox(box);
    });

    return box;
  }

  /* ============================================
        📌 클릭하면 선택 상태 만들기
  ============================================ */
  function selectBox(box) {
    document.querySelectorAll(".hb-img-box").forEach(b =>
      b.classList.remove("hb-img-selected")
    );

    box.classList.add("hb-img-selected");
    activeBox = box;

    enableResize(box);
  }

  let activeBox = null;
  let resizing = false;
  let activeHandle = "";
  let startX = 0, startY = 0;
  let startW = 0, startH = 0;
  let aspect = 1;

  /* ============================================
        📌 리사이즈 활성화
  ============================================ */
  function enableResize(box) {
    const handles = box.querySelectorAll(".hb-resize-handle");
    const img = box.querySelector("img");

    handles.forEach(handle => {
      handle.onmousedown = function (e) {
        e.preventDefault();
        e.stopPropagation();

        resizing = true;
        activeHandle = [...handle.classList].find(c => /nw|ne|sw|se/.test(c));

        startX = e.clientX;
        startY = e.clientY;

        startW = img.offsetWidth;
        startH = img.offsetHeight;
        aspect = startW / startH;

        document.onmousemove = dragResize;
        document.onmouseup = stopResize;
      };
    });
  }

  /* ============================================
        📌 리사이즈 로직(A/B 하이브리드)
        A모드 = 비율 유지
        B모드 = Shift 누르면 자유조절
  ============================================ */
  function dragResize(e) {
    if (!resizing || !activeBox) return;

    const img = activeBox.querySelector("img");
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newW = startW;
    let newH = startH;

    const freeMode = e.shiftKey; // Shift → 자유조절 모드

    if (!freeMode) {
      // ⭐ 비율 유지 모드 (기본)
      if (activeHandle === "se" || activeHandle === "ne")
        newW = startW + dx;
      else
        newW = startW - dx;

      newH = newW / aspect;
    } else {
      // ⭐ 자유 조절 모드
      if (activeHandle === "se" || activeHandle === "ne")
        newW = startW + dx;
      else
        newW = startW - dx;

      if (activeHandle === "se" || activeHandle === "sw")
        newH = startH + dy;
      else
        newH = startH - dy;
    }

    if (newW > 30 && newH > 30) {
      img.style.width = newW + "px";
      img.style.height = newH + "px";
    }
  }

  function stopResize() {
    resizing = false;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  /* ============================================
        📌 정렬 (left / center / right)
  ============================================ */
  function align(dir) {
    if (!activeBox) return;

    activeBox.classList.remove("align-left", "align-center", "align-right");
    activeBox.classList.add(`align-${dir}`);
  }

  /* ============================================
        📌 커서 위치에 박스 삽입
  ============================================ */
  function insertNodeAtCursor(node) {
    const sel = window.getSelection();

    if (!sel || sel.rangeCount === 0) {
      editor.appendChild(node);
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);

    // 삽입 후 커서를 박스 뒤로 이동
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ============================================
        📌 전역 API
  ============================================ */
  return {
    insert,
    align
  };

})();





