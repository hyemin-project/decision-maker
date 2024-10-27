<template>
  <div class="container intro-step">
    <div class="text-center">
      <h1>Welcome to the Advanced Virtual Decision Maker</h1>
      <p>Make complex decisions with ease using our interactive wheel!</p>
      <button @click="startDecisionMaking" class="btn btn-primary mt-3">Get Started</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'IntroStep',
  setup() {
    const store = useStore()

    const startDecisionMaking = () => {
      store.commit('setCurrentStep', 2)
    }

    return {
      startDecisionMaking
    }
  }
}
</script>

<style scoped>
.intro-step {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
</style>
