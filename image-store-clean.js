/* ============================================================
   image-store-clean.js / 2026.01.31
   ImageStore GC Engine — 유령 이미지 정리 전용
   관리자 모드에서만 사용
============================================================ */

window.ImageStoreClean = (function () {

  function collectUsedImageIdsFromPosts(allPosts) {
    const used = new Set();

    allPosts.forEach(p => {
      const html = p.content || "";
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
    const db = await indexedDB.open("habin_image_db");
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("habin_image_db");

      req.onsuccess = e => {
        const _db = e.target.result;
        const tx = _db.transaction("images", "readonly");
        const store = tx.objectStore("images");
        const keysReq = store.getAllKeys();

        keysReq.onsuccess = () => resolve(keysReq.result || []);
        keysReq.onerror = () => reject(keysReq.error);
      };
    });
  }

  async function runGC({ dryRun = true } = {}) {
    const allPosts = JSON.parse(localStorage.getItem("habin_posts") || "[]");

    const usedIds = collectUsedImageIdsFromPosts(allPosts);
    const allIds  = await listAllIds();

    const ghostIds = allIds.filter(id => !usedIds.has(String(id)));

    if (!dryRun) {
      for (const id of ghostIds) {
        await ImageStore.remove(id);
      }
    }

    return {
      usedCount: usedIds.size,
      allCount: allIds.length,
      ghostCount: ghostIds.length,
      ghostIds
    };
  }

  return { runGC };

})();

