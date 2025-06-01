<template>  
  <div class="dashboard-view">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <img src="/zappoint-logo.png" alt="ZapPoint Logo" class="logo" />
      <nav>
        <RouterLink to="/dashboard" class="nav-item active">
          <i class="icon-dashboard" /> Dashboard
        </RouterLink>
        <RouterLink to="/" class="nav-item"> <!-- Added Home link -->
          <i class="icon-home" /> Home
        </RouterLink>
        <RouterLink to="/map" class="nav-item">
        <i class="icon-home" /> Location
        </RouterLink>
        <RouterLink to="/create" class="nav-item">
          <i class="icon-create" /> Create Station
        </RouterLink>
        <RouterLink to="/update" class="nav-item">
          <i class="icon-update" /> Update Station
        </RouterLink>
        <RouterLink to="/delete" class="nav-item">
          <i class="icon-delete" /> Delete Station
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Dashboard -->
    <main class="dashboard-content">
      <!-- Header with search and profile -->
      <div class="dashboard-header">
                <input 
          v-model="searchQuery"
          type="text" 
          class="search-bar" 
          placeholder="Search by name..." 
        />

        <!-- Filter Controls -->
        <div class="filters">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <select v-model="powerFilter" class="filter-select">
            <option value="">All Power</option>
            <option v-for="power in uniquePowerLevels" :value="power" :key="power">
              {{ power }}kW
            </option>
          </select>
          
          <select v-model="connectorFilter" class="filter-select">
            <option value="">All Connectors</option>
            <option v-for="connector in uniqueConnectors" :value="connector" :key="connector">
              {{ connector }}
            </option>
          </select>
        </div>

        <div class="profile">
          <span>Ananya Singh</span>
          <small>Admin</small>
          <img src="/profile.png" alt="Profile" />
        </div>
      </div>

      <!-- Status Summary -->
      <div class="summary-boxes">
        <div class="summary-box">
          <i class="icon-charger" />
          <div>
            <h3>Charging Stations</h3>
            <p>900</p>
          </div>
        </div>
        <div class="summary-box">
          <i class="icon-active" />
          <div>
            <h3>Active</h3>
            <p>600</p>
          </div>
        </div>
        <div class="summary-box">
          <i class="icon-inactive" />
          <div>
            <h3>Inactive</h3>
            <p>300</p>
          </div>
        </div>
      </div>

      <!-- Graphs -->
      <!-- <div class="graphs">
        <div class="chart-box">
          <h3>Charging Stations This Week</h3>
          <BarChart />
        </div>
        <div class="chart-box">
          <h3>Daily Analysis</h3>
          <LineChart />
        </div>
      </div> -->

      <!-- Filtered Station List -->
      <div class="station-list">
        <h3>All Charging Stations ({{ filteredStations.length }})</h3>
        <ul>
          <li v-for="station in filteredStations" :key="station.id">
            <div class="station-info">
              <p>{{ station.name }}</p>
              <small>{{ station.time }}</small>
              <div class="station-details">
                <span>Power: {{ station.powerOutput }}kW</span>
                <span>Connector: {{ station.connectorType }}</span>
              </div>
            </div>
            <span :class="station.status === 'Active' ? 'status-active' : 'status-inactive'">
              {{ station.status }}
            </span>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>
  

<script setup>
import { ref, computed, onMounted } from 'vue'

const stations = ref([])
const loading = ref(true)
const error = ref(null)
// Reactive data
const searchQuery = ref('')
const statusFilter = ref('')
const powerFilter = ref('')
const connectorFilter = ref('')


const fetchStations = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch('https://zappoint.onrender.com/api/stations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Log response for debugging
    console.log('Response status:', response.status);
    
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to access this resource.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // Parse response and log for debugging
    const responseData = await response.json();
    console.log('API response data:', responseData);
    
    // FIX: Handle different response structures
    if (Array.isArray(responseData)) {
      stations.value = responseData;
    } else if (Array.isArray(responseData.stations)) {
      stations.value = responseData.stations;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      stations.value = responseData.data;
    } else {
      throw new Error('Unexpected API response format');
    }
    
    console.log('Mapped stations:', stations.value);
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// Computed properties for station counts
const totalStations = computed(() => stations.value.length)
const activeStations = computed(() => stations.value.filter(s => s.status === 'Active' || s.isActive).length)
const inactiveStations = computed(() => stations.value.filter(s => s.status === 'Inactive' || !s.isActive).length)

// Computed properties for filters
const uniquePowerLevels = computed(() => {
  const powers = stations.value.map(s => s.powerOutput)
  return [...new Set(powers)].sort((a, b) => a - b)
})

const uniqueConnectors = computed(() => {
  const connectors = stations.value.map(s => s.connectorType)
  return [...new Set(connectors)].sort()
})

const filteredStations = computed(() => {
  return stations.value.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value ? station.status === statusFilter.value : true
    const matchesPower = powerFilter.value ? station.powerOutput == powerFilter.value : true
    const matchesConnector = connectorFilter.value ? station.connectorType === connectorFilter.value : true
    
    return matchesSearch && matchesStatus && matchesPower && matchesConnector
  })
})

// Format date for display - more robust version
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
  
//   try {
//     const date = new Date(dateString);
//     return isNaN(date) ? 'Invalid Date' : date.toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true
//     });
//   } catch (e) {
//     console.error('Date formatting error:', e);
//     return 'Invalid Date';
//   }
// }

// Fetch data on component mount
onMounted(fetchStations)
</script>

<style scoped>
/* Add loading indicator style */
.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Existing styles unchanged */
.dashboard-view {
  display: flex;
  font-family: 'Poppins', sans-serif;
}
.sidebar {
  width: 250px;
  background: #fff;
  padding: 1.5rem;
  border-right: 1px solid #eee;
  height: 100vh;
}
.logo {
  width: 140px;
  margin-bottom: 2rem;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  color: #333;
  text-decoration: none;
}
.nav-item.active {
  color: #a855f7;
}
.dashboard-content {
  flex: 1;
  padding: 2rem;
  background: #f9f9fb;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.search-bar {
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  width: 280px;
  background: #f0f0ff;
}
.profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.summary-boxes {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.summary-box {
  background: #f3f3ff;
  padding: 1.2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}
.chart-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  flex: 1;
}
.graphs {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.station-list ul {
  list-style: none;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
}
.station-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
}
.status-active {
  color: green;
  font-weight: 600;
}
.status-inactive {
  color: red;
  font-weight: 600;
}


/* Add filter styles */
.filters {
  display: flex;
  gap: 10px;
  margin-left: 20px;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f0f0ff;
  cursor: pointer;
}

/* Station details styling */
.station-details {
  display: flex;
  gap: 15px;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
}
/* Adjust header layout */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filters {
    flex-wrap: wrap;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>