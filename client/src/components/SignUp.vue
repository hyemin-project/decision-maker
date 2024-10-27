<template>
  <div class="container sign-up-page">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <h2 class="text-center mb-4">Sign Up</h2>
        <form @submit.prevent="signUp">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control custom-input" id="username" v-model="username" required>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control custom-input" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control custom-input" id="password" v-model="password" required>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading || !isFormValid">
              {{ isLoading ? 'Signing Up...' : 'Sign Up' }}
            </button>
          </div>
        </form>
        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
        <p class="mt-3 text-center">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import api from '@/services/api';

export default {
  name: 'SignUpPage',
  setup() {
    const router = useRouter();
    const store = useStore();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const isLoading = ref(false);

    const isFormValid = computed(() => {
      return username.value.length > 0 &&
             email.value.includes('@') &&
             password.value.length >= 8;
    });

    onMounted(() => {
      // Load reCAPTCHA script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=6Ld9gBUqAAAAAMWEduC6rRlHiVMrJugWHQ40kvDg';
      document.head.appendChild(script);
    });

    const signUp = async () => {
      isLoading.value = true;
      error.value = '';
      try {
        // Execute reCAPTCHA
        const recaptchaToken = await new Promise((resolve, reject) => {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute('6Ld9gBUqAAAAAMWEduC6rRlHiVMrJugWHQ40kvDg', {action: 'signup'})
              .then(resolve)
              .catch(reject);
          });
        });

        console.log('reCAPTCHA token:', recaptchaToken);

        const response = await api.signup({
          username: username.value,
          email: email.value,
          password: password.value,
          recaptchaToken: recaptchaToken
        });

        console.log('SignUp response:', response);

        if (!response.token) {
          throw new Error('No token received from server');
        }

        await store.dispatch('setUser', response.user);
        localStorage.setItem('token', response.token);
        router.push('/');
      } catch (e) {
        console.error('Sign up error:', e);
        if (e.response?.status === 409) {
          error.value = 'Email already in use. Please use a different email.';
        } else if (e.message === 'No token received from server') {
          error.value = 'Sign up successful, but there was an issue with authentication. Please try logging in.';
        } else {
          error.value = 'Sign up failed. Please try again.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      username,
      email,
      password,
      error,
      isLoading,
      signUp,
      isFormValid
    };
  }
}
</script>

<style lang="scss" scoped>

</style>