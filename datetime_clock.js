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

    // 날짜
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 두 자리 월
    const date = String(now.getDate()).padStart(2, "0");       // 두 자리 일

    // 요일
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const day = week[now.getDay()];

    // 시간
    let hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "오후" : "오전";

    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    // 출력 (하빈 스타일 포맷)
    el.innerHTML = `
      ${year}. ${month}. ${date}. (${day}) 
      <span style="color:#999;">•</span> 
      ${ampm} ${hour}:${minute}
    `;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);


/* -----------------------------------------------------
   🕒 2) 아날로그 시계 (시침·분침·초침) — 최종 확정본
----------------------------------------------------- */

const hourHand = document.querySelector(".hand.hour");
const minuteHand = document.querySelector(".hand.minute");
const secondHand = document.querySelector(".hand.second");

function updateClock() {
  const now = new Date();

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secDeg  = seconds * 6;                         // 초침: 60초 → 360도
  const minDeg  = minutes * 6 + seconds * 0.1;         // 분침: 분 + 초 반영
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;   // 시침: 시 + 분 반영

  if (secondHand) {
    // 초침: 회전만 적용
    secondHand.style.transform = `rotate(${secDeg}deg)`;
    secondHand.style.transform = `rotate(${secDeg * 20}deg)`; 
  }

  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minDeg}deg)`;
  }

  if (hourHand) {
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
  }
}

updateClock();
setInterval(updateClock, 1000);
