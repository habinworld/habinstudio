/* image-paste.js */
(function () {
  const editor = document.getElementById("hb-editor");
  if (!editor) return;

  editor.addEventListener("paste", e => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type && item.type.startsWith("image/")) {
        e.preventDefault();
        ImageEngine.insert(file);
        const file = item.getAsFile();
        file && window.ImageEngine && ImageEngine.insert(file);
        return;
      }
    }
  });
})();

