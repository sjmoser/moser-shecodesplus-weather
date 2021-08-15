function formatDate(date) {
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
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
  return `${day} ${hour}:${minutes}`;
}

function displayWeatherCondition(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#current-day-time");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let currentWeatherIconElement = document.querySelector("#current-temp-icon");

  celsiusTemperature = response.data.main.temp;

  cityElement.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  descriptionElement.innerHTML = response.data.weather[0].main;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  currentWeatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentWeatherIconElement.setAttribute(
    "alt",
    response.data.weather[0].description
  );
}

function searchCity(city) {
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "6632ae1c5ce039c21cbcc5b78a4a6d00";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#current-temp");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

let dateElement = document.querySelector("#current-day-time");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#city-form");
searchForm.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-info-button");
currentButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity("Tucson");
