// ==============================
// 현재 커서 위치의 노드 찾기
// ==============================
function hbGetCurrentNode() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  let node = sel.getRangeAt(0).startContainer;

  if (node.nodeType === 3) {
    node = node.parentNode;
  }

  return node;
}
// ==============================
// 현재 스타일 읽기
// ==============================
function hbGetCurrentStyle() {
  const node = hbGetCurrentNode();
  if (!node) return null;

  const style = window.getComputedStyle(node);

  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    color: style.color,
    backgroundColor: style.backgroundColor
  };
}
// ==============================
// select 값 반영
// ==============================
function hbUpdateSelect(id, value, isFont) {
  const el = document.getElementById(id);
  if (!el) return;

  if (isFont) {
    const lower = value.toLowerCase();

    for (const opt of el.options) {
      const text = opt.text.toLowerCase();
      const val = opt.value.toLowerCase();

      if (lower.includes(text) || lower.includes(val)) {
        el.value = opt.value;
        return;
      }
    }
    return;
  }

  el.value = value;
}
// ==============================
// 줄간격 정규화
// normal / px 값을 1.x 형태로 변환
// ==============================
function hbNormalizeLineHeight(style) {
  let lh = style.lineHeight;

  if (!lh || lh === 'normal') return '1.6';

  if (lh.includes('px')) {
    const fs = parseFloat(style.fontSize);
    const lhpx = parseFloat(lh);

    if (!fs || !lhpx) return '1.6';
    return (lhpx / fs).toFixed(1);
  }
  return lh;
}
// ==============================
// 전체 툴바 상태 갱신
// ==============================
function hbUpdateToolbarState() {
  const style = hbGetCurrentStyle();
  if (!style) return;

  const fontSize = parseFloat(style.fontSize);
  const lineHeight = hbNormalizeLineHeight(style);

  hbUpdateSelect('hb-font-family', style.fontFamily, true);
  hbUpdateSelect('hb-font-size', fontSize, false);
  hbUpdateSelect('hb-line-height', lineHeight, false);

  // ==============================
  // 현재값을 버튼에 표시
  // ==============================
  const fontSelect = document.getElementById("hb-font-family");
  const fontBtn = document.getElementById("hb-font-family-btn");
  const sizeBtn = document.getElementById("hb-font-size-btn");
  const lineBtn = document.getElementById("hb-line-height-btn");

  fontBtn && fontSelect && fontSelect.selectedOptions[0] &&
    (fontBtn.innerHTML = fontSelect.selectedOptions[0].textContent + " ▼");

  sizeBtn &&
    (sizeBtn.innerHTML = fontSize + " ▼");

  lineBtn &&
    (lineBtn.innerHTML = lineHeight + " ▼");
}
// ==============================
// 초기 툴바 기본값 표시
// ==============================
function hbSetInitialToolbarLabels() {
  const fontBtn = document.getElementById("hb-font-family-btn");
  const sizeBtn = document.getElementById("hb-font-size-btn");
  const lineBtn = document.getElementById("hb-line-height-btn");

  fontBtn && (fontBtn.innerHTML = "함초롱 ▼");
  sizeBtn && (sizeBtn.innerHTML = "16 ▼");
  lineBtn && (lineBtn.innerHTML = "1.6 ▼");
}
