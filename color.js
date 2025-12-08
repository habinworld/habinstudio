/* -----------------------------------------------------
   🌈⚒ Ha-Bin Studio — color.js Stable v3.4
   Excel Palette + Theme Colors + Inline Clean Engine
   (toolbar.js와 완전 호환)
----------------------------------------------------- */

let currentColorType = "color";  
// "color" = 글자색,  "background" = 배경색

/* -----------------------------------------------------
   1) 팝업 UI 초기 생성
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
   2) 테마/표준 색상 생성
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
   3) 팝업 이벤트
----------------------------------------------------- */
function activateColorEvents() {
  const popup = document.getElementById("hb-color-popup");

  popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("hb-color-box")) {
      applyColor(e.target.dataset.color);
      popup.style.display = "none";
    }
  });

  document.getElementById("hb-more-color").addEventListener("click", () => {
    const picker = document.createElement("input");
    picker.type = "color";
    picker.style.visibility = "hidden";

    picker.addEventListener("input", () => {
      applyColor(picker.value);
    });

    document.body.appendChild(picker);
    picker.click();
  });
}

/* -----------------------------------------------------
   4) 색 적용 (중복 span 방지)
----------------------------------------------------- */
function applyColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const parent = range.commonAncestorContainer.parentElement;

  if (parent && parent.tagName === "SPAN") {
    if (currentColorType === "color") parent.style.color = color;
    else parent.style.backgroundColor = color;
    return;
  }

  const span = document.createElement("span");
  if (currentColorType === "color") span.style.color = color;
  else span.style.backgroundColor = color;

  try {
    range.surroundContents(span);
  } catch {
    const extracted = range.extractContents();
    span.appendChild(extracted);
    range.insertNode(span);
  }
}

/* -----------------------------------------------------
   5) 팝업 열기 (toolbar.js에서 호출)
----------------------------------------------------- */
function hbOpenColorPopup(type) {
  currentColorType = type;

  const popup = document.getElementById("hb-color-popup");
  const btn = type === "color"
    ? document.querySelector("#textColorBtn")
    : document.querySelector("#bgColorBtn");

  const rect = btn.getBoundingClientRect();

  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 8;

  const width = 230;
  if (left + width > window.innerWidth - 10) left = window.innerWidth - width - 10;

  popup.style.left = left + "px";
  popup.style.top = top + "px";
  popup.style.display = "block";
}

/* -----------------------------------------------------
   6) 바깥 클릭 시 닫기
----------------------------------------------------- */
document.addEventListener("click", (e) => {
  const popup = document.getElementById("hb-color-popup");
  if (!popup || popup.style.display === "none") return;

  const inside =
    popup.contains(e.target) ||
    e.target.closest("#textColorBtn") ||
    e.target.closest("#bgColorBtn");

  if (!inside) popup.style.display = "none";
});


