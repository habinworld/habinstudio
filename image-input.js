/* ---------------------------------------------------
   🖼 image-input.js — BULLET Edition
   Ha-Bin Studio
   역할:
   - input change → EditorCore 전달
   - 단 1회 바인딩
---------------------------------------------------- */

(function () {
  const input = document.getElementById("hb-image-input");
  if (!input) return;

  input.addEventListener("change", e => {
    const file = e.target.files && e.target.files[0];
    ImageEngine.insert(file); 
    file && window.EditorCore && EditorCore.insertImage(file);
    e.target.value = "";
  });
})();

