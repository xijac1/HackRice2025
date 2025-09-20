// Path: /Users/julio/Documents/hackrice/HackRice2025/hackrice/app/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wind, Droplets, User, Heart, Settings, Map, Cloud } from "lucide-react";
import { getRiskColor, getRiskIcon } from "@/lib/utils";

export default function Home() {
  // Mock data for demonstration
  const currentLocation = {
    name: "Downtown Houston, TX",
    lat: 29.7604,
    lon: -95.3698,
    updated: new Date(),
  };

  const airQualityData = {
    pm25: 12.3,
    pm10: 25.1,
    o3: 45.6,
    no2: 18.2,
    status: "Good",
    aqi: 35,
    rationale: "Excellent air quality with low pollutant levels",
  };

  const savedPlaces = [
    { id: 1, name: "Home", lat: 29.7604, lon: -95.3698, risk: "Good" },
    { id: 2, name: "Work", lat: 29.7499, lon: -95.3664, risk: "Moderate" },
    { id: 3, name: "Gym", lat: 29.7521, lon: -95.3653, risk: "Good" },
  ];

  const weatherData = {
    temperature: 78,
    humidity: 65,
    windSpeed: 8,
    conditions: "Partly Cloudy",
  };

  const userProfile = {
    name: "Alex Johnson",
    hasAsthma: true,
    pregnant: false,
    ageGroup: "adult",
    sensitivity: "high",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Location Card - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRiskColor(airQualityData.status)}`}>
                      {getRiskIcon(airQualityData.status)}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentLocation.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* AQI Display */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{airQualityData.aqi}</h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">AQI</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-semibold ${airQualityData.status === 'Good' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                          {airQualityData.status}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{airQualityData.rationale}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pollutant Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">PM2.5</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{airQualityData.pm25} μg/m³</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">O₃</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{airQualityData.o3} ppb</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Wind className="w-4 h-4 mr-2" />
                      6hr Forecast
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Map className="w-4 h-4 mr-2" />
                      Check Route
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6 lg:col-span-1">
            {/* Weather Card */}
            <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <Cloud className="w-5 h-5" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{weatherData.temperature}°F</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{weatherData.conditions}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Humidity</span>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        <span className="font-medium">{weatherData.humidity}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Wind</span>
                      <span className="font-medium">{weatherData.windSpeed} mph</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Profile Card */}
            <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{userProfile.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">High sensitivity</p>
                  </div>

                  {userProfile.hasAsthma && (
                    <Badge variant="destructive" className="w-full justify-center">
                      <Heart className="w-3 h-3 mr-1" />
                      Asthma
                    </Badge>
                  )}

                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Places */}
        <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <MapPin className="w-5 h-5" />
              Saved Places
            </CardTitle>
            <CardDescription className="text-sm">Quick access to your favorite locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedPlaces.map((place) => (
                <Card 
                  key={place.id} 
                  className={`h-28 p-4 flex flex-col justify-between border-0 hover:shadow-md transition-all ${getRiskColor(place.risk)}`}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{place.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tap to check</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={place.risk === 'Good' ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {place.risk}
                    </Badge>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}