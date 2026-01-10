/* ======================================================
   editor-autosave.js / 2026.01.10
   Ha-Bin Studio — Auto Save Engine (WORLD SAFE)
   - 한글/영어 세계 분리
   - 10초 자동저장
   - 저장될 때마다 /자동저장/ 알림
   - 속도 영향 없음
====================================================== */
(function () {

  /* ⏱ 자동저장 주기 */
  const AUTOSAVE_INTERVAL = 10000; 

  /* 🌍 세계 기반 키 (핵심) */
  function getDraftKey() {
  const base = window.HABIN_STORAGE_KEY || "habin_posts";
  const id   = window.POST_ID ?? "new";
  return `${base}_autosave_draft_${id}`;
}

  function initAutoSave() {
    const titleEl  = document.getElementById("hb-title");
    const editorEl = document.getElementById("hb-editor");

    // editor DOM 아직 없으면 대기
    if (!titleEl || !editorEl) return false;

    /* 🔁 자동저장 루프 */
    setInterval(() => {
      // 사람이 보기 기준으로 내용 없으면 저장 안 함
      if (
        !titleEl.value.trim() &&
        !editorEl.innerText.trim()
      ) return;

      // 자동저장
       const DRAFT_KEY = getDraftKey();
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          title: titleEl.value,
          content: editorEl.innerHTML,
          time: Date.now()
        })
      );

      // 🔔 그냥 매번 알림
      showAutoSaveNotice();

    }, AUTOSAVE_INTERVAL);

    /* 🔄 최초 로드 시 초안 복구 */
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved && !titleEl.value && !editorEl.innerText.trim()) {
      try {
        const d = JSON.parse(saved);
        titleEl.value = d.title || "";
        editorEl.innerHTML = d.content || "";
      } catch (e) {}
    }

    return true;
  }

  /* ⏳ editor 생성될 때까지 대기 */
  const wait = setInterval(() => {
    if (initAutoSave()) clearInterval(wait);
  }, 300);

  /* 🔔 자동저장 알림 UI */
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
      pointer-events: none;
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

