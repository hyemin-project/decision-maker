<template>
  <div id="app">
    <AppHeader />
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import AppHeader from '@/components/AppHeader.vue';
import api from '@/services/api';

export default {
  name: 'App',
  components: {
    AppHeader
  },
  setup() {
    const store = useStore();

    function decodeToken(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }

    // After login
    const token = localStorage.getItem('token');
    console.log('Decoded token:', decodeToken(token));

    onMounted(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await api.verifyToken(token);
          store.dispatch('setUser', user);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
    });

    return {};
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}
</style>