"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Map, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import GoogleMap from "@/components/google-map";

export default function RunCoachPage() {
  const [suggestions] = useState({
    direction: "East (cleaner winds)",
    timeWindow: "Now - 2PM",
    duration: "30-45 min",
    aqiForecast: [35, 32, 28], // Next 3 hours
    warnings: "Low smoke detected; stay hydrated.",
  });

  const center = { lat: 29.7604, lng: -95.3698 };
  const origin = center;
  const destination = { lat: center.lat, lng: center.lng + 0.05 }; // Approximate east direction

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <Card className="max-w-2xl mx-auto shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Wind className="w-6 h-6" />
            Run Coach: Personalized Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Recommended Route</h3>
            <div className="bg-white p-4 rounded border">
              <p className="text-lg font-medium">{suggestions.direction}</p>
              <p className="text-sm text-gray-600 mt-1">Follow winds to avoid pollutants</p>
              {/* Mock map preview */}
              <GoogleMap
                center={center}
                zoom={12}
                style={{ width: '100%', height: '200px' }}
                origin={origin}
                destination={destination}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Best Time Window
              </h4>
              <p className="text-lg font-medium">{suggestions.timeWindow}</p>
              <p className="text-sm text-gray-500">AQI forecast: {suggestions.aqiForecast.join(" → ")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Suggested Duration</h4>
              <p className="text-lg font-medium">{suggestions.duration}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                {suggestions.warnings}
              </div>
            </div>
          </div>

          <Button className="w-full bg-primary" size="lg">
            Start Run & Track Exposure
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}