# Air Quality Checker

A web application that checks air quality and pollution data for any city worldwide using OpenWeatherMap API.

## Features
- Search air quality by city name
- Use current location for air quality data
- Display AQI index with color-coded quality levels
- Show detailed pollutant components (CO, NO, NO₂, O₃, SO₂, PM2.5, PM10)
- Real-time data fetching with loading states

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript
- API: OpenWeatherMap Air Pollution API
- Geolocation: Browser Geolocation API
- Data: Real-time air quality measurements

## Setup
1. Get OpenWeatherMap API key
2. Replace API key in `script.js` line 2
3. Open `index.html` in browser

## Usage
1. Enter city name and click "Search"
2. Or click "Current Location" for local air quality
3. View AQI index and pollutant breakdown
4. Quality levels: Good (1), Fair (2), Moderate (3), Poor (4), Very Poor (5)

## Output
Displays air quality index with color coding and detailed pollutant measurements in μg/m³ for comprehensive air quality assessment.
