document.addEventListener('DOMContentLoaded', () => {
    // api key for openweatherapi.
    const apiKey = 'd9030f613241b3ee696bcfcc14d3cc87';
    const searchInput = document.querySelector('input[type="text"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    const searchHistory = document.getElementById('search-history');
    const clearHistoryBtn = document.getElementById('clear-history');

    // code for submit button.
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            fetchWeatherData(city);
            searchInput.value = '';
        }
    });
    // code for clear history button.
    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('searchHistory');
        searchHistory.innerHTML = '';
    });

    // code for fetching weather data.
    function fetchWeatherData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
                addToSearchHistory(city);
            })
            .catch(error => {
                console.error('There was a problem fetching the weather data:', error);
            });
    }

    // code for displaying current weather.
    function displayWeather(data) {
        const currentWeatherSection = document.getElementById('current-weather');
        const currentWeather = data.list[0];
        const iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
        const currentWeatherHTML = `
            <div class="current-weather-item">
                <div class="header-wrapper">
                    <h1>${data.city.name}, ${data.city.country} (${new Date(currentWeather.dt * 1000).toLocaleDateString()})</h1>
                    <img src="${iconUrl}" alt="Weather Icon"> <!-- Add img tag for weather icon -->
                </div>
                <p>Temperature: ${currentWeather.main.temp.toFixed(2)}°F</p> <!-- Display temperature with 2 decimal places -->
                <p>Humidity: ${currentWeather.main.humidity}%</p>
                <p>Wind Speed: ${currentWeather.wind.speed.toFixed(2)} MPH</p> <!-- Display wind speed with 2 decimal places -->
            </div>
        `;
        currentWeatherSection.innerHTML = currentWeatherHTML;

        // code for displaying 5 day forecast.
        const forecastSection = document.getElementById('forecast');
        forecastSection.innerHTML = ''; 
        const forecastHeading = document.createElement('h2');
        forecastHeading.textContent = '5-Day Forecast:';
        forecastSection.appendChild(forecastHeading); 
        for (let i = 1; i <= 5; i++) {
            const forecast = data.list[i * 8 - 1];
            const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`; 
            const forecastHTML = `
                <div class="forecast-item">
                    <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                    <img src="${iconUrl}" alt="Weather Icon"> <!-- Add img tag for weather icon -->
                    <p>Temperature: ${forecast.main.temp.toFixed(2)}°F</p> <!-- Display temperature with 2 decimal places -->
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed.toFixed(2)} MPH</p> <!-- Display wind speed with 2 decimal places -->
                </div>
            `;
            forecastSection.innerHTML += forecastHTML;
        }
    }

    // code to add the search history to localstorage.
    function addToSearchHistory(city) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(history));
            searchHistory.innerHTML = '';
            history.forEach(city => {
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');
                historyItem.textContent = city;
                historyItem.addEventListener('click', () => {
                    fetchWeatherData(city);
                });
                searchHistory.appendChild(historyItem);
            });
        }
    }

    // code for search history to get from localstorage.
    function loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = city;
            historyItem.addEventListener('click', () => {
                fetchWeatherData(city);
            });
            searchHistory.appendChild(historyItem);
        });
    }

    loadSearchHistory();
});
