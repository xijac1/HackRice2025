const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// API: Fetch weather from OpenWeatherMap (proxy to hide key)
app.get('/api/weather/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );
    const data = response.data;

    // Format for frontend (matches weatherData shape)
    const weather = {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      conditions: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
    };

    res.json(weather);
  } catch (error) {
    console.error('Weather API error:', error.message);
    // Fallback mock
    res.status(500).json({
      error: 'Failed to fetch weather',
      fallback: { temperature: 78, humidity: 65, windSpeed: 8, conditions: 'Partly Cloudy' }
    });
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