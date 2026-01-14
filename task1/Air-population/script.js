document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "2b6940728edd1dce41ac81552c8dc43e";

    const cityInput = document.getElementById('city');
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const resultContainer = document.getElementById('result-container');
    const loader = document.getElementById('loader');
    const weatherInfo = document.getElementById('weather-info');

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getAirQualityByCity(city);
        }
    });

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                getCityNameAndAirQuality(latitude, longitude);
            }, error => {
                showError('Unable to retrieve your location.');
            });
        }
    });

    async function getAirQualityByCity(city) {
        showLoader();
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            const geoRes = await fetch(geoUrl);
            const geoData = await geoRes.json();

            if (geoData.length === 0) {
                showError('City not found.');
                return;
            }

            const { lat, lon } = geoData[0];
            getAirQuality(lat, lon);
        } catch (error) {
            showError('Failed to fetch location data.');
        }
    }

    async function getCityNameAndAirQuality(lat, lon) {
        showLoader();
        try {
            const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
            const reverseGeoRes = await fetch(reverseGeoUrl);
            const reverseGeoData = await reverseGeoRes.json();
            if (reverseGeoData.length > 0) {
                const cityName = reverseGeoData[0].name;
                cityInput.value = normalizeString(cityName);
            }
            getAirQuality(lat, lon);
        } catch (error) {
            showError('Failed to retrieve location name.');
        }
    }

    async function getAirQuality(lat, lon) {
        try {
            const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const airRes = await fetch(airUrl);
            const airData = await airRes.json();
            displayAirQuality(airData);
        } catch (error) {
            showError('Failed to fetch air quality data.');
        }
    }

    function displayAirQuality(data) {
        hideLoader();
        const { components, main: { aqi } } = data.list[0];
        const qualityLevels = {
            1: { name: "Good", className: "good" },
            2: { name: "Fair", className: "fair" },
            3: { name: "Moderate", className: "moderate" },
            4: { name: "Poor", className: "poor" },
            5: { name: "Very Poor", className: "very-poor" },
        };
        const quality = qualityLevels[aqi];

        weatherInfo.innerHTML = `
            <h3 class="${quality.className}">${quality.name}</h3>
            <p><b>AQI Index:</b> <span>${aqi}</span></p>
            <p><b>CO:</b> <span>${components.co} μg/m³</span></p>
            <p><b>NO:</b> <span>${components.no} μg/m³</span></p>
            <p><b>NO₂:</b> <span>${components.no2} μg/m³</span></p>
            <p><b>O₃:</b> <span>${components.o3} μg/m³</span></p>
            <p><b>SO₂:</b> <span>${components.so2} μg/m³</span></p>
            <p><b>PM2.5:</b> <span>${components.pm2_5} μg/m³</span></p>
            <p><b>PM10:</b> <span>${components.pm10} μg/m³</span></p>
        `;
    }

    function showLoader() {
        resultContainer.classList.remove('hidden');
        loader.classList.remove('hidden');
        weatherInfo.innerHTML = '';
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }

    function showError(message) {
        hideLoader();
        weatherInfo.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    }

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
});
