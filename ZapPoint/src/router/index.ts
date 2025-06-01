import { createRouter, createWebHistory } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import ChargerListView from '../views/ChargerListView.vue'
import CreateStationView from '../views/CreateStationView.vue'
import UpdateStationView from '../views/UpdateStationView.vue'
import DeleteStationView from '../views/DeleteStationView.vue'
import MapView from '../views/MapView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'ChargerList', component: ChargerListView },
  { path: '/create', name: 'CreateStation', component: CreateStationView },
  { path: '/update', name: 'UpdateStation', component: UpdateStationView },
  { path: '/delete', name: 'DeleteStation', component: DeleteStationView },
  { path: '/map', name: 'Map', component: MapView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
