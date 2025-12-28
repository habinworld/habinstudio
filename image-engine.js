/* ---------------------------------------------------
   🖼 ImageEngine — FINAL BULLET Edition
   Ha-Bin Studio
   책임:
   - 이미지 삽입 (즉시 반응)
   - 선택 / 해제
   - 정렬 (L / C / R)
   - 전방위 리사이즈 (8방향)
   - 삭제 (툴바 DEL + Delete / Backspace)
   원칙:
   - 상태 저장 ❌
   - 판단 ❌
   - EditorCore / Toolbar 개입 ❌
   - 존재 / 비존재 ✔
---------------------------------------------------- */

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

    // ① 박스 먼저 삽입 (체감 0ms)
    const box = document.createElement("div");
    box.className = "hb-img-box align-center";

    addResizeHandles(box);

    box.addEventListener("click", e => {
      e.stopPropagation();
      selectBox(box);
    });

    insertNodeAtCursor(box);
    selectBox(box);
       // ⭐ ①-1: FREE 이동 연결
enableFreeMove(box);

// ⭐ FLOW ↔ FREE 전환 (더블클릭)
box.addEventListener("dblclick", e => {
  e.stopPropagation();

  const isFree = box.classList.toggle("free");

  // ⭐ 핵심: FREE 이동 중엔 편집기 개입 차단
  box.setAttribute(
    "contenteditable",
    isFree ? "false" : "true"
  );

  // FREE → FLOW 복귀 시 좌표 정리
  if (!isFree) {
    box.style.left = "";
    box.style.top  = "";
  }
});

    // ② 이미지 비동기 로딩
const img = document.createElement("img");

// ⭐⭐⭐ 이게 핵심
img.draggable = false;
img.addEventListener("dragstart", e => e.preventDefault());

const url = URL.createObjectURL(file);
img.src = url;
img.decoding = "async";
img.loading = "eager";
img.style.display = "block";
img.style.maxWidth = "100%";
img.style.height = "auto";
img.onload = () => URL.revokeObjectURL(url); 
box.appendChild(img); 
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
    document
      .querySelectorAll(".hb-img-selected")
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
     8) 외부 API (배선판 전용)
  =================================================== */
  return {
    insert,
    align,
    remove
  };

})();


   




