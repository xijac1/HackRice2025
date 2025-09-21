"use client";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Trash2, Search } from "lucide-react";
import GoogleMap from "@/components/google-map";
import AddressSearch from "@/components/address-search";

export default function PlacesPage() {
  const [places, setPlaces] = useState([
    { id: 1, name: "Home", lat: 29.7604, lng: -95.3698, risk: "Good", outlook: "Stable, low pollutants" },
    { id: 2, name: "Work", lat: 29.7499, lng: -95.3664, risk: "Caution", outlook: "Improving" },
  ]);
  const [newPlace, setNewPlace] = useState({ name: "", lat: 0, lng: 0 });
  const [searchAddress, setSearchAddress] = useState("");
  const nextIdRef = useRef(3);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setNewPlace({
        name: place.formatted_address || place.name || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleMapClick = (latLng: google.maps.LatLngLiteral) => {
    setNewPlace({
      ...newPlace,
      lat: latLng.lat,
      lng: latLng.lng,
    });
  };

  const addPlace = () => {
    if (newPlace.name && newPlace.lat && newPlace.lng) {
      const id = nextIdRef.current++;
      setPlaces([
        ...places,
        {
          id,
          name: newPlace.name,
          lat: newPlace.lat,
          lng: newPlace.lng,
          risk: "Good",
          outlook: "Check now",
        },
      ]);
      setNewPlace({ name: "", lat: 0, lng: 0 });
      setSearchAddress("");
    }
  };

  const deletePlace = (id: number) => {
    setPlaces(places.filter(p => p.id !== id));
  };

  const markers = places.map(place => ({ lat: place.lat, lng: place.lng }));

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
            <div className="space-y-4">
              <AddressSearch
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for an address to add as a place"
                className="w-full"
              />
              <div className="text-sm text-gray-600">
                Start typing for autocomplete suggestions, or press Enter to search the exact address. You can also click on the map below to select a location.
              </div>
            </div>

            <GoogleMap
              center={{ lat: 29.7604, lng: -95.3698 }}
              zoom={10}
              style={{ width: '100%', height: '300px', borderRadius: '8px' }}
              markers={markers}
              onMapClick={handleMapClick}
            />

            <div className="flex gap-2">
              <Input
                placeholder="Place name (e.g., Park, Gym)"
                value={newPlace.name}
                onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                className="flex-1"
              />
              <Button onClick={addPlace} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Place
              </Button>
            </div>

            {newPlace.lat !== 0 && newPlace.lng !== 0 && (
              <div className="text-sm text-gray-600">
                Selected location: {newPlace.lat.toFixed(6)}, {newPlace.lng.toFixed(6)}
              </div>
            )}
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