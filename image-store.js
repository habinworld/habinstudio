/* =====================================================
   image-store.js
   IndexedDB 기반 ImageStore (FINAL CLEAN)
   -----------------------------------------------------
   외부 계약 (절대 불변)
   - ImageStore.save(file, cb)
   - ImageStore.load(id) -> Promise<string|null>
   - ImageStore.remove(id)
===================================================== */
window.ImageStore = (function () {

  const DB_NAME = "habin_image_db";
  const STORE_NAME = "images";
  const DB_VERSION = 1;

  let db = null;

  /* DB 열기 */
  function openDB() {
    if (db) return Promise.resolve(db);

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = e => {
        const _db = e.target.result;
        if (!_db.objectStoreNames.contains(STORE_NAME)) {
          _db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      req.onsuccess = e => {
        db = e.target.result;
        resolve(db);
      };

      req.onerror = () => reject(req.error);
    });
  }

  /* 저장 */
  function save(file, callback) {
    if (!file) return;
    const id = "img_" + Date.now();

    openDB().then(db => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      store.put({
        id,
        blob: file,       // Blob 그대로
        createdAt: Date.now()
      });

      tx.oncomplete = () => callback && callback(id);
    });
  }

  /* 로드 */
  function load(id) {
    if (!id) return Promise.resolve(null);

    return openDB().then(db => {
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => {
          if (!req.result) return resolve(null);
          resolve(URL.createObjectURL(req.result.blob));
        };

        req.onerror = () => resolve(null);
      });
    });
  }

  /* 삭제 */
  function remove(id) {
    if (!id) return;
    openDB().then(db => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
    });
  }

  return { save, load, remove };

})();
