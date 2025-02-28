"use client";

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface LocationMapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export function LocationMap({ lat, lng, zoom = 15 }: LocationMapProps) {
  const center = {
    lat: lat,
    lng: lng
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          scrollwheel: false,
          styles: [
            {
              featureType: "all",
              elementType: "all",
              stylers: [
                { saturation: -100 },
                { lightness: 0 }
              ]
            }
          ]
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
} 