// image-store.js (TEST)
window.ImageStore = (function () {
  const KEY = "habin_images_test";

  function loadAll() {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  }

  function saveAll(store) {
    localStorage.setItem(KEY, JSON.stringify(store));
  }

  function save(file) {
    const store = loadAll();
    const id = "img_" + Date.now();

    const reader = new FileReader();
    reader.onload = () => {
      store[id] = {
        data: reader.result, // ⚠️ 테스트용 base64 (나중에 제거)
        createdAt: Date.now()
      };
      saveAll(store);
      console.log("✅ 이미지 저장 성공:", id);
    };
    reader.readAsDataURL(file);

    return id;
  }

  function load(id) {
    const store = loadAll();
    return store[id]?.data || null;
  }

  return { save, load };
})();
