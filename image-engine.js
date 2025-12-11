/* ==========================================================
   🖼 image-engine.js — Final Stable Edition
   Ha-Bin Studio ImageEngine
   - window.ImageEngine 등록
   - 이미지 삽입 / 선택 / 리사이즈 / 정렬 지원
========================================================== */

window.ImageEngine = (function () {

  const editor = document.getElementById("hb-editor");

  let selectedImg = null;
  let handle = null;
  let startX = 0;
  let startWidth = 0;


  /* --------------------------------------------------------
       📌 1) 파일 → Base64 변환 후 callback(base64)
  --------------------------------------------------------- */
  function load(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  }


  /* --------------------------------------------------------
       📌 2) 이미지 삽입 (EditorCore에서 호출)
  --------------------------------------------------------- */
  function insert(base64) {
    const img = document.createElement("img");
    img.src = base64;
    img.className = "hb-editor-image";
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.style.margin = "10px auto";

    editor.appendChild(img);
    attachSelectEvent(img);
    editor.focus();
  }


  /* --------------------------------------------------------
       📌 3) 이미지 선택 시 테두리 + 리사이즈 핸들 표시
  --------------------------------------------------------- */
  function attachSelectEvent(img) {
    img.addEventListener("click", function (e) {
      e.stopPropagation();
      selectImage(img);
    });
  }

  function selectImage(img) {
    removeSelect();

    selectedImg = img;
    img.style.outline = "2px solid #5C8EDB";

    // 리사이즈 핸들 생성
    handle = document.createElement("div");
    handle.style.width = "14px";
    handle.style.height = "14px";
    handle.style.background = "#5C8EDB";
    handle.style.borderRadius = "50%";
    handle.style.position = "absolute";
    handle.style.cursor = "ew-resize";
    handle.style.zIndex = "9999";

    const rect = img.getBoundingClientRect();
    positionHandle(rect);

    document.body.appendChild(handle);

    handle.addEventListener("mousedown", startResize);
  }


  /* --------------------------------------------------------
       📌 resize 핸들 위치
  --------------------------------------------------------- */
  function positionHandle(rect) {
    if (!handle) return;

    handle.style.left = rect.right - 7 + "px";
    handle.style.top  = rect.top + rect.height / 2 - 7 + "px";
  }


  /* --------------------------------------------------------
       📌 4) 리사이즈 시작
  --------------------------------------------------------- */
  function startResize(e) {
    e.preventDefault();
    startX = e.clientX;
    startWidth = selectedImg.clientWidth;

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  }

  function doResize(e) {
    if (!selectedImg) return;

    const diff = e.clientX - startX;
    const newWidth = startWidth + diff;

    if (newWidth > 50 && newWidth < editor.clientWidth) {
      selectedImg.style.width = newWidth + "px";

      // 핸들 위치 업데이트
      const rect = selectedImg.getBoundingClientRect();
      positionHandle(rect);
    }
  }

  function stopResize() {
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  }


  /* --------------------------------------------------------
       📌 5) 선택 해제(에디터 클릭 시)
  --------------------------------------------------------- */
  function removeSelect() {
    if (selectedImg) {
      selectedImg.style.outline = "none";
    }
    if (handle) {
      handle.remove();
      handle = null;
    }
    selectedImg = null;
  }

  editor.addEventListener("click", function () {
    removeSelect();
  });


  /* --------------------------------------------------------
       📌 6) EditorCore에서 호출하는 정렬
       (left, center, right)
  --------------------------------------------------------- */
  function align(direction) {
    if (!selectedImg) return;

    selectedImg.style.display = "block";
    selectedImg.style.marginTop = "10px";
    selectedImg.style.marginBottom = "10px";

    if (direction === "left") {
      selectedImg.style.marginLeft = "0";
      selectedImg.style.marginRight = "auto";
    }
    if (direction === "center") {
      selectedImg.style.marginLeft = "auto";
      selectedImg.style.marginRight = "auto";
    }
    if (direction === "right") {
      selectedImg.style.marginLeft = "auto";
      selectedImg.style.marginRight = "0";
    }

    const rect = selectedImg.getBoundingClientRect();
    positionHandle(rect);
  }


  /* --------------------------------------------------------
       📌 외부 API
  --------------------------------------------------------- */
  return {
    load,
    insert,
    align,
    selectImage
  };

})();






