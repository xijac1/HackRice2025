"use client";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you add Input component
import { MapPin, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import GoogleMapsPlaces from "@/components/GoogleMapsPlaces";
import { fetchAirQuality, getAirQualityRiskColor, type AirQualityData } from "@/lib/airQualityService";

interface Place {
  id: number;
  name: string;
  lat: number;
  lon: number;
  risk: string;
  outlook: string;
  formattedAddress?: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([
    { id: 1, name: "Home", lat: 29.7604, lon: -95.3698, risk: "Good", outlook: "Stable, low pollutants" },
    { id: 2, name: "Work", lat: 29.7499, lon: -95.3664, risk: "Caution", outlook: "Improving" },
  ]);
  const [newPlace, setNewPlace] = useState({ name: "", lat: "", lon: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [airQualityData, setAirQualityData] = useState<{[key: number]: AirQualityData}>({});
  const [airQualityLoading, setAirQualityLoading] = useState(false);
  const nextIdRef = useRef(3);

  const addPlace = () => {
    if (newPlace.name && newPlace.lat && newPlace.lon) {
      const id = nextIdRef.current++;
      setPlaces([
        ...places,
        {
          id,
          name: newPlace.name,
          lat: Number(newPlace.lat),
          lon: Number(newPlace.lon),
          risk: "Good",
          outlook: "Check now",
        },
      ]);
      setNewPlace({ name: "", lat: "", lon: "" });
    }
  };

  const handlePlaceSelect = (place: { name: string; lat: number; lon: number; formattedAddress?: string }) => {
    const id = nextIdRef.current++;
    setPlaces([
      ...places,
      {
        id,
        name: place.name,
        lat: place.lat,
        lon: place.lon,
        risk: "Good",
        outlook: "Check now",
        formattedAddress: place.formattedAddress,
      },
    ]);
  };

  const deletePlace = (id: number) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  const startEditing = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = () => {
    if (editingName.trim() && editingId !== null) {
      setPlaces(places.map(place => 
        place.id === editingId 
          ? { ...place, name: editingName.trim() }
          : place
      ));
      setEditingId(null);
      setEditingName("");
    }
  };

  // Fetch air quality data for all places
  const fetchAirQualityForPlaces = async () => {
    setAirQualityLoading(true);
    try {
      const promises = places.map(async (place) => {
        const data = await fetchAirQuality(place.lat, place.lon);
        return { [place.id]: data };
      });

      const results = await Promise.all(promises);
      const combinedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setAirQualityData(combinedData);

      // Update places with real air quality data
      setPlaces(places.map(place => ({
        ...place,
        risk: combinedData[place.id]?.risk || place.risk,
        outlook: combinedData[place.id]?.outlook || place.outlook
      })));
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
    } finally {
      setAirQualityLoading(false);
    }
  };

  // Fetch air quality data on component mount and when places change
  useEffect(() => {
    if (places.length > 0) {
      fetchAirQualityForPlaces();
    }
  }, [places.length, places.map(p => `${p.lat},${p.lon}`).join('|')]);


  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Saved Places
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAirQualityForPlaces}
              disabled={airQualityLoading}
            >
              {airQualityLoading ? "Updating..." : "Refresh Air Quality"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Google Maps with Places Autocomplete */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Places from Map</h3>
              <GoogleMapsPlaces onPlaceSelect={handlePlaceSelect} existingPlaces={places} />
            </div>

            {/* Manual Entry Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Or Add Manually</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Name (e.g., Gym)"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  />
                  <Input
                    placeholder="Latitude"
                    type="number"
                    value={newPlace.lat}
                    onChange={(e) => setNewPlace({ ...newPlace, lat: e.target.value })}
                  />
                  <Input
                    placeholder="Longitude"
                    type="number"
                    value={newPlace.lon}
                    onChange={(e) => setNewPlace({ ...newPlace, lon: e.target.value })}
                  />
                </div>
                <Button onClick={addPlace} className="w-full flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Place
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Saved Places</h3>
        {places.map((place) => {
          const airQuality = airQualityData[place.id];
          return (
            <Card key={place.id} className="shadow-sm border-0 bg-white flex items-center justify-between p-4">
              <div className="flex-1">
                {editingId === place.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      placeholder="Enter place name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={saveEditing} disabled={!editingName.trim()}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditing}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <h4 className="font-semibold text-gray-900">{place.name}</h4>
                )}
                <p className="text-sm text-gray-600">{place.risk} - {place.outlook}</p>
                {airQuality && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      AQI: {airQuality.aqi} | {airQuality.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dominant Pollutant: {airQuality.dominantPollutant}
                    </p>
                  </div>
                )}
                {place.formattedAddress && (
                  <p className="text-xs text-gray-500 mt-1">{place.formattedAddress}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingId !== place.id && (
                  <Button variant="ghost" size="sm" onClick={() => startEditing(place.id, place.name)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => deletePlace(place.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}