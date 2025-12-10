const apiKey = "4e419ab345a9457b91b75056250606";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options);
  const formattedTime = now.toLocaleTimeString();
  document.getElementById("datetime").textContent = `${formattedDate}, ${formattedTime}`;
}

async function getWeather(location) {
  const resultDiv = document.getElementById("weatherResult");
  if (!location) {
    location = document.getElementById("locationInput").value.trim();
  }
  if (!location) {
    resultDiv.innerHTML = `<p class="error">Please enter a location.</p>`;
    return;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;
  resultDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();

    const tempC = data.current.temp_c;
    const tempF = data.current.temp_f;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;

    resultDiv.innerHTML = `
      <h3>${data.location.name}, ${data.location.country}</h3>
      <img src="${icon}" alt="${condition}" />
      <p><strong>Temperature:</strong> ${tempC}°C / ${tempF}°F</p>
      <p><strong>Condition:</strong> ${condition}</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

function getWeatherByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const location = `${lat},${lon}`;
      getWeather(location);
    }, error => {
      document.getElementById("weatherResult").innerHTML =
        `<p class="error">Geolocation error: ${error.message}</p>`;
    });
  } else {
    document.getElementById("weatherResult").innerHTML =
      `<p class="error">Geolocation is not supported by your browser.</p>`;
  }
}

// Auto-update time every 10 seconds
setInterval(updateDateTime, 10000);
updateDateTime();
