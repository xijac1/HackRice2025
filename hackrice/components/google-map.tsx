"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { ReactElement, useRef, useEffect } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div />;
};

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  style?: React.CSSProperties;
  onMapLoad?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  origin?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  markers?: google.maps.LatLngLiteral[];
  onMapClick?: (latLng: google.maps.LatLngLiteral) => void;
}

function MyMapComponent({
  center,
  zoom,
  style,
  onMapLoad,
  children,
  origin,
  destination,
  markers = [],
  onMapClick,
}: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
      });
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapRef.current);

      // Add click listener
      if (onMapClick) {
        mapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const latLng = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            onMapClick(latLng);
          }
        });
      }

      if (onMapLoad) {
        onMapLoad(mapRef.current);
      }
    }
  }, [center, zoom, onMapLoad, onMapClick]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (directionsServiceRef.current && directionsRendererRef.current && origin && destination) {
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.WALKING,
      };
      directionsServiceRef.current.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current!.setDirections(result);
        }
      });
    }
  }, [origin, destination]);

  // Handle markers
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    if (mapRef.current) {
      markers.forEach(markerPosition => {
        const marker = new window.google.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
        });
        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  return <div ref={ref} style={style} />;
}

export default function GoogleMap(props: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>Google Maps API key not configured</div>;
  }

  return (
    <Wrapper
      apiKey={apiKey}
      libraries={['places', 'geocoding']}
      render={render}
    >
      <MyMapComponent {...props} />
    </Wrapper>
  );
}