/* -----------------------------------------------------
   🌞 Ha-Bin Studio — datetime_clock.js (fetch 대응 정식판)
----------------------------------------------------- */

(function () {
  let dateTimer = null;
  let clockTimer = null;

  /* 날짜 + 시간 */
  function updateDateTime() {
    const el = document.getElementById("current-datetime");
    if (!el) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const week = ["일","월","화","수","목","금","토"];
    const day = week[now.getDay()];

    let hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "오후" : "오전";

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    el.innerHTML = `
      ${year}. ${month}. ${date}. (${day})
      <span style="color:#999;">•</span>
      ${ampm} ${hour}:${minute}
    `;
  }

  /* 아날로그 시계 */
  function updateClock() {
    const hourHand = document.querySelector(".hand.hour");
    const minuteHand = document.querySelector(".hand.minute");
    const secondHand = document.querySelector(".hand.second");
    if (!hourHand || !minuteHand || !secondHand) return;

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours   = now.getHours();

    secondHand.style.transform = `rotate(${seconds * 6}deg)`;
    minuteHand.style.transform =
      `rotate(${minutes * 6 + seconds * 0.1}deg)`;
    hourHand.style.transform =
      `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
  }

  /* ⭐ 명시적 시작 함수 */
  function startDateTimeClock() {
    if (!dateTimer) {
      updateDateTime();
      dateTimer = setInterval(updateDateTime, 1000);
    }

    if (!clockTimer) {
      updateClock();
      clockTimer = setInterval(updateClock, 1000);
    }
  }

  // 전역에 노출 (fetch 이후 호출용)
  window.startDateTimeClock = startDateTimeClock;
})();

