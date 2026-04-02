/* ==============================
   hb-trace.js
============================== */

(function () {
  const HB_TRACE_KEY = 'hb_trace_items';

  const hbTraceToggle = document.getElementById('hb-trace-toggle');
  const hbTraceBox = document.getElementById('hb-trace-box');
  const hbTraceName = document.getElementById('hb-trace-name');
  const hbTraceText = document.getElementById('hb-trace-text');
  const hbTraceBtn = document.getElementById('hb-trace-btn');
  const hbTraceList = document.getElementById('hb-trace-list');

  if (!hbTraceToggle || !hbTraceBox || !hbTraceName || !hbTraceText || !hbTraceBtn || !hbTraceList) return;

  function hbTraceGetItems() {
    return JSON.parse(localStorage.getItem(HB_TRACE_KEY) || '[]');
  }

  function hbTraceSetItems(items) {
    localStorage.setItem(HB_TRACE_KEY, JSON.stringify(items));
  }

  function hbTraceMakeGuestName() {
    const number = Math.floor(Math.random() * 9000) + 1000;
    return '익명' + number;
  }

  function hbTraceEscapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function hbTraceFormatDate(dateValue) {
    const d = new Date(dateValue);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';

    if (hours === 0) hours = 12;
    if (hours > 12) hours = hours - 12;

    const hourText = period === '오전'
      ? String(hours).padStart(2, '0')
      : String(hours);

    return `${year}년 ${month}월 ${day}일 · ${period} ${hourText}시 ${minutes}분`;
  }

  function hbTraceRender() {
    const items = hbTraceGetItems();

    if (!items.length) {
      hbTraceList.innerHTML = '<div class="hb-trace-empty">아직 남겨진 흔적이 없습니다.</div>';
      return;
    }

    hbTraceList.innerHTML = items.slice(0, 5).map(function (item) {
      return `
        <div class="hb-trace-item">
          <div class="hb-trace-meta">
            ${hbTraceEscapeHtml(item.name)} · ${hbTraceFormatDate(item.date)}
          </div>
          <div class="hb-trace-text">
            ${hbTraceEscapeHtml(item.text).replaceAll('\n', '<br>')}
          </div>
        </div>
      `;
    }).join('');
  }

  function hbTraceOpen() {
    hbTraceBox.classList.add('is-open');
    hbTraceToggle.textContent = '닫기';
  }

  function hbTraceClose() {
    hbTraceBox.classList.remove('is-open');
    hbTraceToggle.textContent = '흔적 남기기';
  }

  function hbTraceResetForm() {
    hbTraceName.value = '';
    hbTraceText.value = '';
  }

  hbTraceToggle.addEventListener('click', function () {
    const isOpen = hbTraceBox.classList.contains('is-open');

    if (isOpen) {
      hbTraceClose();
      return;
    }

    hbTraceOpen();
    setTimeout(function () {
      hbTraceName.focus();
    }, 180);
  });

  hbTraceBtn.addEventListener('click', function () {
    const name = hbTraceName.value.trim() || hbTraceMakeGuestName();
    const text = hbTraceText.value.trim();

    if (!text) {
      hbTraceText.focus();
      return;
    }

    const items = hbTraceGetItems();

    items.unshift({
      id: Date.now(),
      name: name,
      text: text,
      date: new Date().toISOString()
    });

    hbTraceSetItems(items);
    hbTraceRender();
    hbTraceResetForm();

    /* 입력 후 자동 닫힘 */
    hbTraceClose();
  });

  hbTraceRender();
})();
