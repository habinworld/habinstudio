/* -----------------------------------------------------
   🌞 Ha-Bin Studio — datetime_clock.js (통합본 최신)
   날짜/시간 + 아날로그 시계(시침·분침·초침)
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------------------
     ⏰ 1) 날짜 + 시간 업데이트
  ----------------------------------------------------- */

  function updateDateTime() {
    const el = document.getElementById("current-datetime");
    if (!el) return;

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    const week = ["일", "월", "화", "수", "목", "금", "토"];
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

  updateDateTime();
  setInterval(updateDateTime, 1000);



  /* -----------------------------------------------------
     🕒 2) 아날로그 시계 (시침·분침·초침)
  ----------------------------------------------------- */

  const hourHand = document.querySelector(".hand.hour");
  const minuteHand = document.querySelector(".hand.minute");
  const secondHand = document.querySelector(".hand.second");

  function updateClock() {
    const now = new Date();

    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secDeg  = seconds * 6;
    const minDeg  = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    if (secondHand) {
      secondHand.style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
    }

    if (minuteHand) {
      minuteHand.style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
    }

    if (hourHand) {
      hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

});

