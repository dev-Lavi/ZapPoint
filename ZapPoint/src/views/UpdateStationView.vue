<template>
  <div class="dashboard-view">
    <aside class="sidebar">
      <img src="/zappoint-logo.png" alt="ZapPoint Logo" class="logo" />
      <nav>
        <RouterLink to="/dashboard" class="nav-item">
          <i class="icon-dashboard" /> Dashboard
        </RouterLink>
        <RouterLink to="/" class="nav-item"> 
          <i class="icon-home" /> Home
        </RouterLink>
        <RouterLink to="/map" class="nav-item">
          <i class="icon-home" /> Location
        </RouterLink>
        <RouterLink to="/create" class="nav-item">
          <i class="icon-create" /> Create Station
        </RouterLink>
        <RouterLink to="/update" class="nav-item active">
          <i class="icon-update" /> Update Station
        </RouterLink>
        <RouterLink to="/delete" class="nav-item">
          <i class="icon-delete" /> Delete Station
        </RouterLink>
      </nav>
    </aside>

    <main class="dashboard-content">
      <div class="dashboard-header">
        <h2>Update Charging Station</h2>
      </div>

      <form @submit.prevent="updateStation" class="station-form">
        <div class="form-group">
          <label>Station ID</label>
          <input v-model="stationId" type="text" placeholder="Enter station ID" required />
          <!-- <button @click.prevent="fetchStation" class="load-btn">Load Station</button> -->
        </div>

        <div v-if="station.name" class="station-preview">
          <p><strong>Name:</strong> {{ station.name }}</p>
          <p><strong>Connector Type:</strong> {{ station.connectorType }}</p>
          <p><strong>Location:</strong> {{ station.location.latitude }}, {{ station.location.longitude }}</p>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div class="form-group">
          <label>Power Output (kW)</label>
          <input v-model.number="form.powerOutput" type="number" placeholder="e.g., 100" required />
        </div>

        <button type="submit" class="submit-btn">Update Station</button>

        <p v-if="message" class="message">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stationId = ref('')
const form = ref({
  status: 'Inactive',
  powerOutput: ''
})

const station = ref({})
const message = ref('')
const error = ref('')

const fetchStation = async () => {
  error.value = ''
  message.value = ''
  station.value = {}

  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`https://zappoint.onrender.com/api/stations/${stationId.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Failed to fetch station')
    }

    const data = await response.json()
    station.value = data
    form.value.status = data.status
    form.value.powerOutput = data.powerOutput
  } catch (err) {
    error.value = err.message
  }
}

const updateStation = async () => {
  error.value = ''
  message.value = ''

  const token = localStorage.getItem('authToken')
  if (!token) {
    error.value = 'Authentication token missing.'
    return
  }

  try {
    const response = await fetch(`http://localhost:5000/api/stations/${stationId.value}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: form.value.status,
        powerOutput: form.value.powerOutput
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Update failed')
    }

    message.value = 'Station updated successfully.'
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
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
.dashboard-header h2 {
  margin-bottom: 1rem;
}
.station-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f0f0ff;
}
.load-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border: none;
  background: #6c63ff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn {
  background: #a855f7;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.station-preview {
  margin-bottom: 1rem;
  background: #f9f9ff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.message {
  margin-top: 1rem;
  color: green;
  font-weight: 500;
}
.error {
  margin-top: 1rem;
  color: red;
  font-weight: 500;
}
</style>
