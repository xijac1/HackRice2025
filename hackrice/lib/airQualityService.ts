// Air Quality Service for fetching real-time air quality data
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:5050';

export interface AirQualityData {
  aqi: number;
  category: string;
  dominantPollutant: string;
  displayName: string;
  risk: string;
  outlook: string;
  dateTime?: string;
  regionCode?: string;
}

export interface AirQualityError {
  error: string;
  fallback?: AirQualityData;
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  try {
    const url = `${BACKEND_URL}/api/air-quality/${lat}/${lon}`;
    console.log('Making air quality API request to:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Air quality API response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch air quality data:', error);
    
    // Return fallback data if API fails completely
    return {
      aqi: 45,
      category: 'Good air quality',
      dominantPollutant: 'pm2.5',
      displayName: 'AQI',
      risk: 'Good',
      outlook: 'Good air quality conditions',
      dateTime: new Date().toISOString(),
      regionCode: 'us'
    };
  }
}

// Helper function to get risk color for UI
export function getAirQualityRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'good':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'moderate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'caution':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'unhealthy':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'very unhealthy':
      return 'bg-red-200 text-red-900 border-red-300';
    case 'hazardous':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Helper function to get AQI description
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Good - Air quality is satisfactory';
  if (aqi <= 100) return 'Moderate - Air quality is acceptable';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy - Everyone may experience health effects';
  if (aqi <= 300) return 'Very Unhealthy - Health warnings of emergency conditions';
  return 'Hazardous - Health alert: everyone may experience serious health effects';
}
