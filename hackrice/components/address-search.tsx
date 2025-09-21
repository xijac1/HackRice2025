"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface AddressSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressSearch({ onPlaceSelect, placeholder = "Search for an address...", className }: AddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = inputRef.current?.value?.trim();
      if (query && geocoderRef.current) {
        geocoderRef.current.geocode({ address: query }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const place = results[0];
            onPlaceSelect({
              ...place,
              formatted_address: place.formatted_address,
              geometry: place.geometry,
              name: place.formatted_address,
            } as google.maps.places.PlaceResult);
          }
        });
      }
    }
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Restrict to US for now
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          onPlaceSelect(place);
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={className}
      onKeyPress={handleKeyPress}
    />
  );
}