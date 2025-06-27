import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Check if Leaflet is already loaded
        if (window.L) {
          setLeafletLoaded(true);
          return;
        }

        // Load Leaflet CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
          // Fix marker icons
          const L = window.L;
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          });
          setLeafletLoaded(true);
        };

        script.onerror = () => {
          setError('Failed to load map library');
          setLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        setError('Failed to initialize map');
        setLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    const L = window.L;

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([0, 0], 2);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initialize marker
    const marker = L.marker([0, 0]).addTo(map);
    markerRef.current = marker;

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Update marker and map
          marker.setLatLng([lat, lng]).update();
          map.setView([lat, lng], 13);
          marker
            .bindPopup('<strong>This is your location</strong>')
            .openPopup();

          setLoading(false);
        },
        (err) => {
          setError(
            err.message || 'Unable to fetch location. Please enable location services.'
          );
          setLoading(false);

          // Fallback to default location (London)
          map.setView([51.505, -0.09], 13);
          marker
            .setLatLng([51.5, -0.09])
            .bindPopup('Default location: London')
            .openPopup();
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);

      // Fallback to default location
      map.setView([51.505, -0.09], 13);
      marker
        .setLatLng([51.5, -0.09])
        .bindPopup('Default location: London')
        .openPopup();
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  return (
    <div className="relative h-96 w-full rounded-lg shadow-lg border border-gray-200">
      <div ref={mapRef} className="h-full w-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
          <div className="text-gray-700 font-medium">Loading map...</div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-md max-w-xs">
          <div className="text-sm">{error}</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;