<template>
  <div class="container enter-choices-step">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h3 class="text-start mb-4">Make a decision</h3>
        
        <!-- Decision input -->
        <div class="mb-4">
          <label class="form-label">What's your decision?</label>
          <input
            v-model="decisionQuestion"
            @input="updateDecisionQuestion"
            class="form-control custom-input"
            placeholder="Should I move to New York?"
          />
        </div>

        <h4 class="text-start mb-3">Options</h4>

        <!-- Existing choices -->
        <ul class="list-group mb-3">
          <li v-for="(choice, index) in choices" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
            {{ choice }}
            <button class="btn btn-danger btn-sm" @click="removeChoice(index)">Remove</button>
          </li>
        </ul>

        <!-- Add new choice -->
        <div class="mb-3">
          <div class="input-group">
            <input
              v-model="newChoice"
              class="form-control custom-input"
              placeholder="Enter a new option"
              @keyup.enter="addChoice"
            />
            <button class="btn btn-primary" @click="addChoice" :disabled="!newChoice">Add Option</button>
          </div>
        </div>

        <!-- Submit button -->
        <div class="text-center mt-4">
          <button @click="nextStep" class="btn btn-success btn-lg" :disabled="choices.length < 2">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "EnterChoicesStep",
  setup() {
    const store = useStore();
    const newChoice = ref("");
    const choices = computed(() => store.state.choices);
    const decisionQuestion = ref('')
    

    const addChoice = () => {
      if (newChoice.value) {
        store.commit("addChoice", newChoice.value);
        newChoice.value = "";
      }
    };

    const removeChoice = (index) => {
      store.commit("removeChoice", index);
    };

    const updateDecisionQuestion = () => {
      store.dispatch('setDecisionQuestion', decisionQuestion.value)
    }

    const nextStep = () => {
      store.commit("setDecisionQuestion", decisionQuestion.value);
      store.commit("setCurrentStep", 3);
    };

    return {
      newChoice,
      choices,
      addChoice,
      removeChoice,
      nextStep,
      decisionQuestion,
      updateDecisionQuestion,
    };
  },
};
</script>

<style lang="scss" scoped>
.enter-choices-step {
  padding: 2rem;

  h3, h4 {
    color: #111418;
    font-weight: bold;
  }

  .custom-input {
    background-color: #f0f2f4;
    border: none;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    color: #111418;

    &::placeholder {
      color: #637588;
    }

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }

  .btn {
    border-radius: 0.75rem;
    font-weight: bold;
  }

  .btn-success {
    background-color: #1568c1;
    border-color: #1568c1;
  }

  .list-group-item {
    background-color: #f0f2f4;
    border: none;
    border-radius: 0.75rem;
    margin-bottom: 0.5rem;
  }
}
</style>