// ==============================
// 커서가 화면 안에 보이게 26. 5. 4
// ==============================
function hbEnsureCaretVisible() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);

  const rect = range.getClientRects()[0];
  if (!rect) return;

  const editor = document.getElementById('hb-editor');
  if (!editor) return;

  const editorRect = editor.getBoundingClientRect();

  if (rect.top < editorRect.top) {
    editor.scrollTop -= (editorRect.top - rect.top) + 20;
  }

  if (rect.bottom > editorRect.bottom) {
    editor.scrollTop += (rect.bottom - editorRect.bottom) + 20;
  }
}

// ==============================
// selection 처리
// ==============================

function hbHandleSelectionChange() {
  hbEnsureCaretVisible();
// ==============================
  // 기존 툴바 상태 업데이트
  // ==============================
  if (typeof hbUpdateToolbarState === 'function') {
    hbUpdateToolbarState();
 }
 }
// ==============================
// 이벤트 연결
// ==============================
function hbBindSelectionEvents() {
  const editor = document.getElementById('hb-editor');
  if (!editor) return;

  document.addEventListener('selectionchange', hbHandleSelectionChange);
  editor.addEventListener('keyup', hbHandleSelectionChange);
  editor.addEventListener('mouseup', hbHandleSelectionChange);
  editor.addEventListener('click', hbHandleSelectionChange);
}

// ==============================
// 실행
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  hbBindSelectionEvents();

  if (typeof hbSetInitialToolbarLabels === 'function') {
    hbSetInitialToolbarLabels();
  }

  if (typeof hbUpdateToolbarState === 'function') {
    hbUpdateToolbarState();
  }
});
