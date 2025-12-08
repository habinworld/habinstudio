/* -----------------------------------------------------
   🌈⚒ Ha-Bin Studio — color.js v4.0
   초즉시반응형 색상 엔진 + Toolbar v4.0 완전호환
----------------------------------------------------- */

let hbColorMode = "color"; // "color" = 글자색, "background" = 배경색

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.createElement("div");
  popup.id = "hb-color-popup";
  popup.className = "hb-color-popup";
  popup.style.display = "none";
  document.body.appendChild(popup);

  popup.innerHTML = `
    <div class="hb-section-title">자동</div>
    <div class="hb-color-row">
      <div class="hb-color-box" data-color="#000000" style="background:#000000"></div>
    </div>

    <div class="hb-section-title">테마 색</div>
    <div class="hb-color-grid hb-theme"></div>

    <div class="hb-section-title">표준 색</div>
    <div class="hb-color-row hb-standard"></div>

    <button id="hb-more-color" class="hb-more-btn">다른 색(M)…</button>
  `;

  hbGenerateTheme();
  hbGenerateStandard();
  hbBindColorEvents();
});

/* -----------------------------------------------------
   🎨 테마 색
----------------------------------------------------- */
function hbGenerateTheme() {
  const colors = [
    "#000000","#44546A","#5B9BD5","#ED7D31","#A5A5A5","#FFC000",
    "#FFFFFF","#E7E6E6","#D2DEEF","#FBE5D6","#EDEDED","#FFF2CC",
    "#F2F2F2","#D9D9D9","#B4C6E7","#F8CBAD","#DBDBDB","#FFE699",
    "#D0CECE","#AEAAAA","#8EAADB","#F4B183","#C9C9C9","#FFD966",
    "#A6A6A6","#7F7F7F","#2F5597","#C55A11","#7B7B7B","#BF9000"
  ];

  const grid = document.querySelector(".hb-theme");
  colors.forEach(c => {
    const box = document.createElement("div");
    box.className = "hb-color-box";
    box.dataset.color = c;
    box.style.background = c;
    grid.appendChild(box);
  });
}

/* -----------------------------------------------------
   🎨 표준 색
----------------------------------------------------- */
function hbGenerateStandard() {
  const colors = [
    "#FF0000","#FF9900","#FFFF00","#00B050","#00B0F0",
    "#0070C0","#7030A0","#FF66CC","#999999","#333333"
  ];

  const row = document.querySelector(".hb-standard");
  colors.forEach(c => {
    const box = document.createElement("div");
    box.className = "hb-color-box";
    box.dataset.color = c;
    box.style.background = c;
    row.appendChild(box);
  });
}

/* -----------------------------------------------------
   🎨 팝업 이벤트
----------------------------------------------------- */
function hbBindColorEvents() {
  const popup = document.getElementById("hb-color-popup");

  popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("hb-color-box")) {
      hbApplyColor(e.target.dataset.color);
      popup.style.display = "none";
    }
  });

  document.getElementById("hb-more-color").addEventListener("click", () => {
    const picker = document.createElement("input");
    picker.type = "color";
    picker.style.visibility = "hidden";

    picker.addEventListener("input", () => {
      hbApplyColor(picker.value);
    });

    document.body.appendChild(picker);
    picker.click();
  });
}

/* -----------------------------------------------------
   🎨 색 적용 엔진 (v4.0 즉시반응)
----------------------------------------------------- */
function hbApplyColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // 선택 영역 없음 → 향후 typing 스타일 유지
  if (range.collapsed) {
    document.execCommand(
      hbColorMode === "color" ? "foreColor" : "hiliteColor",
      false,
      color
    );
    return;
  }

  // 선택 영역 있음 → 완전 래핑
  document.execCommand("styleWithCSS", false, true);

  if (hbColorMode === "color") {
    document.execCommand("foreColor", false, color);
  } else {
    document.execCommand("hiliteColor", false, color);
  }
}

/* -----------------------------------------------------
   🎨 팝업 열기 (toolbar.js → 여기 호출)
----------------------------------------------------- */
function hbOpenColorPopup(type) {
  hbColorMode = type;

  const popup = document.getElementById("hb-color-popup");
  const btn = type === "color"
    ? document.querySelector("#textColorBtn")
    : document.querySelector("#bgColorBtn");

  const rect = btn.getBoundingClientRect();

  popup.style.left = rect.left + window.scrollX + "px";
  popup.style.top = rect.bottom + window.scrollY + 8 + "px";
  popup.style.display = "block";
}

/* -----------------------------------------------------
   🎨 바깥 클릭 → 팝업 닫기
----------------------------------------------------- */
document.addEventListener("click", (e) => {
  const popup = document.getElementById("hb-color-popup");
  if (!popup || popup.style.display === "none") return;

  const keep =
    popup.contains(e.target) ||
    e.target.closest("#textColorBtn") ||
    e.target.closest("#bgColorBtn");

  if (!keep) popup.style.display = "none";
});


