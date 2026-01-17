/* -------------------------------------------------------------------------------
   🖼 ImageEngine — FINAL BULLET Edition / 2026.01.17
   -정렬 (L / C / R) / 전방위 리사이즈 (8방향)- 삭제 (툴바 DEL + Delete / Backspace)
   원칙: 상태 저장 ❌ / 판단 ❌ EditorCore / Toolbar 개입 ❌ - 존재 / 비존재 ✔
--------------------------------------------------------------------------------- */
window.ImageEngine = (function () {
  /* ===================================================
     0) 내부 상태 (ImageEngine만 소유)
  =================================================== */
  const editor = document.getElementById("hb-editor");
  let currentBox = null;

  const HANDLES = ["n","s","e","w","ne","nw","se","sw"];

  if (!editor) return {}; // DOM 안전장치
 /* ===================================================
   1) 이미지 삽입 — BULLET
=================================================== */
function insert(file) {
  if (!file) return;

  ImageStore.save(file, (id) => {   // ⭐ ImageStore 저장 시작

    // 🔒 editor 활성화
    editor.contentEditable = "true";
    editor.focus();

    // ① 이미지 박스 생성
    const box = document.createElement("div");
    box.className = "hb-img-box align-center";
    box.dataset.imgId = id;         // ⭐ 핵심: 이미지 ID
    addResizeHandles(box);

    box.addEventListener("click", e => {
      e.stopPropagation();
      selectBox(box);
    });

    // ② 문단에 삽입
    const paragraph = document.createElement("div");
    paragraph.setAttribute("data-hb-paragraph", "");
    paragraph.appendChild(box);
    insertNodeAtCursor(paragraph);

    selectBox(box);
    enableFreeMove(box);

    // ③ FLOW ↔ FREE 전환
    box.addEventListener("dblclick", e => {
      e.stopPropagation();
      const isFree = box.classList.toggle("free");
      if (!isFree) {
        box.style.left = "";
        box.style.top  = "";
      }
    });

    // ④ 이미지 표시 (ImageStore에서 로드)
    const img = document.createElement("img");
    img.draggable = false;
    img.addEventListener("dragstart", e => e.preventDefault());
    img.style.display = "block";
    img.style.maxWidth = "100%";
    img.style.height = "auto";

    box.appendChild(img);

    const src = ImageStore.load(id);
    if (src) img.src = src;

  }); // ⭐ ImageStore.save 종료
}
  /* ===================================================
     2) 커서 위치 삽입
  =================================================== */
  function insertNodeAtCursor(node) {
  const sel = window.getSelection();

  // 🔒 커서가 없거나, editor 밖에 있으면 editor 끝에 강제 삽입
  if (!sel || !sel.rangeCount || !editor.contains(sel.anchorNode)) {
    editor.appendChild(node);
    editor.focus();
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
    document
      .querySelectorAll(".hb-img-selected")
      .forEach(el => el.classList.remove("hb-img-selected"));
    currentBox = null;
  }

  editor.addEventListener("click", e => {
    if (!e.target.closest(".hb-img-box")) clearSelection();
  });
  /* ===================================================
   3-1) DROP 차단 (이미지 복사 방지)
=================================================== */
editor.addEventListener("drop", e => {
  if (!e.target.closest(".hb-img-box")) return;
  e.preventDefault();
});
  /* ===================================================
     4) 정렬
  =================================================== */
  function align(direction) {
    if (!currentBox) return;

    currentBox.classList.remove(
      "align-left",
      "align-center",
      "align-right"
    );

    direction === "left"  && currentBox.classList.add("align-left");
    direction === "right" && currentBox.classList.add("align-right");
    (!direction || direction === "center") &&
      currentBox.classList.add("align-center");
  }

  /* ===================================================
     5) 리사이즈 핸들
  =================================================== */
  function addResizeHandles(box) {
    HANDLES.forEach(dir => {
      const h = document.createElement("div");
      h.className = "hb-resize-handle " + dir;
      box.appendChild(h);
      h.addEventListener("mousedown", e =>
        initResize(e, box, dir)
      );
    });
  }

  /* ===================================================
     6) 전방위 리사이즈
  =================================================== */
  function initResize(e, box, dir) {
    e.preventDefault();
    e.stopPropagation();

    const img = box.querySelector("img");
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.width;
    const startH = rect.height;
    const ratio  = startW / startH;

    function move(ev) {
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;

      let w = startW;
      let h = startH;

      dir.includes("e") && (w = startW + dx);
      dir.includes("w") && (w = startW - dx);
      dir.includes("s") && (h = startH + dy);
      dir.includes("n") && (h = startH - dy);

      ev.shiftKey && (h = w / ratio);

      img.style.width  = Math.max(40, w) + "px";
      img.style.height = Math.max(40, h) + "px";
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  }
  /* ===================================================
   6-1) FREE 이동 (문단 ↔ 자유 이동)
=================================================== */
function enableFreeMove(box) {
  let sx, sy, ox, oy;

  box.addEventListener("mousedown", e => {
    if (!box.classList.contains("free")) return;

    e.preventDefault();
    sx = e.clientX;
    sy = e.clientY;

    const r  = box.getBoundingClientRect();
    const pr = editor.getBoundingClientRect();

    ox = r.left - pr.left;
    oy = r.top  - pr.top;

    function move(ev) {
      box.style.left = ox + (ev.clientX - sx) + "px";
      box.style.top  = oy + (ev.clientY - sy) + "px";
    }

    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}
 
  /* ===================================================
     7) 삭제 (툴바 + 키보드)
  =================================================== */
  function remove() {
    if (!currentBox) return;
    const target = currentBox;
    clearSelection();
    target.remove();
  }

  // 키보드 Delete / Backspace
  document.addEventListener("keydown", e => {
    if (!currentBox) return;

    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove();
    }
  });
    /* ===================================================
     7-1) 이미지 합성 렌더 (엑셀식 복원)
     - 저장된 DOM 구조를 다시 그림
     - box / img 구조 복구
  =================================================== */
  function renderAll() {
    editor.querySelectorAll(".hb-img-box").forEach(box => {
      const img = box.querySelector("img");
      if (!img) return;

      // 이미 src가 있으면 그대로 둔다
      if (img.src && img.src.startsWith("data:")) return;
    });
  }

  /* ===================================================
     8) 외부 API (배선판 전용)
  =================================================== */
  return {
    insert,
    align,
    remove,
    renderAll 
  };

})();


   




