/* -----------------------------------------------------
   🌞 Ha-Bin Studio — weather.js (햇살결계)
   Open-Meteo 무료 API 사용 (CORS 문제 없음)
   - 서울 기준
   - 30분 자동 업데이트
----------------------------------------------------- */

async function fetchWeather() {
  const box = document.getElementById("weather-box");
  if (!box) return;

  try {
    // 📌 Open-Meteo API (무료 / 인증 필요 없음 / CORS OK)
    const url =
      "https://api.open-meteo.com/v1/forecast?" +
      "latitude=37.5665&longitude=126.9780&current_weather=true";

    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.current_weather) {
      box.textContent = "날씨 정보를 가져올 수 없습니다.";
      return;
    }

    const weather = data.current_weather;
    const temp = weather.temperature;
    const wind = weather.windspeed;
    const code = weather.weathercode;

    // 🌤 간단한 날씨 코드 → 이모지 변환
    const icon = convertWeatherCode(code);

    box.innerHTML = `${icon} ${temp}°C · 바람 ${wind}m/s`;

  } catch (err) {
    box.textContent = "날씨 오류(서울 백업 활성화)";
  }
}

/* --------------------------------------------
  📌 날씨 코드 → 아이콘 변환
--------------------------------------------- */
function convertWeatherCode(code) {
  if (code === 0) return "☀️";            // 맑음
  if (code >= 1 && code <= 3) return "⛅"; // 구름 조금~많음
  if (code >= 45 && code <= 48) return "🌫️"; // 안개
  if (code >= 51 && code <= 67) return "🌦️"; // 이슬비/비
  if (code >= 71 && code <= 77) return "❄️"; // 눈
  if (code >= 80 && code <= 82) return "🌧️"; // 소나기
  if (code >= 95) return "⛈️";            // 천둥번개
  return "🌤";
}

/* --------------------------------------------
  📌 실행 + 30분 자동 갱신
--------------------------------------------- */
function startWeather() {
  fetchWeather(); // 최초 실행
  setInterval(fetchWeather, 30 * 60 * 1000); // 30분 갱신
}

