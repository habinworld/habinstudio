/* -----------------------------------------------------
   🕒 Ha-Bin Studio — datetime_clock.js (최종 통합본)
   - 날짜/시간 + 아날로그 시계
   - 구분점: 또렷한 중간점 " • "
   - 색상: 짙은 주황(#D35400)
   - 오전/오후 규칙 100% 반영
   - 초침 없음 / 숫자 없음
   - 1분 단위 갱신 (가벼움 + 정확성)
----------------------------------------------------- */

/* 날짜 + 시간 표시 */
function updateDateTime() {
  const el = document.getElementById("current-datetime");
  if (!el) return;

  // 날짜 글자색 적용 (주황)
  el.style.color = "#D35400";
   
  const now = new Date();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const weekday = weekdays[now.getDay()];

  let hour = now.getHours();
  const minute = now.getMinutes().toString().padStart(2, "0");

  const ampm = hour < 12 ? "오전" : "오후";

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  // 오전은 "07시" / 오후는 "7시"
  const hourStr =
    ampm === "오전"
      ? hour.toString().padStart(2, "0")
      : hour.toString();

  /* 날짜 출력 최종 포맷 */
  el.textContent =
    `${year}. ${month}. ${date}. (${weekday})  •  ${ampm}  ${hourStr}:${minute}`;
}

/* 아날로그 시계 */
function drawClock() {
  const canvas = document.getElementById("clock");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const r = canvas.width / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(r, r);

  const now = new Date();
  let hour = now.getHours() % 12;
  let minute = now.getMinutes();

  const hourAngle = (Math.PI / 6) * hour + (Math.PI / 360) * minute;
  const minAngle = (Math.PI / 30) * minute;

  /* 테두리 — 남색 (#001F3F) */
  ctx.beginPath();
  ctx.arc(0, 0, r - 5, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#3A67C9";
  ctx.stroke();

  /* 시침 */
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#001F3F";
  ctx.moveTo(0, 0);
  ctx.rotate(hourAngle);
  ctx.lineTo(0, -(r * 0.45));
  ctx.stroke();
  ctx.rotate(-hourAngle);

  /* 분침 */
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#001F3F";
  ctx.moveTo(0, 0);
  ctx.rotate(minAngle);
  ctx.lineTo(0, -(r * 0.65));
  ctx.stroke();
  ctx.rotate(-minAngle);

  ctx.translate(-r, -r);
}

/* 실행 함수 */
function startDateTimeClock() {
  updateDateTime();
  drawClock();

  setInterval(() => {
    updateDateTime();
    drawClock();
  }, 1000 * 60); // 1분마다 갱신
}

