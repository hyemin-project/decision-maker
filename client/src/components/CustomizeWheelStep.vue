<template>
  <div class="container customize-wheel-step">
    <div class="row justify-content-center">
      <div class="col-12 text-center">
        <h2>Customize Your Wheel</h2>
      </div>
      <div class="col-12 col-md-8">
        <div v-for="(choice, index) in choices" :key="index" class="color-picker mb-3">
          <label class="form-label">{{ choice }}</label>
          <input type="color" class="form-control form-control-color" v-model="colors[index]">
        </div>
      </div>
      <div class="col-12 text-center mt-3">
        <button class="btn btn-success" @click="nextStep">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CustomizeWheelStep',
  setup() {
    const store = useStore()
    const choices = computed(() => store.state.choices)
    const colors = ref(choices.value.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`))

    const nextStep = () => {
      store.commit('setWheelCustomization', { colors: colors.value })
      store.commit('setCurrentStep', 5)
    }

    return {
      choices,
      colors,
      nextStep
    }
  }
}
</script>

<style lang="scss" scoped>
.customize-wheel-step {
  padding: 2rem;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .color-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;

    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    input[type="color"] {
      width: 100%;
      padding: 0.3rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      cursor: pointer;
    }
  }

  button {
    margin-top: 1.5rem;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
