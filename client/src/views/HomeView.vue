<template>
  <div class="container home-view">
    <div class="text-center">
      <h1>Discover the Power of Decision Making</h1>
      <p>Our tool helps you make decisions quickly and efficiently.</p>
      <router-link to="/new-decision" class="btn btn-primary mt-3">Start Now</router-link>
    </div>
    <!-- Additional content specific to HomeView can go here -->
    <div class="additional-content mt-5">
      <h2>Why Use Our Tool?</h2>
      <p>Our decision-making tool is designed to help you:</p>
      <ul>
        <li>Save time</li>
        <li>Make informed decisions</li>
        <li>Reduce stress</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.additional-content {
  max-width: 600px;
  margin-top: 2rem;
  text-align: left;
}
</style>
