/* -----------------------------------------------------
   🌞 Ha-Bin Studio — weather.js (GPS + 옥천 fallback)
----------------------------------------------------- */

/* --------------------------------------------
  📌 1) 현재 위치 가져오기 (GPS)
--------------------------------------------- */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("not-supported");
    } else {
      navigator.geolocation.getCurrentPosition(
        pos => resolve(pos.coords),
        err => reject(err)
      );
    }
  });
}

/* --------------------------------------------
  📌 2) 지역명 가져오기 (Reverse Geocoding)
--------------------------------------------- */
async function fetchCityName(lat, lon) {
  const el = document.getElementById("weather-location");
  if (!el) return;

  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;

    const res = await fetch(url);
    const data = await res.json();

    const city = data?.results?.[0]?.name || "옥천";
    el.textContent = city;
  } catch (err) {
    el.textContent = "옥천"; // 오류 시 기본
  }
}

/* --------------------------------------------
  📌 3) 날씨 정보 가져오기
--------------------------------------------- */
async function fetchWeather(lat, lon) {
  const box = document.getElementById("weather-box");
  if (!box) return;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.current_weather) {
      box.textContent = "날씨 정보를 가져올 수 없음";
      return;
    }

    const { temperature, windspeed, weathercode } = data.current_weather;
    const icon = convertWeatherCode(weathercode);

    box.innerHTML = `${icon} ${temperature}°C · 바람 ${windspeed}m/s`;

  } catch (err) {
    box.textContent = "날씨 오류(옥천)";
  }
}

/* --------------------------------------------
  📌 4) Weather code → 이모지
--------------------------------------------- */
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

/* --------------------------------------------
  📌 5) 실행 (GPS + 옥천 fallback)
--------------------------------------------- */
async function startWeather() {
  let lat = 36.3010;   // 옥천 fallback 좌표
  let lon = 127.5707;

  try {
    const pos = await getCurrentPosition();
    lat = pos.latitude;
    lon = pos.longitude;
  } catch (err) {
    console.warn("GPS 실패 → 옥천 fallback 적용");
  }

  fetchCityName(lat, lon);
  fetchWeather(lat, lon);

  // 30분마다 날씨 갱신
  setInterval(() => fetchWeather(lat, lon), 30 * 60 * 1000);
}

   
