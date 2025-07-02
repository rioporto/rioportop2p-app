'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showMarker?: boolean;
  markerTitle?: string;
}

export function GoogleMap({
  center = { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
  zoom = 15,
  height = '400px',
  showMarker = true,
  markerTitle = 'Rio Porto P2P'
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    if (typeof window !== 'undefined' && window.google && mapRef.current) {
      initializeMap();
    }
  }, [GOOGLE_MAPS_API_KEY, center, zoom]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Criar o mapa
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Adicionar marcador se solicitado
    if (showMarker) {
      new google.maps.Marker({
        position: center,
        map: mapInstanceRef.current,
        title: markerTitle,
        animation: google.maps.Animation.DROP
      });
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center" style={{ height }}>
        <p className="text-gray-600 dark:text-gray-400">Mapa não disponível</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`}
        strategy="lazyOnload"
        onLoad={initializeMap}
      />
      <div 
        ref={mapRef} 
        className="w-full rounded-lg shadow-lg"
        style={{ height }}
      />
    </>
  );
}