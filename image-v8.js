/* ---------------------------------------------------
   🖼 image-v8.js — 이미지 삽입 엔진 (전역 안정판)
   Ha-Bin Studio · window.ImageEngine 등록 버전
---------------------------------------------------- */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");

  /* ---------------------------------------------
        이미지 삽입
  --------------------------------------------- */
  function insert(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "hb-editor-image";

      // 기본 스타일
      img.style.maxWidth = "100%";
      img.style.display = "block";
      img.style.margin = "10px auto";

      insertNodeAtCursor(img);
    };

    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------
        커서 위치에 노드 삽입
  --------------------------------------------- */
  function insertNodeAtCursor(node) {
    const sel = window.getSelection();

    if (!sel || sel.rangeCount === 0) {
      editor.appendChild(node);
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);

    // 삽입 후 커서를 이미지 다음으로 이동
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ---------------------------------------------
        이미지 정렬
        dir = "left" | "center" | "right"
  --------------------------------------------- */
  function align(dir) {
    const img = getSelectedImage();
    if (!img) return;

    if (dir === "left") {
      img.style.margin = "10px 0 10px 0";
      img.style.display = "block";
      img.style.marginLeft = "0";
      img.style.marginRight = "auto";
    }
    else if (dir === "center") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
    }
    else if (dir === "right") {
      img.style.display = "block";
      img.style.marginLeft = "auto";
      img.style.marginRight = "0";
    }
  }

  /* ---------------------------------------------
        현재 선택된 이미지 반환
  --------------------------------------------- */
  function getSelectedImage() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    const node = sel.anchorNode;

    // 이미지 직접 선택한 경우
    if (node.nodeName === "IMG") return node;

    // 이미지 내부 텍스트 선택 시
    if (node.parentNode && node.parentNode.nodeName === "IMG") {
      return node.parentNode;
    }

    return null;
  }

  /* ---------------------------------------------
        외부 API
  --------------------------------------------- */
  return {
    insert,
    align
  };

})();




