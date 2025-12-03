/* -----------------------------------------------------
   🌈⚒ Ha-Bin Studio — color.js
   Excel Palette + Theme Colors + Photoshop Picker
   글자색/배경색 통합 엔진
----------------------------------------------------- */

let currentColorType = "color";  
// "color" = 글자색  /  "background" = 배경색

/* -----------------------------------------------------
   🔥 1) 팝업 UI 생성
----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.createElement("div");
  popup.id = "hb-color-popup";
  popup.style.display = "none";
  popup.className = "hb-color-popup";
  document.body.appendChild(popup);

  popup.innerHTML = `
      <div class="hb-section-title">자동</div>
      <div class="hb-color-row">
        <div class="hb-color-box" data-color="#000000"></div>
      </div>

      <div class="hb-section-title">테마 색</div>
      <div class="hb-color-grid hb-theme-colors"></div>

      <div class="hb-section-title">표준 색</div>
      <div class="hb-color-row hb-standard-colors"></div>

      <button id="hb-more-color" class="hb-more-btn">다른 색(M)…</button>
  `;

  generateThemeColors();
  generateStandardColors();
  activateColorEvents();
});

/* -----------------------------------------------------
   🔥 2) 색상 목록 생성 (엑셀과 동일 구조)
----------------------------------------------------- */
function generateThemeColors() {
  const themeColors = [
    "#000000","#44546A","#5B9BD5","#ED7D31","#A5A5A5","#FFC000",
    "#FFFFFF","#E7E6E6","#D2DEEF","#FBE5D6","#EDEDED","#FFF2CC",
    "#F2F2F2","#D9D9D9","#B4C6E7","#F8CBAD","#DBDBDB","#FFE699",
    "#D0CECE","#AEAAAA","#8EAADB","#F4B183","#C9C9C9","#FFD966",
    "#A6A6A6","#7F7F7F","#2F5597","#C55A11","#7B7B7B","#BF9000"
  ];
  const grid = document.querySelector(".hb-theme-colors");

  themeColors.forEach(c => {
    const box = document.createElement("div");
    box.className = "hb-color-box";
    box.dataset.color = c;
    box.style.background = c;
    grid.appendChild(box);
  });
}

function generateStandardColors() {
  const standardColors = [
    "#FF0000","#FF9900","#FFFF00","#00B050","#00B0F0",
    "#0070C0","#7030A0","#FF66CC","#999999","#333333"
  ];
  const row = document.querySelector(".hb-standard-colors");

  standardColors.forEach(c => {
    const box = document.createElement("div");
    box.className = "hb-color-box";
    box.dataset.color = c;
    box.style.background = c;
    row.appendChild(box);
  });
}

/* -----------------------------------------------------
   🔥 3) 팝업 이벤트 연결
----------------------------------------------------- */
function activateColorEvents() {
  const popup = document.getElementById("hb-color-popup");

  // 색상 클릭 → 스타일 적용
  popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("hb-color-box")) {
      const color = e.target.dataset.color;
      applyColor(color);
      popup.style.display = "none";
    }
  });

  // 다른 색(M)… → HTML color input 사용
  document.getElementById("hb-more-color").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "color";
    input.style.visibility = "hidden";

    input.addEventListener("input", () => {
      applyColor(input.value);
    });

    document.body.appendChild(input);
    input.click();
  });
}

/* -----------------------------------------------------
   🔥 4) 실제 스타일 적용
----------------------------------------------------- */
function applyColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const wrapper = document.createElement("span");

  if (currentColorType === "color") {
    wrapper.style.color = color;
  } else {
    wrapper.style.backgroundColor = color;
  }

  try {
    range.surroundContents(wrapper);
  } catch {
    let c = range.extractContents();
    wrapper.appendChild(c);
    range.insertNode(wrapper);
  }
}

/* -----------------------------------------------------
   🔥 5) 팝업 열기 함수 (툴바에서 호출)
----------------------------------------------------- */
function openColorPopup(type) {
  currentColorType = type;   // color / background
  const popup = document.getElementById("hb-color-popup");
  const btn = (type === "color")
    ? document.querySelector("#textColorBtn")
    : document.querySelector("#bgColorBtn");

  const rect = btn.getBoundingClientRect();

  popup.style.left = rect.left + "px";
  popup.style.top = (rect.bottom + 6) + "px";
  popup.style.display = "block";
}

/* -----------------------------------------------------
   🔥 6) 클릭하면 팝업 닫기 (바깥 영역)
----------------------------------------------------- */
document.addEventListener("click", (e) => {
  const popup = document.getElementById("hb-color-popup");
  if (!popup) return;

  if (
    !popup.contains(e.target) &&
    !e.target.closest("#textColorBtn") &&
    !e.target.closest("#bgColorBtn")
  ) {
    popup.style.display = "none";
  }
});

