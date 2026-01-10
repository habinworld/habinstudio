/* ======================================================
   editor-autosave.js / 2026.01.08
====================================================== */
(function () {

  const AUTOSAVE_INTERVAL = 5000; // 5초
  const BASE_KEY  = window.HABIN_STORAGE_KEY || "habin_posts";
  const DRAFT_KEY = BASE_KEY + "_autosave_draft";
  const ALERT_KEY = BASE_KEY + "_autosave_alerted";

  function initAutoSave() {
    const titleEl = document.getElementById("hb-title");
    const editorEl = document.getElementById("hb-editor");

    // 아직 editor DOM이 없으면 대기
    if (!titleEl || !editorEl) return false;

    let alerted = localStorage.getItem(ALERT_KEY) === "1";

    // 🔁 5초 자동저장
    setInterval(() => {
      if (!titleEl.value && !editorEl.innerHTML) return;

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          title: titleEl.value,
          content: editorEl.innerHTML,
          time: Date.now()
        })
      );

      // 🔔 자동저장 알림 (딱 1번만)
      if (!alerted) {
        alerted = true;
        localStorage.setItem(ALERT_KEY, "1");
        showAutoSaveNotice();
      }
    }, AUTOSAVE_INTERVAL);

    // 🔄 최초 로드 시 복구
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved && !titleEl.value && !editorEl.innerHTML) {
      try {
        const d = JSON.parse(saved);
        titleEl.value = d.title || "";
        editorEl.innerHTML = d.content || "";
      } catch (e) {}
    }

    return true;
  }

  // ⏳ editor가 생성될 때까지 대기
  const wait = setInterval(() => {
    if (initAutoSave()) clearInterval(wait);
  }, 300);

  // 🔔 알림 UI
  function showAutoSaveNotice() {
    const notice = document.createElement("div");
    notice.textContent = "/자동저장/";
    notice.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0,0,0,0.75);
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      z-index: 9999;
      opacity: 0;
      transition: opacity .3s;
    `;
    document.body.appendChild(notice);

    requestAnimationFrame(() => {
      notice.style.opacity = "1";
    });

    setTimeout(() => {
      notice.style.opacity = "0";
      setTimeout(() => notice.remove(), 400);
    }, 2000);
  }

})();
