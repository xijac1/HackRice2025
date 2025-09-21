"use client";
import { useEffect, useRef, useState } from "react";

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface Place {
  id: number;
  name: string;
  lat: number;
  lon: number;
  risk: string;
  outlook: string;
  formattedAddress?: string;
}

interface GoogleMapsPlacesProps {
  onPlaceSelect: (place: Omit<Place, 'id' | 'risk' | 'outlook'>) => void;
  existingPlaces: Place[];
}

export default function GoogleMapsPlaces({ onPlaceSelect, existingPlaces }: GoogleMapsPlacesProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [infowindow, setInfowindow] = useState<any>(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          return;
        }

        // Create API loader element
        const apiLoader = document.createElement('gmpx-api-loader');
        apiLoader.setAttribute('key', 'AIzaSyBpbnqAsQQ8TEENFW-RTukadsvb3w5hZI8');
        apiLoader.setAttribute('solution-channel', 'GMP_GE_mapsandplacesautocomplete_v2');
        document.body.appendChild(apiLoader);

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';
        script.type = 'module';
        script.async = true;
        
        // Wait for the script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Google Maps API'));
          document.head.appendChild(script);
        });

        // Wait for custom elements to be defined with timeout
        await Promise.race([
          customElements.whenDefined('gmp-map'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout waiting for gmp-map')), 10000)
          )
        ]);

        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please refresh the page.');
      }
    };

    initGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || error) return;

    const initMap = async () => {
      try {
        // Create the map element
        const mapElement = document.createElement('gmp-map');
        mapElement.setAttribute('center', '29.7604,-95.3698'); // Houston, TX
        mapElement.setAttribute('zoom', '13');
        mapElement.setAttribute('map-id', 'DEMO_MAP_ID');
        mapElement.style.height = '400px';
        mapElement.style.width = '100%';

        // Create place picker
        const placePickerContainer = document.createElement('div');
        placePickerContainer.setAttribute('slot', 'control-block-start-inline-start');
        placePickerContainer.className = 'place-picker-container';
        placePickerContainer.style.padding = '20px';

        const placePicker = document.createElement('gmpx-place-picker');
        placePicker.setAttribute('placeholder', 'Enter an address');
        placePickerContainer.appendChild(placePicker);

        // Create marker
        const markerElement = document.createElement('gmp-advanced-marker');

        // Add elements to map
        mapElement.appendChild(placePickerContainer);
        mapElement.appendChild(markerElement);

        // Clear and add to container
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
          mapRef.current.appendChild(mapElement);
        }

        // Wait for map to be ready with timeout
        const googleMap = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Map initialization timeout'));
          }, 15000);

          const checkMap = () => {
            if ((mapElement as any).innerMap) {
              clearTimeout(timeout);
              resolve((mapElement as any).innerMap);
            } else {
              setTimeout(checkMap, 100);
            }
          };
          checkMap();
        });

        const googleMarker = markerElement;
        const googleInfowindow = new (window.google as any).maps.InfoWindow();

        setMap(googleMap);
        setMarker(googleMarker);
        setInfowindow(googleInfowindow);

        // Configure map options
        (googleMap as any).setOptions({
          mapTypeControl: false
        });

        // Add event listener for place selection
        placePicker.addEventListener('gmpx-placechange', () => {
          const place = (placePicker as any).value;

          if (!place.location) {
            window.alert("No details available for input: '" + place.name + "'");
            googleInfowindow.close();
            (googleMarker as any).position = null;
            return;
          }

          if (place.viewport) {
            (googleMap as any).fitBounds(place.viewport);
          } else {
            (mapElement as any).center = place.location;
            (mapElement as any).zoom = 17;
          }

          (googleMarker as any).position = place.location;
          googleInfowindow.setContent(
            `<strong>${place.displayName}</strong><br>
             <span>${place.formattedAddress}</span>
          `);
          googleInfowindow.open(googleMap, googleMarker);

          // Call the callback with place data
          onPlaceSelect({
            name: place.displayName || place.name,
            lat: place.location.lat,
            lon: place.location.lng,
            formattedAddress: place.formattedAddress
          });
        });

        // Add existing places as markers
        existingPlaces.forEach((place) => {
          const existingMarker = new (window.google as any).maps.Marker({
            position: { lat: place.lat, lng: place.lon },
            map: googleMap,
            title: place.name
          });

          const existingInfowindow = new (window.google as any).maps.InfoWindow({
            content: `<strong>${place.name}</strong><br>
                     <span>${place.risk} - ${place.outlook}</span>`
          });

          existingMarker.addListener('click', () => {
            existingInfowindow.open(googleMap, existingMarker);
          });
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please refresh the page.');
      }
    };

    initMap();
  }, [isLoaded, onPlaceSelect, existingPlaces, error]);

  return (
    <div className="w-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full rounded-lg overflow-hidden border">
        {error ? (
          <div className="h-96 flex items-center justify-center bg-red-50">
            <div className="text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        ) : !isLoaded ? (
          <div className="h-96 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
