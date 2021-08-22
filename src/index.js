function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col-2" id="tomorrow-forecast">
              <div class="weather-forecast-date">${formatDay(
                forecastDay.dt
              )}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }.png"
                alt="rainy"
                width="45"
              />
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-temperature-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>
                <span class="weather-forecast-temperature-min">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </div>
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  console.log(response.data.main.temp_max);
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#current-day-time");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let currentWeatherIconElement = document.querySelector("#current-temp-icon");
  let maxTemperatureElement = document.querySelector("#max-temp");
  let minTemperatureElement = document.querySelector("#min-temp");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  maxTemperatureElement.innerHTML = Math.round(response.data.main.temp_max);
  minTemperatureElement.innerHTML = Math.round(response.data.main.temp_min);
  currentWeatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIconElement.setAttribute(
    "alt",
    response.data.weather[0].description
  );

  getForecast(response.data.coord);
}

function displayHourly(response) {
  let hourlyForecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector("#hourly-forecast");
  let hourlyForecastHTML = `<div class="clearfix">`;
  hourlyForecast.forEach(function (forecastHour) {
    hourlyForecastHTML =
      hourlyForecastHTML +
      `<div>
              <span class="time"></span><span class="temp"></span
              ><span class="hourly-icon"
                ><img
                  src="http://openweathermap.org/img/wn/${forecastHour.weather[0].icon}@2x.png"
                  alt=""
                  width="30"
              /></span>
            </div>
`;
  });
  hourlyForecastHTML = hourlyForecastHTML + `</div>`;
  hourlyForecast.innerHTML = hourlyForecastHTML;
  let temperatureElement = document.querySelector("temp");
  let city = search(city);
  let currentWeatherIconElement = document.querySelector("hourly-icon");
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let apiUrl = `pro.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayHourly);
}

function search(city) {
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function searchLocation(position) {
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-info-button");
currentButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Tucson");
displayForecast();
