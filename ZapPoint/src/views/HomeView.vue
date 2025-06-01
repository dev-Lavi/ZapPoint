<template>
  <div class="homepage">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo">
        <img src="/zappoint-logo.png" alt="ZapPoint Logo" />
        <span class="brand">zappoint</span>
      </div>
      <nav class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/features">Features</RouterLink>
        <RouterLink to="/about">About us</RouterLink>
        <RouterLink to="/app">App</RouterLink>
      </nav>
      <div class="auth-buttons">
        <RouterLink class="btn-outline" to="/login">Sign In</RouterLink>
        <RouterLink class="btn-filled" to="/register">Create an account</RouterLink>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>
          Charge<br />
          <span>Smarter</span>,<br />
          Drive <span>Farther</span>.
        </h1>
        <p>
          Manage, optimize, and monetize EV charging<br />
          stations effortlessly.
        </p>
      </div>
      <div class="hero-image">
        <img src="/ev-charger.png" alt="EV Charger" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homepage {
  background-color: #ffffff;
  color: #1a1a1a;
  padding: 0 2rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo img {
  height: 40px;
}

.brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: #16a34a;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  font-weight: 500;
}

.nav-links a {
  color: #000000;
  text-decoration: none;
}

.auth-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 2px solid #000000;
  border-radius: 6px;
  text-decoration: none;
  color: #000000;
  font-weight: 500;
}

.btn-filled {
  padding: 0.5rem 1rem;
  background-color: #7c3aed;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 0;
  flex-wrap: wrap;
  gap: 2rem;
}

.hero-text {
  max-width: 500px;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a1a1a;
}

.hero-text h1 span {
  color: #7c3aed;
}

.hero-text p {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #808080;
}

.hero-image img {
  max-width: 500px;
  width: 100%;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .nav-links {
    display: none;
  }
}
</style>
