/* ==========================================================
   🎨 color-advanced.js — Final Stable Edition
   Ha-Bin Studio · Advanced RGBA Color Engine
   window.ColorAdvancedEngine 등록 버전
========================================================== */

window.ColorAdvancedEngine = (function () {

  const popup = document.getElementById("hb-popup-color-advanced");
  let isOpen = false;

  // RGBA 값 저장
  let R = 0, G = 0, B = 0, A = 1;


  /* --------------------------------------------------------
        📌 1) 팝업 UI 렌더링
  --------------------------------------------------------- */
  function renderPopup() {
    popup.innerHTML = ""; 

    popup.style.position = "absolute";
    popup.style.padding = "14px";
    popup.style.background = "#FFFFFF";
    popup.style.border = "1px solid #D0D0D0";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    popup.style.width = "240px";
    popup.style.display = "block";
    popup.style.zIndex = "9999";
    popup.style.fontFamily = "Noto Sans KR, sans-serif";
    popup.style.fontSize = "14px";


    /* ---------- 미리보기 ---------- */
    const preview = document.createElement("div");
    preview.style.height = "40px";
    preview.style.border = "1px solid #CCC";
    preview.style.borderRadius = "6px";
    preview.style.marginBottom = "12px";
    preview.style.background = `rgba(${R},${G},${B},${A})`;
    preview.id = "hb-adv-preview";


    /* ---------- 슬라이더 공통 함수 ---------- */
    function makeSlider(label, value, min, max, step, onInput) {
      const wrap = document.createElement("div");
      wrap.style.marginBottom = "10px";

      const title = document.createElement("div");
      title.textContent = `${label}: ${value}`;
      title.className = "hb-adv-label";

      const input = document.createElement("input");
      input.type = "range";
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = value;
      input.style.width = "100%";

      input.addEventListener("input", function () {
        title.textContent = `${label}: ${this.value}`;
        onInput(this.value);
        updatePreview();
      });

      wrap.appendChild(title);
      wrap.appendChild(input);
      return wrap;
    }


    /* ---------- 프리뷰 업데이트 ---------- */
    function updatePreview() {
      const box = document.getElementById("hb-adv-preview");
      if (box) {
        box.style.background = `rgba(${R},${G},${B},${A})`;
      }
    }


    /* ---------- 버튼 영역 ---------- */
    const btnArea = document.createElement("div");
    btnArea.style.textAlign = "right";
    btnArea.style.marginTop = "10px";

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "적용";
    applyBtn.style.padding = "6px 12px";
    applyBtn.style.background = "#3558A8";
    applyBtn.style.color = "#FFF";
    applyBtn.style.border = "none";
    applyBtn.style.borderRadius = "6px";
    applyBtn.style.cursor = "pointer";
    applyBtn.style.marginRight = "6px";

    applyBtn.addEventListener("click", function () {
      const rgba = `rgba(${R},${G},${B},${A})`;
      EditorCore.applyColor(rgba);
      close();
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "취소";
    cancelBtn.style.padding = "6px 12px";
    cancelBtn.style.background = "#777";
    cancelBtn.style.color = "#FFF";
    cancelBtn.style.border = "none";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.cursor = "pointer";

    cancelBtn.addEventListener("click", close);

    btnArea.appendChild(applyBtn);
    btnArea.appendChild(cancelBtn);


    /* --------------------------------------------------------
         📌 최종적으로 구성 요소를 popup에 넣기
    --------------------------------------------------------- */
    popup.appendChild(preview);

    popup.appendChild(makeSlider("R", R, 0, 255, 1, v => R = Number(v)));
    popup.appendChild(makeSlider("G", G, 0, 255, 1, v => G = Number(v)));
    popup.appendChild(makeSlider("B", B, 0, 255, 1, v => B = Number(v)));
    popup.appendChild(makeSlider("A", A, 0, 1, 0.01, v => A = Number(v)));

    popup.appendChild(btnArea);
  }


  /* --------------------------------------------------------
        📌 2) 팝업 열기
  --------------------------------------------------------- */
  function openAt(x, y) {
    if (isOpen) {
      close();
      return;
    }

    renderPopup();

    popup.style.left = x + "px";
    popup.style.top = y + "px";
    popup.style.display = "block";

    isOpen = true;

    setTimeout(() => {
      document.addEventListener("click", handleOutside, { once: true });
    }, 0);
  }


  /* --------------------------------------------------------
        📌 3) 팝업 닫기
  --------------------------------------------------------- */
  function close() {
    popup.style.display = "none";
    isOpen = false;
  }

  function handleOutside(e) {
    if (!popup.contains(e.target)) {
      close();
    }
  }

  /* --------------------------------------------------------
        📌 외부 API
  --------------------------------------------------------- */
  return {
    openAt,
    close
  };

})();




