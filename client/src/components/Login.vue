<template>
    <div class="container login-page">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <h2 class="text-center mb-4">Login</h2>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control custom-input" id="email" v-model="email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control custom-input" id="password" v-model="password" required>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </div>
          </form>
          <p v-if="error" class="text-danger mt-3">{{ error }}</p>
          <p class="mt-3 text-center">
            Don't have an account? <router-link to="/signup">Sign Up</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const isLoading = ref(false);

    const login = async () => {
      isLoading.value = true;
      error.value = '';
      try {
        await store.dispatch('login', {
          email: email.value,
          password: password.value
        });
        router.push('/');  // Redirect to home page after successful login
      } catch (e) {
        console.error('Login error:', e);
        error.value = e.response?.data?.error || 'Login failed. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    return { email, password, error, isLoading, login };
  }
}
</script>
  
  <style lang="scss" scoped>
  .login-page {
    padding: 2rem;
  
    .custom-input {
      background-color: #f0f2f4;
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      color: #111418;
  
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
  
    .btn-primary {
      background-color: #1568c1;
      border-color: #1568c1;
      border-radius: 0.75rem;
      font-weight: bold;
    }
  }
  </style>