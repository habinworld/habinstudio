/* -----------------------------------------------------
   🎨 Ha-Bin Studio — color.js v5.0
   - 빠른 8색 / 즉시반응 글자색·배경색
   - advanced-color.js와 완전 분리
   - 팝업 없는 초간단 즉시컬러 선택기
----------------------------------------------------- */

const QUICK_COLORS = [
  "#000000", // 검정
  "#7F7F7F", // 진회색
  "#C3C3C3", // 밝은회색
  "#FFFFFF", // 흰색
  "#C00000", // 빨강
  "#1F4E79", // 파랑
  "#548235", // 초록
  "#ED7D31"  // 주황
];

/* ------------------------------------------
   1) 퀵컬러 호출 — toolbar.js에서 버튼 클릭 시 실행
------------------------------------------ */
function hbQuickColor(type) {
  hbColorMode = type; /* type = "color" or "background" */

  // 팝업 없이 바로 적용 → 최근 사용색 1개로 기록
  openQuickPalette();
}

/* ------------------------------------------
   2) 퀵팔레트 생성 (툴바 아래 자동 위치)
------------------------------------------ */
function openQuickPalette() {
  // 기존 팝업 제거
  const old = document.getElementById("hb-quick-color");
  if (old) old.remove();

  const wrap = document.createElement("div");
  wrap.id = "hb-quick-color";
  wrap.style.position = "absolute";
  wrap.style.top = (lastClickedButton.getBoundingClientRect().bottom + window.scrollY + 6) + "px";
  wrap.style.left = (lastClickedButton.getBoundingClientRect().left + window.scrollX) + "px";
  wrap.style.background = "#FFF";
  wrap.style.padding = "8px";
  wrap.style.border = "1px solid #CCC";
  wrap.style.borderRadius = "6px";
  wrap.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
  wrap.style.display = "flex";
  wrap.style.gap = "6px";
  wrap.style.zIndex = "9999";
  wrap.style.animation = "hbSlide 0.12s ease-out";

  QUICK_COLORS.forEach(c => {
    const chip = document.createElement("div");
    chip.style.width = "22px";
    chip.style.height = "22px";
    chip.style.background = c;
    chip.style.border = "1px solid #444";
    chip.style.borderRadius = "4px";
    chip.style.cursor = "pointer";

    chip.onclick = () => {
      applyQuickColor(c);
      wrap.remove();
    };

    wrap.appendChild(chip);
  });

  document.body.appendChild(wrap);
}

/* ------------------------------------------
   3) 빠른색 즉시 적용
------------------------------------------ */
function applyQuickColor(color) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const r = sel.getRangeAt(0);

  const span = document.createElement("span");

  if (hbColorMode === "color") span.style.color = color;
  else span.style.backgroundColor = color;

  const frag = r.extractContents();
  span.appendChild(frag);
  r.insertNode(span);
}

/* ------------------------------------------
   4) 외부 클릭 시 닫기
------------------------------------------ */
document.addEventListener("click", e => {
  const quick = document.getElementById("hb-quick-color");
  if (!quick) return;

  if (e.target.closest("#hb-quick-color")) return;
  if (e.target.id === "quickTextColor" || e.target.id === "quickBgColor") return;

  quick.remove();
});

