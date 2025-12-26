// image-input.js
(function () {
  const input = document.getElementById("hb-image-input");
  if (!input || window.__HB_IMAGE_INPUT_BOUND__) return;

  input.addEventListener("change", e => {
    const file = e.target.files && e.target.files[0];
    file && window.EditorCore && EditorCore.insertImage(file);
    e.target.value = "";
  });

  window.__HB_IMAGE_INPUT_BOUND__ = true;
})();

