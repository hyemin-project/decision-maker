<template>
  <header class="app-header navbar navbar-expand-lg navbar-light bg-light" :class="{ 'dark-mode': isDarkMode, 'menu-open': isMenuOpen }">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Advanced Virtual Decision Maker</router-link>
      <button class="navbar-toggler menu-toggle" type="button" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: isMenuOpen }">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/new-decision" active-class="active">New Decision</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/history" active-class="active">History</router-link>
          </li>
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login" active-class="active">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/signup" active-class="active">Sign Up</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
            </li>
            <li class="nav-item">
              <span class="nav-link welcome">Welcome, {{ username }}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'AppHeader',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isDarkMode = ref(false);
    const isMenuOpen = ref(false);

    const isLoggedIn = computed(() => !!store.state.user);
    const username = computed(() => store.state.user ? store.state.user.username : '');
    

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      document.body.classList.toggle('dark-mode', isDarkMode.value);
      localStorage.setItem('darkMode', isDarkMode.value);
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenuOnResize = () => {
      if (window.innerWidth > 768 && isMenuOpen.value) {
        isMenuOpen.value = false;
      }
    };

    const logout = () => {
      store.dispatch('setUser', null);
      localStorage.removeItem('token');
      router.push('/login');
    };

    onMounted(() => {
      isDarkMode.value = localStorage.getItem('darkMode') === 'true';
      document.body.classList.toggle('dark-mode', isDarkMode.value);
      window.addEventListener('resize', closeMenuOnResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', closeMenuOnResize);
    });

    return {
      isDarkMode,
      isMenuOpen,
      isLoggedIn,
      username,
      toggleTheme,
      toggleMenu,
      logout
    };
  }
};
</script>

<style scoped>
.app-header {
  padding: 1rem 2rem;
  transition: background-color 0.3s ease;
}

.navbar-brand {
  font-size: 1.5rem;
  color: #333;
  transition: color 0.3s ease;
}

.nav-link {
  color: #555;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: #007bff;
}

.theme-toggle, .menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
  transition: color 0.3s ease;
}

.theme-toggle:hover, .menu-toggle:hover {
  color: #007bff;
}

/* Dark mode styles */
.app-header.dark-mode {
  background-color: #333;
}

.dark-mode .navbar-brand {
  color: #fff;
}

.dark-mode .nav-link {
  color: #ccc;
}

.dark-mode .nav-link:hover, .dark-mode .nav-link.active {
  color: #4db6ac;
}

.dark-mode .theme-toggle, .dark-mode .menu-toggle {
  color: #ccc;
}

.dark-mode .theme-toggle:hover, .dark-mode .menu-toggle:hover {
  color: #4db6ac;
}

.nav-link {
  cursor: pointer;
}

.nav-link.welcome {
  font-weight: bold;
  cursor: default;
}
</style>
