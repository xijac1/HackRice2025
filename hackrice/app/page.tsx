"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // Assuming you add a Switch component or use native
import { MapPin, Wind, Droplets, User, Heart, Settings, Map, Cloud, AlertTriangle, Radio, Flame } from "lucide-react";
// Helper to get color classes based on risk status
function getRiskColor(status: string) {
  if (status === "Good") return "bg-green-100";
  if (status === "Caution") return "bg-yellow-100";
  return "bg-red-100";
}

// Helper function to determine risk status based on AQI and profile
function getRiskStatus(aqi: number, profile: { hasAsthma: boolean; sensitivity: string }) {
  if (profile.hasAsthma || profile.sensitivity === "high") {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Caution";
    return "Danger";
  } else {
    if (aqi <= 100) return "Good";
    if (aqi <= 150) return "Caution";
    return "Danger";
  }
}

export default function Home() {
  const [location, setLocation] = useState({ name: "Houston, TX", lat: 29.7604, lon: -95.3698 });
  const [gpsOptIn, setGpsOptIn] = useState(false);
  const [profile, setProfile] = useState({ hasAsthma: true, sensitivity: "high" }); // Mock from storage

  // Mock air quality data (integrate real API in prod, e.g., AirNow)
  const airQualityData = {
    pm25: 12.3,
    pm10: 25.1,
    o3: 45.6,
    no2: 18.2,
    smokeIndex: 5, // 0-10 scale for wildfire/smoke
    radonLevel: "Low", // Mock from EPA API
    aqi: 35,
    rationale: profile.hasAsthma ? "Good air, but monitor asthma symptoms due to sensitivity." : "Excellent air quality with low pollutant levels.",
  };

  const adjustedStatus = getRiskStatus(airQualityData.aqi, profile); // Personalized: tighter thresholds

  useEffect(() => {
    if (gpsOptIn && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ name: "Your Location", lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, [gpsOptIn]);

  const weatherData = {
    temperature: 78,
    humidity: 65,
    windSpeed: 8,
    conditions: "Partly Cloudy",
  };

  const savedPlaces = [
    { id: 1, name: "Home", lat: 29.7604, lon: -95.3698, risk: "Good", outlook: "Stable, low pollutants in next 6hrs" },
    { id: 2, name: "Work", lat: 29.7499, lon: -95.3664, risk: "Caution", outlook: "Improving in 12hrs" },
    { id: 3, name: "Gym", lat: 29.7521, lon: -95.3653, risk: "Good", outlook: "Clear skies ahead" },
  ];

  const runCoachSuggestion = {
    direction: "East (cleaner winds)",
    timeWindow: "Now - 2PM",
    duration: "30-45 min",
    rationale: "Low smoke, moderate winds dispersing pollutants.",
  };

  function getRiskIcon(adjustedStatus: string): import("react").ReactNode {
    if (adjustedStatus === "Good") {
      return <Heart className="w-6 h-6 text-green-600" />;
    }
    if (adjustedStatus === "Caution") {
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
    return <AlertTriangle className="w-6 h-6 text-red-600" />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* GPS Opt-In Prompt */}
        {!gpsOptIn && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">Enable GPS for personalized location data?</span>
              </div>
              <Button size="sm" onClick={() => setGpsOptIn(true)}>Allow</Button>
            </CardContent>
          </Card>
        )}

        {/* Main Grid: Risk Card full-width on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRiskColor(adjustedStatus)}`}>
                      {getRiskIcon(adjustedStatus)}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {location.name} - {adjustedStatus}
                      </CardTitle>
                      <p className="text-sm text-gray-500">Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-sm font-medium text-gray-700 mt-1">{airQualityData.rationale}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* AQI Display */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-4xl font-bold text-gray-900">{airQualityData.aqi}</h3>
                        <p className="text-sm font-medium text-gray-600 mt-1">AQI</p>
                      </div>
                      <Badge className={`text-lg ${adjustedStatus === 'Good' ? 'bg-green-100 text-green-800' : adjustedStatus === 'Caution' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {adjustedStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Pollutant Grid: 2-col on mobile, 4-col on lg */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "PM2.5", value: `${airQualityData.pm25} μg/m³`, icon: <Droplets className="w-4 h-4" /> },
                      { label: "O₃", value: `${airQualityData.o3} ppb`, icon: <Wind className="w-4 h-4" /> },
                      { label: "NO₂", value: `${airQualityData.no2} ppb`, icon: <Cloud className="w-4 h-4" /> },
                      { label: "Smoke", value: `${airQualityData.smokeIndex}/10`, icon: <Flame className="w-4 h-4 text-orange-500" /> },
                    ].map((pollutant, i) => (
                      <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="mx-auto mb-1">{pollutant.icon}</div>
                        <p className="text-sm font-medium text-gray-600">{pollutant.label}</p>
                        <p className="text-lg font-semibold text-gray-900">{pollutant.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Radon Card */}
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Radon Level</p>
                          <p className="text-sm text-gray-500">{airQualityData.radonLevel}</p>
                        </div>
                      </div>
                      <Switch id="radon-optin" defaultChecked aria-label="Opt-in for radon monitoring" />
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      <Wind className="w-4 h-4 mr-2" />
                      6-12hr Forecast
                    </Button>
                    <Button className="flex-1 bg-primary">
                      <Map className="w-4 h-4 mr-2" />
                      Check Route
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Stacked on mobile */}
          <div className="space-y-6 lg:col-span-1">
            {/* Weather Card */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Cloud className="w-5 h-5" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{weatherData.temperature}°F</p>
                    <p className="text-sm text-gray-600">{weatherData.conditions}</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-medium">{weatherData.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wind</span>
                      <span className="font-medium">{weatherData.windSpeed} mph</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Alex Johnson</h4>
                    <p className="text-sm text-gray-600">{profile.sensitivity} sensitivity</p>
                  </div>
                  {profile.hasAsthma && (
                    <Badge variant="destructive" className="w-full justify-center">
                      <Heart className="w-3 h-3 mr-1" />
                      Asthma Alert
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/profile">Edit Profile</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Run Coach Card (Bonus) */}
            <Card className="shadow-sm border-0 bg-white card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Wind className="w-5 h-5" />
                  Run Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Suggested Run:</p>
                  <p className="font-medium">Direction: {runCoachSuggestion.direction}</p>
                  <p className="font-medium">Time: {runCoachSuggestion.timeWindow}</p>
                  <p className="text-sm text-gray-500">{runCoachSuggestion.rationale}</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/run-coach">Get Full Plan</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Places: Horizontal scroll on mobile */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="w-5 h-5" />
              Saved Places (6-12hr Outlook)
            </CardTitle>
            <CardDescription>Quick checks for your locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 pb-2">
              {savedPlaces.map((place) => (
                <Card 
                  key={place.id} 
                  className={`min-w-[140px] h-auto p-4 flex flex-col justify-between border-0 hover:shadow-md transition-all ${getRiskColor(place.risk)} card-hover`}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{place.name}</h4>
                    <p className="text-xs text-gray-500">{place.outlook}</p>
                  </div>
                  <Badge 
                    variant={place.risk === 'Good' ? "default" : "secondary"} 
                    className="text-xs mt-2"
                  >
                    {place.risk}
                  </Badge>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/places">Manage Places</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}