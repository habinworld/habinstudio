/* -----------------------------------------------------
   🌞 Ha-Bin Studio — weather.js (GPS 자동 위치 감지 업그레이드)
   기존 UI, 아이콘, 바람세기 출력 그대로 유지
----------------------------------------------------- */

let LAT = 37.5665;   // 기본값 (서울)
let LON = 126.9780;

/* -----------------------------------------------------
   📌 1) GPS 위치 자동 감지
----------------------------------------------------- */
function detectLocation() {
  if (!navigator.geolocation) {
    console.log("GPS 사용 불가 → 서울 기본값 사용");
    startWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      LAT = pos.coords.latitude;
      LON = pos.coords.longitude;
      console.log("📍 위치 감지 성공:", LAT, LON);
      startWeather();
    },
    () => {
      console.log("GPS 거부/실패 → 서울 기본값 사용");
      startWeather();
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
}

/* -----------------------------------------------------
   📌 2) 지역명 가져오기 (Reverse Geocoding)
----------------------------------------------------- */
async function fetchCityName() {
  const el = document.getElementById("weather-location");
  if (!el) return;

  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${LAT}&longitude=${LON}`;

    const res = await fetch(url);
    const data = await res.json();

    const city =
      data?.results?.[0]?.name ||
      data?.results?.[0]?.admin2 ||
      data?.results?.[0]?.admin1 ||
      "Unknown";

    el.textContent = city;

  } catch (err) {
    el.textContent = "지역 오류";
  }
}

/* -----------------------------------------------------
   📌 3) 날씨 정보 가져오기
   (기존 UI 유지: 아이콘 + 온도 + 바람세기)
----------------------------------------------------- */
async function fetchWeather() {
  const box = document.getElementById("weather-box");
  if (!box) return;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.current_weather) {
      box.textContent = "날씨 정보 없음";
      return;
    }

    const w = data.current_weather;
    const icon = convertWeatherCode(w.weathercode);

    // 📌 기존 UI 그대로 유지
    box.innerHTML = `${icon} ${w.temperature}°C · 바람 ${w.windspeed}m/s`;

  } catch (err) {
    box.textContent = "날씨 오류";
  }
}

/* -----------------------------------------------------
   📌 4) 기존 아이콘 변환 코드 그대로 유지
----------------------------------------------------- */
function convertWeatherCode(code) {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌦️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 95) return "⛈️";
  return "🌤";
}

/* -----------------------------------------------------
   📌 5) 실행 + 30분 자동 갱신
   (기존 흐름 그대로)
----------------------------------------------------- */
function startWeather() {
  fetchCityName();
  fetchWeather();

  setInterval(() => {
    fetchCityName();
    fetchWeather();
  }, 30 * 60 * 1000);
}

/* -----------------------------------------------------
   📌 6) 페이지 로딩 시 GPS 먼저 실행
----------------------------------------------------- */
detectLocation();

   
