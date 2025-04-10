const API_KEY = "c257090dc2124a0cb4251022251004";

async function getWeather() {
  const query = document.getElementById("locationInput").value.trim();
  const weatherDiv = document.getElementById("weather");

  if (!query) {
    weatherDiv.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&aqi=yes&alerts=no`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      weatherDiv.innerHTML = `<p>Location not found.</p>`;
      return;
    }

    const condition = data.current.condition.text.toLowerCase();
    let weatherClass = "";

    if (condition.includes("sun")) {
      weatherClass = "sunny";
    } else if (condition.includes("cloud")) {
      weatherClass = "cloudy";
    } else if (condition.includes("rain")) {
      weatherClass = "rainy";
    } else if (condition.includes("snow")) {
      weatherClass = "snowy";
    } else if (condition.includes("fog") || condition.includes("mist")) {
      weatherClass = "foggy";
    }

    document.body.className = "";
    if (weatherClass) {
      document.body.classList.add(weatherClass);
    }

    weatherDiv.innerHTML = `
      <h2>${data.location.name}, ${data.location.country}</h2>
      <img src="https:${data.current.condition.icon}" alt="weather icon">
      <p><strong>${data.current.temp_c}°C</strong> (Feels like: ${data.current.feelslike_c}°C)</p>
      <p>${data.current.condition.text}</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Wind: ${data.current.wind_kph} km/h</p>
      <p>AQI: ${data.current.air_quality.pm2_5?.toFixed(2) || "N/A"}</p>
      <p>Last updated: ${data.current.last_updated}</p>
    `;

    const allHours = data.forecast.forecastday[0].hour;
    const currentHour = new Date().getHours();
    const hourly = allHours.filter(hour => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime >= currentHour;
    });

    let hourlyHTML = '<h3>Hourly Forecast</h3><div class="hourly">';
    hourly.forEach(hour => {
      const time = hour.time.split(" ")[1];
      hourlyHTML += `
        <div class="hour-block">
          <p><strong>${time}</strong></p>
          <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
          <p>${hour.temp_c}°C</p>
        </div>
      `;
    });
    hourlyHTML += '</div>';
    weatherDiv.innerHTML += hourlyHTML;

  } catch (error) {
    console.error("Network or code error:", error);
    weatherDiv.innerHTML = "<p>Error fetching weather data.</p>";
  }
}

// Attach event listener to the button
document.getElementById("getWeatherBtn").addEventListener("click", getWeather);