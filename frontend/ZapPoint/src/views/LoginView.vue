
<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="/zappoint-logo.png" alt="Zappoint Logo" class="logo" />
      <h2 class="title">Login</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="auth-input"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="auth-input"
          required
        />
        <button type="submit" class="auth-button">Login</button>
      </form>
      <p class="auth-switch">
        Don’t have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    })
    
    // FIX: Token is inside user object, not at root level
    const token = response.data.user.token;
    
    // Store token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    router.push('/dashboard');
  } catch (err) {
    // Improved error handling
    let errorMessage = 'Login failed';
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as any).response;
      errorMessage = response?.data?.message || errorMessage;
      console.error('Login error:', response);
    } else {
      console.error('Login error:', err);
    }
    alert(`Error: ${errorMessage}`);
  }
}
</script>

<style scoped>
.auth-page {
  background: linear-gradient(to bottom right, #e6f5e6, #ccf3cc);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 128, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.logo {
  width: 80px;
  margin-bottom: 1rem;
}

.title {
  margin-bottom: 1.5rem;
  color: #1b5e20;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.auth-button {
  background: linear-gradient(to right, #ffcc00, #66bb6a);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.auth-button:hover {
  background: linear-gradient(to right, #fbc02d, #43a047);
}

.auth-switch {
  margin-top: 1rem;
  color: #2e7d32;
}

.auth-switch a {
  color: #2e7d32;
  font-weight: bold;
}
</style>
