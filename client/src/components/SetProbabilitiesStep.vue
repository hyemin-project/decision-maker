<template>
  <div class="container set-probabilities-step">
    <div class="row justify-content-center">
      <div class="col-12 text-center">
        <h2>Set Probabilities (Optional)</h2>
      </div>
      <div class="col-12 col-md-8">
        <div v-for="(choice, index) in choices" :key="index" class="probability-input mb-3">
          <label class="form-label">{{ choice }}</label>
          <div class="d-flex align-items-center">
            <input type="range" class="form-range me-2" v-model="probabilities[index]" min="0" max="100" @input="normalizeProbabilities">
            <span>{{ probabilities[index] }}%</span>
          </div>
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
  name: 'SetProbabilitiesStep',
  setup() {
    const store = useStore()
    const choices = computed(() => store.state.choices)
    const probabilities = ref(choices.value.map(() => 100 / choices.value.length))

    const normalizeProbabilities = () => {
      const total = probabilities.value.reduce((sum, prob) => sum + Number(prob), 0)
      probabilities.value = probabilities.value.map(prob => (prob / total) * 100)
    }

    const nextStep = () => {
      store.commit('setProbabilities', probabilities.value)
      store.commit('setCurrentStep', 4)
    }

    return {
      choices,
      probabilities,
      normalizeProbabilities,
      nextStep
    }
  }
}
</script>

<style lang="scss" scoped>
.set-probabilities-step {
  padding: 2rem;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .probability-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;

    label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .form-range {
      width: 100%;
    }

    span {
      margin-left: 1rem;
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
