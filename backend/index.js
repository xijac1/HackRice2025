const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // Allow frontend (localhost:3000) to call
app.use(express.json());
// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

// Mock in-memory storage for users (expand to DB like MongoDB later)
// Structure: { userId: { profile: {}, places: [], healthLogs: [] } }
let users = {};

// Helper: Get or create user (mock userId = 'default' for now)
function getUser(userId = 'default') {
  if (!users[userId]) {
    users[userId] = {
      profile: { name: 'Alex Johnson', hasAsthma: false, sensitivity: 'medium' },
      places: [
        { id: 1, name: 'Home', lat: 29.7604, lon: -95.3698, risk: 'Good', outlook: 'Stable' },
        { id: 2, name: 'Work', lat: 29.7499, lon: -95.3664, risk: 'Caution', outlook: 'Improving' }
      ],
      healthLogs: [{ date: new Date().toDateString(), symptom: 'Cough', exposure: 'PM2.5 high' }]
    };
  }
  return users[userId];
}

// API: Fetch weather from Google Weather API (proxy to hide key)
app.get('/api/weather/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  // Prefer GOOGLE_WEATHER_API_KEY, fallback to legacy OPENWEATHER_API_KEY if user reused the var
  const apiKey = process.env.GOOGLE_WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const url = 'https://weather.googleapis.com/v1/currentConditions:lookup';
    const params = {
      key: apiKey,
      'location.latitude': lat,
      'location.longitude': lon,
      // Frontend expects Fahrenheit and mph
      unitsSystem: 'IMPERIAL',
    };

    const { data } = await axios.get(url, { params });

    // Map Google Weather response to frontend shape
    // Docs: https://developers.google.com/maps/documentation/weather/current-conditions
    const temperature = Math.round(data?.temperature?.degrees ?? 78);
    const humidity = Math.round(data?.relativeHumidity ?? 65);
    const windSpeed = Math.round(data?.wind?.speed?.value ?? 8);
    const descriptionText = data?.weatherCondition?.description?.text || data?.weatherCondition?.type || 'Partly Cloudy';
    const conditions = typeof descriptionText === 'string' && descriptionText.length
      ? descriptionText.charAt(0).toUpperCase() + descriptionText.slice(1).toLowerCase()
      : 'Partly Cloudy';

    const weather = { temperature, humidity, windSpeed, conditions };
    res.json(weather);
  } catch (error) {
    console.error('Weather API error:', error?.response?.data || error.message);
    // Fallback mock
    res.status(500).json({
      error: 'Failed to fetch weather',
      fallback: { temperature: 78, humidity: 65, windSpeed: 8, conditions: 'Partly Cloudy' }
    });
  }
});

// API: Fetch air quality from Google Air Quality API with additional pollutant information
app.get('/api/air-quality/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const apiKey = 'AIzaSyBpbnqAsQQ8TEENFW-RTukadsvb3w5hZI8'; // Google Air Quality API key
  
  try {
    const url = 'https://airquality.googleapis.com/v1/currentConditions:lookup';
    const requestBody = {
      "location": {
        "latitude": parseFloat(lat),
        "longitude": parseFloat(lon)
      },
      "extraComputations": [
        "HEALTH_RECOMMENDATIONS",
        "DOMINANT_POLLUTANT_CONCENTRATION",
        "POLLUTANT_CONCENTRATION",
        "LOCAL_AQI",
        "POLLUTANT_ADDITIONAL_INFO"
      ],
      "languageCode": "en"
    };

    const { data } = await axios.post(`${url}?key=${apiKey}`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract air quality data from response
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    const airQualityData = data?.indexes?.[0] || {};
    console.log('Air quality data from indexes[0]:', JSON.stringify(airQualityData, null, 2));
    
    // Try to get US EPA AQI first, fallback to universal AQI
    let aqi = 0;
    let category = 'Unknown';
    let dominantPollutant = 'Unknown';
    let displayName = 'AQI';
    
    // Look for US EPA AQI in the indexes array
    const usaEpaIndex = data?.indexes?.find(index => index.code === 'usa_epa');
    if (usaEpaIndex) {
      aqi = usaEpaIndex.aqi || 0;
      category = usaEpaIndex.category || 'Unknown';
      dominantPollutant = usaEpaIndex.dominantPollutant || 'Unknown';
      displayName = usaEpaIndex.displayName || 'AQI (US)';
      console.log('Using US EPA AQI:', aqi);
    } else {
      // Fallback to universal AQI
      aqi = airQualityData.aqi || 0;
      category = airQualityData.category || 'Unknown';
      dominantPollutant = airQualityData.dominantPollutant || 'Unknown';
      displayName = airQualityData.displayName || 'Universal AQI';
      console.log('Using universal AQI:', aqi);
    }
    
    // Extract additional pollutant concentrations
    const pollutants = data?.pollutants || [];
    const pollutantData = {};
    
    console.log('Raw API response pollutants:', JSON.stringify(pollutants, null, 2));
    
    // Extract specific pollutant concentrations
    pollutants.forEach(pollutant => {
      console.log(`Processing pollutant: ${pollutant.code}, concentration: ${pollutant.concentration?.value}`);
      if (pollutant.code === 'pm25') {
        pollutantData.pm25 = pollutant.concentration?.value || 0;
      } else if (pollutant.code === 'o3') {
        pollutantData.o3 = pollutant.concentration?.value || 0;
      } else if (pollutant.code === 'no2') {
        pollutantData.no2 = pollutant.concentration?.value || 0;
      } else if (pollutant.code === 'pm10') {
        pollutantData.pm10 = pollutant.concentration?.value || 0;
      }
    });
    
    console.log('Processed pollutant data:', JSON.stringify(pollutantData, null, 2));
    
    // Map AQI to risk levels for frontend compatibility
    let risk = 'Good';
    if (aqi <= 50) risk = 'Good';
    else if (aqi <= 100) risk = 'Moderate';
    else if (aqi <= 150) risk = 'Caution';
    else if (aqi <= 200) risk = 'Unhealthy';
    else if (aqi <= 300) risk = 'Very Unhealthy';
    else risk = 'Hazardous';

    // Generate outlook based on AQI
    let outlook = 'Stable air quality';
    if (aqi <= 50) outlook = 'Excellent air quality';
    else if (aqi <= 100) outlook = 'Moderate air quality';
    else if (aqi <= 150) outlook = 'Unhealthy for sensitive groups';
    else if (aqi <= 200) outlook = 'Unhealthy air quality';
    else if (aqi <= 300) outlook = 'Very unhealthy conditions';
    else outlook = 'Hazardous air quality';

    const airQuality = {
      aqi,
      category,
      dominantPollutant,
      displayName,
      risk,
      outlook,
      dateTime: data?.dateTime,
      regionCode: data?.regionCode,
      // Additional pollutant data
      pm25: pollutantData.pm25 !== undefined ? pollutantData.pm25 : 0,
      pm10: pollutantData.pm10 !== undefined ? pollutantData.pm10 : 0,
      o3: pollutantData.o3 !== undefined ? pollutantData.o3 : 0,
      no2: pollutantData.no2 !== undefined ? pollutantData.no2 : 0,
      // Health recommendations if available
      healthRecommendations: data?.healthRecommendations || [],
      // Additional info
      additionalInfo: data?.pollutantAdditionalInfo || {}
    };

    console.log('Final air quality response:', JSON.stringify(airQuality, null, 2));
    res.json(airQuality);
  } catch (error) {
    console.error('Air Quality API error:', error?.response?.data || error.message);
    // Return fallback data with 200 status so frontend can handle it
    const fallbackData = {
      aqi: 45,
      category: 'Good air quality',
      dominantPollutant: 'pm2.5',
      displayName: 'AQI',
      risk: 'Good',
      outlook: 'Good air quality conditions',
      dateTime: new Date().toISOString(),
      regionCode: 'us',
      pm25: 12.3,
      pm10: 25.1,
      o3: 45.6,
      no2: 18.2,
      healthRecommendations: [],
      additionalInfo: {}
    };
    res.json(fallbackData);
  }
});

// API: Get user profile
app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(getUser(userId).profile);
});

// API: Update user profile
app.post('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const user = getUser(userId);
  user.profile = { ...user.profile, ...req.body };
  res.json({ success: true, profile: user.profile });
});

// API: Get saved places
app.get('/api/places/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(getUser(userId).places);
});

// API: Add saved place
app.post('/api/places/:userId', (req, res) => {
  const { userId } = req.params;
  const { name, lat, lon } = req.body;
  const user = getUser(userId);
  const newPlace = {
    id: Date.now(), // Simple ID
    name,
    lat: Number(lat),
    lon: Number(lon),
    risk: 'Good', // Compute later
    outlook: 'Check now'
  };
  user.places.push(newPlace);
  res.json({ success: true, places: user.places });
});

// API: Delete saved place
app.delete('/api/places/:userId/:placeId', (req, res) => {
  const { userId, placeId } = req.params;
  const user = getUser(userId);
  user.places = user.places.filter(p => p.id !== Number(placeId));
  res.json({ success: true, places: user.places });
});

// API: Get health logs
app.get('/api/health/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(getUser(userId).healthLogs);
});

// API: Add health log
app.post('/api/health/:userId', (req, res) => {
  const { userId } = req.params;
  const { symptom, exposure } = req.body;
  const user = getUser(userId);
  const newLog = {
    date: new Date().toDateString(),
    symptom,
    exposure
  };
  user.healthLogs.push(newLog);
  res.json({ success: true, healthLogs: user.healthLogs });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});