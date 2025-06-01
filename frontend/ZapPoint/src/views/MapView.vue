<template>
  <div id="map" class="h-screen w-full"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

onMounted(async () => {
  // Initialize map
  const map = L.map('map').setView([20.5937, 78.9629], 5)
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  try {
    // Fetch stations from API
    const token = localStorage.getItem('authToken');
    const res = await fetch('http://localhost:5000/api/stations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status} - ${res.statusText}`);
    }
    
    const responseData = await res.json();
    console.log('API response data:', responseData);
    
    // Handle different response formats
    let stations = [];
    if (Array.isArray(responseData)) {
      stations = responseData;
    } else if (Array.isArray(responseData.stations)) {
      stations = responseData.stations;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      stations = responseData.data;
    } else {
      throw new Error('Unexpected API response format');
    }
    
    console.log('Processed stations:', stations);

    // Create markers for each station
    stations.forEach(station => {
      // Check if station has valid location data
      if (
        station.location &&
        typeof station.location.latitude === 'number' &&
        typeof station.location.longitude === 'number'
      ) {
        const marker = L.marker([
          station.location.latitude, 
          station.location.longitude
        ]).addTo(map);

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px">
            <b>${station.name}</b><br>
            Status: ${station.status}<br>
            Power: ${station.powerOutput} kW<br>
            Connector: ${station.connectorType}
          </div>
        `;

        // Bind popup to marker
        marker.bindPopup(popupContent);
      } else {
        console.warn('Station has invalid location data:', station);
      }
    });
  } catch (err) {
    console.error('Failed to load stations:', err);
  }
});
</script>

<style>
#map {
  height: 100vh;
  width: 100%;
  z-index: 1;
}

/* Optional: Add loading spinner */
#map::before {
  content: "Loading map...";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  color: #666;
  font-size: 1.2rem;
}
</style>