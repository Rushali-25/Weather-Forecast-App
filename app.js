console.log("Weather Forecast App Loaded!");



// Function to handle fetching weather data
async function fetchWeather(city) {
    console.log(`Fetching weather for ${city}`);
}
const API_KEY = 'your_api_key_here'; // Replace with your OpenWeatherMap API key

// Fetch weather data from the API
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error(error);
        document.getElementById("weather-display").innerHTML =
            `<p class="text-red-500">${error.message}</p>`;
    }
}

// Display weather data in the UI
function displayWeather(data) {
    const weatherContainer = document.getElementById("weather-display");

    const { name, main, weather, wind } = data;
    weatherContainer.innerHTML = `
        <div class="bg-white p-4 rounded shadow-md">
            <h2 class="text-2xl font-bold">${name}</h2>
            <p class="text-lg">${weather[0].description.toUpperCase()}</p>
            <p>🌡️ Temperature: ${main.temp}°C</p>
            <p>💧 Humidity: ${main.humidity}%</p>
            <p>🌬️ Wind Speed: ${wind.speed} m/s</p>
        </div>
    `;
}

// Add event listener to the search button
document.getElementById("search-button").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
});
// Fetch weather for current location
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("Unable to fetch weather for your location!");

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error(error);
        document.getElementById("weather-display").innerHTML =
            `<p class="text-red-500">${error.message}</p>`;
    }
}

// Get user's location and fetch weather
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error(error);
                document.getElementById("weather-display").innerHTML =
                    `<p class="text-red-500">Unable to access location. Please enable location services.</p>`;
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Add event listener to the location button
document.getElementById("location-button").addEventListener("click", getLocation);
const recentCities = [];

// Update recent cities dropdown
function updateRecentCities(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        const dropdown = document.getElementById("recent-cities");
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    }
}

// Fetch weather for a selected recent city
document.getElementById("recent-cities").addEventListener("change", (event) => {
    const city = event.target.value;
    if (city) fetchWeather(city);
});

// Modify fetchWeather to include saving cities
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        displayWeather(data);
        updateRecentCities(city); // Add to recent cities
    } catch (error) {
        console.error(error);
        document.getElementById("weather-display").innerHTML =
            `<p class="text-red-500">${error.message}</p>`;
    }
}
// Fetch extended forecast data
async function fetchExtendedForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("Unable to fetch extended forecast!");

        const data = await response.json();
        displayExtendedForecast(data);
    } catch (error) {
        console.error(error);
        document.getElementById("forecast-container").innerHTML =
            `<p class="text-red-500">${error.message}</p>`;
    }
}

// Display extended forecast data
function displayExtendedForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Clear previous data

    const forecastList = data.list.filter((item) => item.dt_txt.includes("12:00:00")); // Get daily forecasts

    forecastList.forEach((forecast) => {
        const { dt_txt, main, weather, wind } = forecast;
        const date = new Date(dt_txt).toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' });
        forecastContainer.innerHTML += `
            <div class="bg-white p-4 rounded shadow-md text-center">
                <h3 class="text-xl font-bold">${date}</h3>
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}" class="mx-auto" />
                <p>${weather[0].description.toUpperCase()}</p>
                <p>🌡️ Temp: ${main.temp}°C</p>
                <p>💧 Humidity: ${main.humidity}%</p>
                <p>🌬️ Wind: ${wind.speed} m/s</p>
            </div>
        `;
    });
}

// Modify fetchWeather to include extended forecast fetching
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        displayWeather(data);
        updateRecentCities(city); // Add to recent cities
        fetchExtendedForecast(city); // Fetch 5-day forecast
    } catch (error) {
        console.error(error);
        document.getElementById("weather-display").innerHTML =
            `<p class="text-red-500">${error.message}</p>`;
    }
}
// Display error messages
function displayError(message) {
    document.getElementById("weather-display").innerHTML = `
        <div class="text-center text-red-500">
            <p>⚠️ ${message}</p>
        </div>`;
    document.getElementById("forecast-container").innerHTML = ""; // Clear extended forecast
}

// Modify error handling in fetchWeather and fetchExtendedForecast
async function fetchWeather(city) {
    if (!city) {
        displayError("Please enter a valid city name.");
        return;
    }
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("City not found!");

        const data = await response.json();
        displayWeather(data);
        updateRecentCities(city);
        fetchExtendedForecast(city);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}
