// image-store.js (TEST)
window.ImageStore = (function () {
  const KEY = "habin_images_test";

  function loadAll() {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  }

  function saveAll(store) {
    localStorage.setItem(KEY, JSON.stringify(store));
  }

  function save(file, callback) {
    const store = loadAll();
    const id = "img_" + Date.now();

    const reader = new FileReader();
    reader.onload = () => {
      store[id] = {
        data: reader.result,
        createdAt: Date.now()
      };
      saveAll(store);
      console.log("✅ 이미지 저장 완료:", id);

      // 🔑 저장 끝난 다음에 알려줌
      callback(id);
    };
    reader.readAsDataURL(file);
  }

  function load(id) {
    const store = loadAll();
    return store[id]?.data || null;
  }

  return { save, load };
})();
