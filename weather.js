/* -----------------------------------------------------
   🌞 Ha-Bin Studio — weather.js (햇살결계 통합버전)
   지역명 + 날씨 완전 자동 표시
   - Open-Meteo 무료 API
   - 좌표: 서울(37.5665, 126.9780)
   - 30분 자동 업데이트
----------------------------------------------------- */

const LAT = 37.5665;
const LON = 126.9780;

/* --------------------------------------------
  📌 1) 지역명 자동 가져오기 (Reverse Geocoding)
--------------------------------------------- */
async function fetchCityName() {
  const el = document.getElementById("weather-location");
  if (!el) return;

  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${LAT}&longitude=${LON}`;

    const res = await fetch(url);
    const data = await res.json();

    const city = data?.results?.[0]?.name || "서울";
    el.textContent = city;
  } catch (err) {
    el.textContent = "서울"; // 오류 시 기본값
  }
}

/* --------------------------------------------
  📌 2) 날씨 정보 가져오기
--------------------------------------------- */
async function fetchWeather() {
  const box = document.getElementById("weather-box");
  if (!box) return;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current_weather=true`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.current_weather) {
      box.textContent = "날씨 정보를 가져올 수 없음";
      return;
    }

    const weather = data.current_weather;
    const temp = weather.temperature;
    const wind = weather.windspeed;
    const code = weather.weathercode;

    const icon = convertWeatherCode(code);

    // 🌤 최종 출력
    box.innerHTML = `${icon} ${temp}°C · 바람 ${wind}m/s`;

  } catch (err) {
    box.textContent = "날씨 오류(서울 백업)";
  }
}

/* --------------------------------------------
  📌 3) 날씨 코드 → 이모지 변환
--------------------------------------------- */
function convertWeatherCode(code) {
  if (code === 0) return "☀️";               // 맑음
  if (code >= 1 && code <= 3) return "⛅";   // 약간~많은 구름
  if (code >= 45 && code <= 48) return "🌫️"; // 안개
  if (code >= 51 && code <= 67) return "🌦️"; // 비/이슬비
  if (code >= 71 && code <= 77) return "❄️"; // 눈
  if (code >= 80 && code <= 82) return "🌧️"; // 소나기
  if (code >= 95) return "⛈️";               // 뇌우
  return "🌤";
}

/* --------------------------------------------
  📌 4) 실행 + 30분 자동 갱신
--------------------------------------------- */
function startWeather() {
  fetchCityName();   // 🌍 지역명 자동 표시
  fetchWeather();    // 🌤 날씨 표시
  setInterval(fetchWeather, 30 * 60 * 1000); // 30분 자동 갱신
}


