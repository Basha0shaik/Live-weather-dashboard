const API_KEY = "API_KEY";

let currentUnit = "metric";
let currentLocation = null;

function updateTimeBackground() {
    const hour = new Date().getHours();

    document.body.classList.remove(
        "time-day",
        "time-evening",
        "time-night"
    );

    if (hour >= 6 && hour < 17) {
        document.body.classList.add("time-day");
    } 
    else if (hour >= 17 && hour < 20) {
        document.body.classList.add("time-evening");
    } 
    else {
        document.body.classList.add("time-night");
    }
}

updateTimeBackground();

setInterval(updateTimeBackground, 60000);


// =========================================================
// 1. GEOCODING
// =========================================================

async function getCoordinates(city) {

    const url =
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Location search failed.");
    }

    const locations = await response.json();

    if (!locations.length) {
        throw new Error("Location not found.");
    }

    return locations[0];
}


// =========================================================
// REVERSE GEOCODING
// =========================================================

async function getLocationName(lat, lon) {

    const url =
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Reverse location search failed.");
    }

    const locations = await response.json();

    if (!locations.length) {
        throw new Error("Location name not found.");
    }

    return locations[0];
}


// =========================================================
// 2. CURRENT WEATHER
// =========================================================

async function getCurrentWeather(lat, lon) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Current weather request failed.");
    }

    return await response.json();
}


// =========================================================
// 3. 5-DAY / 3-HOUR FORECAST
// =========================================================

async function getForecast(lat, lon) {

    const url =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Forecast request failed.");
    }

    return await response.json();
}


// =========================================================
// 4. AIR QUALITY
// =========================================================

async function getAirQuality(lat, lon) {

    const url =
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Air quality request failed.");
    }

    return await response.json();
}


// =========================================================
// 5. WEATHER ICON
// =========================================================

function getWeatherIcon(weatherMain) {

    const weather = weatherMain.toLowerCase();

    if (weather === "clear") {
        return "assets/sun.png";
    }

    if (
        weather === "rain" ||
        weather === "drizzle" ||
        weather === "thunderstorm"
    ) {
        return "assets/Raiinn.png";
    }

    if (weather === "clouds") {
        return "assets/cloud.png";
    }

    // Use cloud icon for conditions we don't have a separate image for
    if (
        weather === "snow" ||
        weather === "mist" ||
        weather === "fog" ||
        weather === "haze"
    ) {
        return "assets/cloud.png";
    }

    return "assets/cloud.png";
}


// =========================================================
// 6. FORMAT DATE
// =========================================================

function formatDate(timestamp, timezone) {

    const date =
        new Date((timestamp + timezone) * 1000);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}


// =========================================================
// 7. FORMAT TIME
// =========================================================

function formatTime(timestamp, timezone) {

    const date =
        new Date((timestamp + timezone) * 1000);

    return date
        .toISOString()
        .substring(11, 16);
}


// =========================================================
// 8. GET DAY NAME
// =========================================================

function getDayName(timestamp, timezone) {

    const date =
        new Date((timestamp + timezone) * 1000);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


// =========================================================
// 9. GET FORECAST DATE KEY
// =========================================================

function getDateKey(timestamp, timezone) {

    const date =
        new Date((timestamp + timezone) * 1000);

    return date.toISOString().substring(0, 10);
}


// =========================================================
// 10. DISPLAY CURRENT WEATHER
// =========================================================

function displayCurrentWeather(
    data,
    location
) {

    const temperatureUnit =
        currentUnit === "metric"
            ? "°C"
            : "°F";


    // -----------------------------------------------------
    // CITY
    // -----------------------------------------------------

    const cityName =
        document.getElementById("cityName");

    if (cityName) {

        cityName.textContent =
            `${location.name}${location.state ? ", " + location.state : ""}`;
    }


    // -----------------------------------------------------
    // TEMPERATURE
    // -----------------------------------------------------

    const cityTemp =
        document.getElementById("cityTemp");

    if (cityTemp) {

        cityTemp.textContent =
            Math.round(data.main.temp);
    }


    // -----------------------------------------------------
    // TEMPERATURE UNIT
    // -----------------------------------------------------

    const temperatureUnitElement =
        document.getElementById(
            "temperatureUnit"
        );

    if (temperatureUnitElement) {

        temperatureUnitElement.textContent =
            temperatureUnit;
    }


    // -----------------------------------------------------
    // WEATHER DESCRIPTION
    // -----------------------------------------------------

    const skyDesc =
        document.getElementById("skyDesc");

    if (skyDesc) {

        skyDesc.textContent =
            data.weather[0].description;
    }


    // -----------------------------------------------------
    // DATE
    // -----------------------------------------------------

    const dateElement =
        document.getElementById("date");

    if (dateElement) {

        dateElement.textContent =
            formatDate(
                data.dt,
                data.timezone
            );
    }


    // -----------------------------------------------------
    // CURRENT TIME
    // -----------------------------------------------------

    const timeElement =
        document.getElementById("time");

    if (timeElement) {

        timeElement.textContent =
            formatTime(
                data.dt,
                data.timezone
            );
    }


    // -----------------------------------------------------
    // HUMIDITY
    // -----------------------------------------------------

    const humidity =
        document.getElementById("humidity");

    if (humidity) {

        humidity.textContent =
            `${data.main.humidity}%`;
    }


    // -----------------------------------------------------
    // PRESSURE
    // -----------------------------------------------------

    const pressure =
        document.getElementById("pressure");

    if (pressure) {

        pressure.textContent =
            `${data.main.pressure} hPa`;
    }


    // -----------------------------------------------------
    // FEELS LIKE
    // -----------------------------------------------------

    const feelsLike =
        document.getElementById("feelsLike");

    if (feelsLike) {

        feelsLike.textContent =
            `${Math.round(data.main.feels_like)}${temperatureUnit}`;
    }


    // -----------------------------------------------------
    // VISIBILITY
    // -----------------------------------------------------

    const visibility =
        document.getElementById("visiblity");

    if (visibility) {

        visibility.textContent =
            `${(data.visibility / 1000).toFixed(1)} km`;
    }


    // -----------------------------------------------------
    // WEATHER ICON
    // -----------------------------------------------------

    const weatherIcon =
        document.getElementById("weatherIcon");

    if (weatherIcon) {

        weatherIcon.src =
            getWeatherIcon(
                data.weather[0].main
            );

        weatherIcon.alt =
            data.weather[0].description;
    }


    // -----------------------------------------------------
    // SUNRISE
    // -----------------------------------------------------

    const sunriseTime =
        document.getElementById("sunriseTime");

    if (sunriseTime) {

        sunriseTime.textContent =
            formatTime(
                data.sys.sunrise,
                data.timezone
            );
    }


    // -----------------------------------------------------
    // SUNSET
    // -----------------------------------------------------

    const sunsetTime =
        document.getElementById("sunsetTime");

    if (sunsetTime) {

        sunsetTime.textContent =
            formatTime(
                data.sys.sunset,
                data.timezone
            );
    }
}


// =========================================================
// 11. DISPLAY 5-DAY FORECAST
// =========================================================

function displayFiveDayForecast(forecast) {

    const container =
        document.getElementById("forecastContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const timezone = forecast.city.timezone;

    // Group forecasts by local calendar date
    const daily = {};

    forecast.list.forEach(item => {

        const dateKey =
            getDateKey(item.dt, timezone);

        if (!daily[dateKey]) {
            daily[dateKey] = [];
        }

        daily[dateKey].push(item);
    });


    // Get one forecast for each date
    const days = Object.keys(daily)
        .sort()
        .slice(0, 5)
        .map(dateKey => {

            const dayForecasts = daily[dateKey];

            // Find forecast closest to 12 PM
            return dayForecasts.reduce(
                (closest, item) => {

                    const itemHour =
                        Number(
                            new Date(
                                (item.dt + timezone) * 1000
                            )
                            .toISOString()
                            .substring(11, 13)
                        );

                    const closestHour =
                        Number(
                            new Date(
                                (closest.dt + timezone) * 1000
                            )
                            .toISOString()
                            .substring(11, 13)
                        );

                    return Math.abs(itemHour - 12) <
                        Math.abs(closestHour - 12)
                        ? item
                        : closest;

                }
            );

        });


    // Display each day
    days.forEach(item => {

        const dateKey =
            getDateKey(item.dt, timezone);

        // Create day name directly from date
        const date =
            new Date(`${dateKey}T12:00:00Z`);

        const day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    timeZone: "UTC"
                }
            );


        const temperatureUnit =
            currentUnit === "metric"
                ? "°C"
                : "°F";


        const card =
            document.createElement("div");

        card.className =
            "forecastRow";


        card.innerHTML = `

            <div>
                <strong>
                    ${day}
                </strong>
            </div>

            <div>
                <img
                    src="${getWeatherIcon(
                        item.weather[0].main
                    )}"
                    alt="${item.weather[0].description}"
                    class="forecast-icon"
                >
            </div>

            <div>
                <strong>
                    ${Math.round(
                        item.main.temp
                    )}${temperatureUnit}
                </strong>
            </div>

            <div>
                ${item.weather[0].description}
            </div>

        `;

        container.appendChild(card);
    });
}


// =========================================================
// 12. DISPLAY TODAY'S 3-HOUR FORECAST
// =========================================================

function displayTodayForecast(forecast) {

    const container =
        document.getElementById(
            "todayTempContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    const timezone =
        forecast.city.timezone;


    const todayKey =
        getDateKey(
            forecast.list[0].dt,
            timezone
        );


    const todayForecasts =
        forecast.list.filter(item => {

            return (
                getDateKey(
                    item.dt,
                    timezone
                ) === todayKey
            );
        });


    const temperatureUnit =
        currentUnit === "metric"
            ? "°C"
            : "°F";


    todayForecasts.forEach(item => {

        const time =
            formatTime(
                item.dt,
                timezone
            );


        const forecastItem =
            document.createElement("div");

        forecastItem.className =
            "todayForecastItem";


        forecastItem.innerHTML = `

            <div class="todayTime">
                ${time}
            </div>

            <img
                src="${getWeatherIcon(
                    item.weather[0].main
                )}"
                alt="${item.weather[0].description}"
            >

            <div class="todayTempValue">
                ${Math.round(item.main.temp)}${temperatureUnit}
            </div>

        `;


        container.appendChild(
            forecastItem
        );
    });
}


// =========================================================
// 13. DISPLAY AIR QUALITY
// =========================================================

function displayAirQuality(data) {

    if (
        !data ||
        !data.list ||
        !data.list.length
    ) {
        return;
    }


    const components =
        data.list[0].components;


    // -----------------------------------------------------
    // CO
    // -----------------------------------------------------

    const coValue =
        document.getElementById("coValue");

    if (coValue) {

        coValue.textContent =
            `${components.co.toFixed(1)} μg/m³`;
    }


    // -----------------------------------------------------
    // SO2
    // -----------------------------------------------------

    const so2Value =
        document.getElementById("so2Value");

    if (so2Value) {

        so2Value.textContent =
            `${components.so2.toFixed(1)} μg/m³`;
    }


    // -----------------------------------------------------
    // O3
    // -----------------------------------------------------

    const o3Value =
        document.getElementById("o3Value");

    if (o3Value) {

        o3Value.textContent =
            `${components.o3.toFixed(1)} μg/m³`;
    }


    // -----------------------------------------------------
    // NO2
    // -----------------------------------------------------

    const no2Value =
        document.getElementById("no2Value");

    if (no2Value) {

        no2Value.textContent =
            `${components.no2.toFixed(1)} μg/m³`;
    }
}


// =========================================================
// 14. CHANGE TEMPERATURE UNIT
// =========================================================

function changeUnit(unit) {

    currentUnit =
        unit;


    const celsiusBtn =
        document.getElementById(
            "celsiusBtn"
        );

    const fahrenheitBtn =
        document.getElementById(
            "fahrenheitBtn"
        );


    if (celsiusBtn) {

        celsiusBtn.classList.toggle(
            "active",
            unit === "metric"
        );
    }


    if (fahrenheitBtn) {

        fahrenheitBtn.classList.toggle(
            "active",
            unit === "imperial"
        );
    }


    if (currentLocation) {

        fetchWeather();
    }
}


// =========================================================
// SEARCH / UI STATE
// =========================================================

function setLoadingState() {

    const cityName = document.getElementById("cityName");
    const skyDesc = document.getElementById("skyDesc");
    const date = document.getElementById("date");
    const time = document.getElementById("time");

    if (cityName) {
        cityName.textContent = "Searching...";
    }

    if (skyDesc) {
        skyDesc.textContent = "Getting weather information...";
    }

    if (date) {
        date.textContent = "";
    }

    if (time) {
        time.textContent = "";
    }

    const searchIcon = document.querySelector(".searchButton");

    if (searchIcon) {
        searchIcon.style.opacity = "0.5";
        searchIcon.style.pointerEvents = "none";
    }
}


function resetSearchState() {

    const searchIcon = document.querySelector(".searchIcon");

    if (searchIcon) {
        searchIcon.style.opacity = "1";
        searchIcon.style.pointerEvents = "auto";
    }
}


function clearWeatherData() {

    const elements = {
        cityName: "City Name",
        cityTemp: "-",
        temperatureUnit: "°C",
        skyDesc: "Sky Description",
        date: "Date",
        time: "Time",
        humidity: "-",
        pressure: "-",
        feelsLike: "-",
        visiblity: "-",
        sunriseTime: "-:--",
        sunsetTime: "-:--",
        coValue: "-",
        so2Value: "-",
        o3Value: "-",
        no2Value: "-"
    };

    Object.entries(elements).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent = value;
            }
        }
    );

    const forecastContainer =
        document.getElementById("forecastContainer");

    if (forecastContainer) {
        forecastContainer.innerHTML = "";
    }

    const todayContainer =
        document.getElementById("todayTempContainer");

    if (todayContainer) {
        todayContainer.innerHTML = "";
    }
}


// =========================
// CURRENT LOCATION
// =========================

function getCurrentLocation() {

    const locationBtn = document.getElementById("locationBtn");

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    locationBtn.disabled = true;
    locationBtn.textContent = "📍 Detecting...";

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log("GPS:", lat, lon);

            try {

                locationBtn.textContent = "🌤️ Loading...";

                //Get location name from GPS coordinates
                const location = await getLocationName(lat, lon);
                console.log("REVERSE LOCATION:", location);

                // Get weather
                const weather = await getCurrentWeather(lat, lon);

                console.log("WEATHER RESPONSE:", weather);

                // Get forecast
                const forecast = await getForecast(lat, lon);

                console.log("FORECAST RESPONSE:", forecast);

                // Get AQI
                const airQuality = await getAirQuality(lat, lon);

                console.log("AQI RESPONSE:", airQuality);

                // Save location
                currentLocation = {
                    lat: lat,
                    lon: lon
                };

                // Update dashboard
                displayCurrentWeather(weather, location);
                displayFiveDayForecast(forecast);
                displayTodayForecast(forecast);
                displayAirQuality(airQuality);

                // Weather animation
                if (weather && weather.weather) {
                    applyWeatherEffects(
                        weather.weather[0].main
                    );
                    checkWeatherAlerts(weather);
                }

                // Update search box
                document.getElementById("cityInput").value =
                    location.name;

                console.log("✅ Location weather loaded!");

            } catch (error) {

                console.error(
                    "LOCATION WEATHER ERROR:",
                    error
                );

                alert(
                    "Unable to load weather.\n\n" +
                    error.message
                );

            } finally {

                locationBtn.disabled = false;
                locationBtn.textContent =
                    "📍 Use My Location";
            }
        },

        (error) => {

            console.error("GPS ERROR:", error);

            locationBtn.disabled = false;
            locationBtn.textContent =
                "📍 Use My Location";

            if (error.code === 1) {
                alert("Location permission was denied.");
            } else if (error.code === 2) {
                alert("Unable to determine your location.");
            } else if (error.code === 3) {
                alert("Location request timed out.");
            } else {
                alert("Unable to access your location.");
            }
        },

        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}


/* =====================================================
   FORECAST WEATHER ALERT
   ===================================================== */

function displayForecastAlert(forecast) {

    const container = document.getElementById("forecastAlertContainer");

    if (!container || !forecast || !forecast.list) {
        return;
    }

    container.innerHTML = "";

    const now = Date.now();

    // Look at the next 24 hours
    const next24Hours = forecast.list.filter(item => {

        const forecastTime = item.dt * 1000;

        return (
            forecastTime > now &&
            forecastTime <= now + (24 * 60 * 60 * 1000)
        );
    });

    if (next24Hours.length === 0) {
        return;
    }

    // Find upcoming severe/important weather
    const thunderstorm = next24Hours.find(item =>
        item.weather &&
        item.weather[0].main === "Thunderstorm"
    );

    const rain = next24Hours.find(item =>
        item.weather &&
        (
            item.weather[0].main === "Rain" ||
            item.weather[0].main === "Drizzle"
        )
    );

    const snow = next24Hours.find(item =>
        item.weather &&
        item.weather[0].main === "Snow"
    );

    let alertType = null;
    let alertIcon = "";
    let alertTitle = "";
    let alertMessage = "";
    let alertTime = null;

    // Highest priority: Thunderstorm
    if (thunderstorm) {

        alertType = "thunderstorm";
        alertIcon = "🌩️";
        alertTitle = "Thunderstorm Expected";
        alertMessage = "A thunderstorm is expected in the next 24 hours.";
        alertTime = thunderstorm.dt;

    }

    // Second priority: Snow
    else if (snow) {

        alertType = "snow";
        alertIcon = "❄️";
        alertTitle = "Snow Expected";
        alertMessage = "Snow is expected in the next 24 hours.";
        alertTime = snow.dt;

    }

    // Third priority: Rain
    else if (rain) {

        alertType = "rain";
        alertIcon = "🌧️";
        alertTitle = "Rain Expected";
        alertMessage = "Rain is expected in the next 24 hours.";
        alertTime = rain.dt;
    }

    // No important weather
    if (!alertType) {
        return;
    }

    const alertDate = new Date(alertTime * 1000);

    const timeText = alertDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    const alert = document.createElement("div");

    alert.className = "forecastAlert";

    alert.innerHTML = `
        <div class="forecastAlertIcon">
            ${alertIcon}
        </div>

        <div class="forecastAlertText">

            <div class="forecastAlertTitle">
                ${alertTitle}
            </div>

            <div class="forecastAlertMessage">
                ${alertMessage} Around ${timeText}.
            </div>

        </div>

        <button
            class="forecastAlertClose"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>
    `;

    container.appendChild(alert);
}


// =========================================================
// MAIN WEATHER FUNCTION
// =========================================================

async function fetchWeather() {

    const cityInput =
        document.getElementById("cityInput");


    if (!cityInput) {

        console.error(
            "cityInput element not found."
        );

        return;
    }


    const city =
        cityInput.value.trim();


    // -----------------------------------------------------
    // EMPTY SEARCH
    // -----------------------------------------------------

    if (!city) {

        clearWeatherData();

        const cityName =
            document.getElementById("cityName");

        const skyDesc =
            document.getElementById("skyDesc");

        if (cityName) {
            cityName.textContent =
                "Enter a city";
        }

        if (skyDesc) {
            skyDesc.textContent =
                "Please search for a location";
        }

        return;
    }


    // -----------------------------------------------------
    // SHOW LOADING
    // -----------------------------------------------------

    setLoadingState();


    try {

        // -------------------------------------------------
        // 1. GET LOCATION
        // -------------------------------------------------

        const location =
            await getCoordinates(city);


        currentLocation =
            location;


        // -------------------------------------------------
        // 2. GET CURRENT WEATHER
        // -------------------------------------------------

        const weather =
            await getCurrentWeather(
                location.lat,
                location.lon
            );


        // -------------------------------------------------
        // 3. GET FORECAST
        // -------------------------------------------------

        const forecast =
            await getForecast(
                location.lat,
                location.lon
            );


        // -------------------------------------------------
        // 4. GET AIR QUALITY
        // -------------------------------------------------

        let airQuality = null;

        try {

            airQuality =
                await getAirQuality(
                    location.lat,
                    location.lon
                );

        } catch (aqiError) {

            console.warn(
                "Air quality unavailable:",
                aqiError
            );
        }


        // -------------------------------------------------
        // 5. DISPLAY CURRENT WEATHER
        // -------------------------------------------------

        displayCurrentWeather(
            weather,
            location
        );
        saveRecentCity(location.name);


        // -------------------------------------------------
        // 6. DISPLAY 5-DAY FORECAST
        // -------------------------------------------------

        displayFiveDayForecast(
            forecast
        );


        // -------------------------------------------------
        // 7. DISPLAY TODAY'S FORECAST
        // -------------------------------------------------

        displayTodayForecast(
            forecast
        );

        //7.5 ForecastAlert
        displayForecastAlert(forecast);


        // -------------------------------------------------
        // 8. DISPLAY AIR QUALITY
        // -------------------------------------------------

        if (airQuality) {

            displayAirQuality(
                airQuality
            );
           

        } else {

            const aqiElements = [
                "coValue",
                "so2Value",
                "o3Value",
                "no2Value"
            ];

            aqiElements.forEach(id => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.textContent = "N/A";
                }

            });
        }

        applyWeatherEffects(weather.weather[0].main);
        checkWeatherAlerts(weather);


        console.log(
            "Location:",
            location
        );

        console.log(
            "Weather:",
            weather
        );

        console.log(
            "Forecast:",
            forecast
        );

        console.log(
            "Air Quality:",
            airQuality
        );

    }


    catch (error) {

        console.error(
            "Weather error:",
            error
        );


        // -------------------------------------------------
        // CLEAR OLD WEATHER
        // -------------------------------------------------

        clearWeatherData();


        // -------------------------------------------------
        // FRIENDLY ERROR
        // -------------------------------------------------

        const cityName =
            document.getElementById(
                "cityName"
            );

        const skyDesc =
            document.getElementById(
                "skyDesc"
            );

        if (cityName) {

            cityName.textContent =
                "Location not found";
        }

        if (skyDesc) {

            skyDesc.textContent =
                `No weather data available for "${city}"`;
        }

    }


    finally {

        resetSearchState();

    }
}


// =========================================================
// 16. SEARCH USING ENTER KEY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const cityInput =
            document.getElementById(
                "cityInput"
            );


        if (cityInput) {

            cityInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        fetchWeather();
                    }
                }
            );
        }


        // Default Celsius
        const celsiusBtn =
            document.getElementById(
                "celsiusBtn"
            );

        if (celsiusBtn) {

            celsiusBtn.classList.add(
                "active"
            );
        }
        displayRecentCities();
    }
    
);

// =========================================================
// WEATHER EFFECTS — STAGE 1
// =========================================================

// =========================================================
// WEATHER EFFECTS — STAGE 2
// =========================================================

function applyWeatherEffects(weatherMain) {

    // -----------------------------------------------------
    // Remove previous weather classes
    // -----------------------------------------------------

    document.body.classList.remove(
        "weather-clear",
        "weather-clouds",
        "weather-rain",
        "weather-thunderstorm",
        "weather-snow",
        "weather-mist"
    );


    // -----------------------------------------------------
    // Remove previous effect container
    // -----------------------------------------------------

    const oldEffects =
        document.querySelector(".weather-effects");

    if (oldEffects) {
        oldEffects.remove();
    }


    // -----------------------------------------------------
    // Weather type
    // -----------------------------------------------------

    const weather =
        weatherMain.toLowerCase();


    // =====================================================
    // CREATE EFFECT CONTAINER
    // =====================================================

    const effect =
        document.createElement("div");

    effect.className =
        "weather-effects";


    // =====================================================
    // CLEAR
    // =====================================================

    if (weather === "clear") {

        document.body.classList.add(
            "weather-clear"
        );

        return;
    }


    // =====================================================
    // CLOUDS
    // =====================================================

    if (weather === "clouds") {

        document.body.classList.add(
            "weather-clouds"
        );

        const cloud1 =
            document.createElement("div");

        cloud1.className =
            "weather-cloud";

        cloud1.style.top =
            "15%";


        const cloud2 =
            document.createElement("div");

        cloud2.className =
            "weather-cloud slow";

        cloud2.style.top =
            "35%";


        effect.appendChild(cloud1);
        effect.appendChild(cloud2);

        document.body.appendChild(effect);

        return;
    }


    // =====================================================
    // RAIN
    // =====================================================

    if (
        weather === "rain" ||
        weather === "drizzle"
    ) {

        document.body.classList.add(
            "weather-rain"
        );


        // Create 100 rain drops

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const drop =
                document.createElement("span");

            drop.className =
                "rain-drop";


            drop.style.left =
                Math.random() * 100 + "%";


            drop.style.animationDuration =
                (
                    0.45 +
                    Math.random() * 0.7
                ) + "s";


            drop.style.animationDelay =
                (
                    Math.random() * 2
                ) + "s";


            drop.style.opacity =
                (
                    0.25 +
                    Math.random() * 0.65
                );


            effect.appendChild(drop);
        }


        document.body.appendChild(effect);

        return;
    }


    // =====================================================
    // THUNDERSTORM
    // =====================================================

    if (
        weather === "thunderstorm"
    ) {

        document.body.classList.add(
            "weather-thunderstorm"
        );


        // Heavy rain

        for (
            let i = 0;
            i < 140;
            i++
        ) {

            const drop =
                document.createElement("span");

            drop.className =
                "rain-drop";


            drop.style.left =
                Math.random() * 100 + "%";


            drop.style.animationDuration =
                (
                    0.35 +
                    Math.random() * 0.5
                ) + "s";


            drop.style.animationDelay =
                (
                    Math.random() * 2
                ) + "s";


            drop.style.opacity =
                (
                    0.4 +
                    Math.random() * 0.6
                );


            effect.appendChild(drop);
        }


        // Lightning

        const lightning =
            document.createElement("div");

        lightning.className =
            "lightning";


        effect.appendChild(
            lightning
        );


        document.body.appendChild(
            effect
        );

        return;
    }


    // =====================================================
    // SNOW
    // =====================================================

    if (
        weather === "snow"
    ) {

        document.body.classList.add(
            "weather-snow"
        );


        // Create snowflakes

        for (
            let i = 0;
            i < 55;
            i++
        ) {

            const snow =
                document.createElement("span");


            snow.className =
                "snowflake";


            snow.textContent =
                "❄";


            snow.style.left =
                Math.random() * 100 + "%";


            snow.style.fontSize =
                (
                    10 +
                    Math.random() * 15
                ) + "px";


            snow.style.animationDuration =
                (
                    5 +
                    Math.random() * 7
                ) + "s";


            snow.style.animationDelay =
                (
                    Math.random() * 5
                ) + "s";


            effect.appendChild(
                snow
            );
        }


        document.body.appendChild(
            effect
        );

        return;
    }


    // =====================================================
    // MIST / FOG / HAZE
    // =====================================================

    if (
        weather === "mist" ||
        weather === "fog" ||
        weather === "haze"
    ) {

        document.body.classList.add(
            "weather-mist"
        );

        return;
    }
}

// =========================================================
// WEATHER ALERTS
// =========================================================

function showWeatherAlert(
    icon,
    title,
    message,
    alertType
) {

    const alertBox =
        document.getElementById("weatherAlert");

    const alertIcon =
        document.getElementById("alertIcon");

    const alertTitle =
        document.getElementById("alertTitle");

    const alertMessage =
        document.getElementById("alertMessage");


    if (!alertBox) {
        return;
    }


    // Remove previous alert styles

    alertBox.classList.remove(
        "alert-rain",
        "alert-thunderstorm",
        "alert-heat",
        "alert-wind",
        "alert-visibility"
    );


    // Add new alert style

    if (alertType) {

        alertBox.classList.add(
            "alert-" + alertType
        );
    }


    alertIcon.textContent = icon;

    alertTitle.textContent = title;

    alertMessage.textContent = message;


    alertBox.style.display = "flex";
}


// =========================================================
// CLOSE WEATHER ALERT
// =========================================================

function closeWeatherAlert() {

    const alertBox =
        document.getElementById("weatherAlert");

    if (alertBox) {

        alertBox.style.display =
            "none";
    }
}


// =========================================================
// CHECK WEATHER CONDITIONS
// =========================================================

function checkWeatherAlerts(weather) {

    if (
        !weather ||
        !weather.weather ||
        !weather.weather.length
    ) {
        return;
    }


    const weatherMain =
        weather.weather[0].main.toLowerCase();


    const description =
        weather.weather[0].description;


    const temperature =
        weather.main.temp;


    const visibility =
        weather.visibility || 10000;


    const windSpeed =
        weather.wind
            ? weather.wind.speed
            : 0;


    // -----------------------------------------------------
    // THUNDERSTORM
    // -----------------------------------------------------

    if (
        weatherMain === "thunderstorm"
    ) {

        showWeatherAlert(
            "🌩️",
            "Thunderstorm Alert",
            "Thunderstorm conditions are currently detected in this location.",
            "thunderstorm"
        );

        return;
    }


    // -----------------------------------------------------
    // HEAVY RAIN
    // -----------------------------------------------------

    if (
        weatherMain === "rain" &&
        (
            description.includes("heavy") ||
            description.includes("extreme")
        )
    ) {

        showWeatherAlert(
            "🌧️",
            "Heavy Rain Alert",
            "Heavy rainfall is currently reported. Take care while travelling.",
            "rain"
        );

        return;
    }


    // -----------------------------------------------------
    // RAIN
    // -----------------------------------------------------

    if (
        weatherMain === "rain" ||
        weatherMain === "drizzle"
    ) {

        showWeatherAlert(
            "🌧️",
            "Rain Alert",
            "Rain is currently occurring in this location.",
            "rain"
        );

        return;
    }


    // -----------------------------------------------------
    // HIGH TEMPERATURE
    // -----------------------------------------------------

    const highTemperature =
        currentUnit === "metric"
            ? temperature >= 38
            : temperature >= 100.4;


    if (highTemperature) {

        showWeatherAlert(
            "🌡️",
            "High Temperature",
            `The current temperature is ${Math.round(temperature)}${currentUnit === "metric" ? "°C" : "°F"}. Stay hydrated and avoid prolonged heat exposure.`,
            "heat"
        );

        return;
    }


    // -----------------------------------------------------
    // STRONG WIND
    // -----------------------------------------------------

    const strongWind =
        currentUnit === "metric"
            ? windSpeed >= 15
            : windSpeed >= 33.5;


    if (strongWind) {

        showWeatherAlert(
            "💨",
            "Strong Wind Alert",
            "Strong winds are currently being reported. Use caution outdoors.",
            "wind"
        );

        return;
    }


    // -----------------------------------------------------
    // POOR VISIBILITY
    // -----------------------------------------------------

    if (
        visibility <= 2000
    ) {

        showWeatherAlert(
            "🌫️",
            "Poor Visibility",
            `Visibility is currently ${(visibility / 1000).toFixed(1)} km. Take extra care while travelling.`,
            "visibility"
        );

        return;
    }


    // -----------------------------------------------------
    // NO SIGNIFICANT ALERT
    // -----------------------------------------------------

    closeWeatherAlert();
}

// =========================================================
// RECENT SEARCHES
// =========================================================

function saveRecentCity(city) {

    city = city.trim();

    if (!city) {
        return;
    }

    let recentCities =
        JSON.parse(
            localStorage.getItem("recentCities")
        ) || [];


    // Remove duplicate
    recentCities =
        recentCities.filter(
            savedCity =>
                savedCity.toLowerCase() !==
                city.toLowerCase()
        );


    // Add newest city at the beginning
    recentCities.unshift(city);


    // Keep only latest 5 cities
    recentCities =
        recentCities.slice(0, 5);


    localStorage.setItem(
        "recentCities",
        JSON.stringify(recentCities)
    );


    displayRecentCities();
}


function displayRecentCities() {

    const container =
        document.getElementById("recentSearches");

    if (!container) {
        return;
    }


    const recentCities =
        JSON.parse(
            localStorage.getItem("recentCities")
        ) || [];


    container.innerHTML = "";


    if (!recentCities.length) {
        return;
    }


    const title =
        document.createElement("span");

    title.className =
        "recentTitle";

    title.textContent =
        "Recent:";

    container.appendChild(title);


    recentCities.forEach(city => {

        const button =
            document.createElement("button");

        button.className =
            "recentCity";

        button.textContent =
            city;


        button.onclick = () => {

            document.getElementById(
                "cityInput"
            ).value = city;

            fetchWeather();
        };


        container.appendChild(button);
    });
}