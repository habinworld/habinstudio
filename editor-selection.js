// ==============================
// 커서가 화면 안에 보이게
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
// 이벤트 연결
// ==============================
function hbBindSelectionEvents() {
  const editor = document.getElementById('hb-editor');
  if (!editor) return;

  document.addEventListener('selectionchange', hbEnsureCaretVisible);

  editor.addEventListener('keyup', hbEnsureCaretVisible);
  editor.addEventListener('mouseup', hbEnsureCaretVisible);
}

// ==============================
// 실행
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  hbBindSelectionEvents();
});
