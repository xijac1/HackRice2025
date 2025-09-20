"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you add Input component
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function PlacesPage() {
  const [places, setPlaces] = useState([
    { id: 1, name: "Home", lat: 29.7604, lon: -95.3698, risk: "Good", outlook: "Stable, low pollutants" },
    { id: 2, name: "Work", lat: 29.7499, lon: -95.3664, risk: "Caution", outlook: "Improving" },
  ]);
  const [newPlace, setNewPlace] = useState({ name: "", lat: "", lon: "" });
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

  const deletePlace = (id: number) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <MapPin className="w-6 h-6" />
            Saved Places
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="space-y-4">
        {places.map((place) => (
          <Card key={place.id} className="shadow-sm border-0 bg-white flex items-center justify-between p-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{place.name}</h4>
              <p className="text-sm text-gray-600">{place.risk} - {place.outlook} (6-12hr)</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => deletePlace(place.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}