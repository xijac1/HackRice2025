# Backend (Weather Proxy)

This service proxies Google Weather API to the frontend and normalizes data.

## Env

Create `backend/.env`:

```
GOOGLE_WEATHER_API_KEY=YOUR_KEY
PORT=5050
```

The server also accepts `OPENWEATHER_API_KEY` for backward-compat but prefers `GOOGLE_WEATHER_API_KEY`.

## Run

```bash
# terminal 1
cd backend
npm start

# terminal 2
cd hackrice
npm run dev
```

Next.js rewrites `/api/*` to `http://localhost:5050/api/*`.

## Test

```bash
curl -sS "http://localhost:5050/api/weather/29.7604/-95.3698" | jq .
```

Expected shape:

```json
{
  "temperature": 72,
  "humidity": 60,
  "windSpeed": 8,
  "conditions": "Sunny"
}
```

If you see a fallback response, check:
- Billing is enabled for your Google Cloud project
- Weather API is enabled for your API key (service: weather.googleapis.com)
- API key restrictions allow server requests to `https://weather.googleapis.com`
- The environment variable name is `GOOGLE_WEATHER_API_KEY`

## Endpoint

GET `/api/weather/:lat/:lon`
- Calls Google Weather `v1/currentConditions:lookup` with `unitsSystem=IMPERIAL`
- Maps Google response to: `{ temperature, humidity, windSpeed, conditions }`
