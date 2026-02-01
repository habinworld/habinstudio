/* ============================================================
   image-store-clean.js ///// 2026.01.31
   - 유령 이미지(Ghost) 정리 엔진
   - 관리자 화면에서만 실행
   - ImageStore 외부 계약(save/load/remove) 변경 없음
============================================================ */
window.ImageStoreClean = (function () {

  const DB_NAME = "habin_image_db";
  const STORE_NAME = "images";
  const DB_VERSION = 1;

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = () => {}; // 이미 image-store.js에서 생성함
    });
  }

  function collectUsedImageIdsFromPosts(allPosts) {
    const used = new Set();

    allPosts.forEach(p => {
      const html = p?.content || "";
      if (!html) return;

      const temp = document.createElement("div");
      temp.innerHTML = html;

      temp.querySelectorAll(".hb-img-box[data-img-id]").forEach(box => {
        const id = box.dataset.imgId;
        if (id) used.add(id);
      });
    });

    return used;
  }

  async function listAllIds() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteMany(ids) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      ids.forEach(id => store.delete(id));

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function scanGhosts() {
    const allPosts = JSON.parse(localStorage.getItem("habin_posts") || "[]");
    const usedIds = collectUsedImageIdsFromPosts(allPosts);
    const allIds = await listAllIds();

    const ghostIds = allIds.filter(id => !usedIds.has(String(id)));

    return {
      usedCount: usedIds.size,
      allCount: allIds.length,
      ghostCount: ghostIds.length,
      ghostIds
    };
  }

  async function run({ dryRun = true } = {}) {
    const r = await scanGhosts();
    if (!dryRun && r.ghostIds.length) {
      await deleteMany(r.ghostIds);
      // 삭제 후 재스캔해서 결과 확정
      return await scanGhosts();
    }
    return r;
  }

  return { run };

})();

