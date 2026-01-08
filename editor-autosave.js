// editor-autosave.js(2026.01.08)
(function () {

  const AUTOSAVE_INTERVAL = 5000; // 5초
  const DRAFT_KEY = "habin_autosave_draft";

  const titleEl = document.getElementById("hb-title");
  const editorEl = document.getElementById("hb-editor");

  if (!titleEl || !editorEl) return;

  // 자동저장
  setInterval(() => {
    const draft = {
      title: titleEl.value,
      content: editorEl.innerHTML,
      time: Date.now()
    };

    // 빈 글은 저장 안 함
    if (!draft.title && !draft.content) return;

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, AUTOSAVE_INTERVAL);

  // 로드 시 자동 복구
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved) {
    try {
      const draft = JSON.parse(saved);

      if (!titleEl.value && !editorEl.innerHTML) {
        titleEl.value = draft.title || "";
        editorEl.innerHTML = draft.content || "";
      }
    } catch (e) {
      console.warn("autosave draft broken");
    }
  }

})();
