/* -----------------------------------------------------
   🎨 Ha-Bin Studio — advanced-color.js v5.0
   - 엑셀 기본 40색 + 확장 팔레트
   - 텍스트/배경 선택 지원
   - 팝업 위치 자동 보정
   - 애니메이션 슬라이드
----------------------------------------------------- */

let hbColorPopup = null;
let hbColorMode = "color";  // color or background
let lastClickedButton = null;

/* -----------------------------------------------------
   Excel 표준 40색
----------------------------------------------------- */
const EXCEL_COLORS = [
  // Row 1 — 테마 10색
  "#000000", "#7F7F7F", "#C3C3C3", "#FFFFFF",
  "#1F497D", "#4F81BD", "#C0504D", "#9BBB59", "#8064A2", "#4BACC6",

  // Row 2 — 진한 10색
  "#F2F2F2", "#D8D8D8", "#BFBFBF", "#A5A5A5",
  "#7F7F7F", "#595959", "#3F3F3F", "#262626", "#0D0D0D", "#333F50",

  // Row 3 — 밝은 10색
  "#F2F5FB", "#DCE6F2", "#BDD7EE", "#9BC2E6",
  "#2E75B6", "#1F4E79", "#FFC7CE", "#F4B084", "#DFA67B", "#FFE699",

  // Row 4 — 추가 10색
  "#EBF1DE", "#C6E0B4", "#A9D18E", "#548235",
  "#D9D2E9", "#B4A7D6", "#8E7CC3", "#5B9BD5", "#ED7D31", "#70AD47"
];

/* 총 40색 완성 */


/* -----------------------------------------------------
   팝업 생성 (중복 방지)
----------------------------------------------------- */
function hbOpenColorPopup(mode) {
  hbColorMode = mode;

  // 기존 팝업 제거
  if (hbColorPopup) hbColorPopup.remove();
  hbColorPopup = document.createElement("div");
  hbColorPopup.className = "hb-color-popup";

  // 40색 생성
  EXCEL_COLORS.forEach(c => {
    const box = document.createElement("div");
    box.className = "hb-color-box";
    box.style.background = c;

    box.onclick = () => {
      applyColor(c);
      hbColorPopup.style.display = "none";
    };

    hbColorPopup.appendChild(box);
  });

  document.body.appendChild(hbColorPopup);

  // 팝업 위치는 마지막 클릭된 버튼 아래
  if (lastClickedButton) {
    const r = lastClickedButton.getBoundingClientRect();
    hbColorPopup.style.left = (r.left + window.scrollX) + "px";
    hbColorPopup.style.top  = (r.bottom + window.scrollY + 4) + "px";
  }

  hbColorPopup.style.display = "flex";
  hbColorPopup.style.animation = "hbSlide 0.12s ease-out";
}


/* -----------------------------------------------------
   버튼에서 호출되는 Wrapper
----------------------------------------------------- */
document.addEventListener("click", e => {
  if (e.target.id === "textColorBtn") {
    lastClickedButton = e.target;
    hbOpenColorPopup("color");
  }

  if (e.target.id === "bgColorBtn") {
    lastClickedButton = e.target;
    hbOpenColorPopup("background");
  }
});


/* -----------------------------------------------------
   색상 적용
----------------------------------------------------- */
function applyColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);

  // 선택 영역 span으로 감싸기
  const span = document.createElement("span");

  if (hbColorMode === "color") {
    span.style.color = color;
  } else {
    span.style.backgroundColor = color;
  }

  const frag = range.extractContents();
  span.appendChild(frag);
  range.insertNode(span);
}


/* -----------------------------------------------------
   팝업 외부 클릭 → 닫기
----------------------------------------------------- */
document.addEventListener("click", e => {
  if (!hbColorPopup) return;

  if (e.target.closest(".hb-color-popup")) return;
  if (e.target.id === "textColorBtn" || e.target.id === "bgColorBtn") return;

  hbColorPopup.style.display = "none";
});

