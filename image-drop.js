/* ---------------------------------------------------
   📎 image-drop.js — Drag & Drop Image
---------------------------------------------------- */
(function () {
  const editor = document.getElementById("hb-editor");
  if (!editor) return;

  // 드롭 허용
  editor.addEventListener("dragover", e => {
    e.preventDefault();
  });

  // 파일 드롭
  editor.addEventListener("drop", e => {
    e.preventDefault();
    const files = e.dataTransfer && e.dataTransfer.files;
    if (!files || !files.length) return;

    const file = files[0];
    file && window.ImageEngine && ImageEngine.insert(file);
  });
})();

