<template>
  <div class="container results-step">
    <div class="row justify-content-center">
      <div class="col-12 text-center">
        <h2>Your Decision Result</h2>
      </div>
      <div class="col-12 col-md-8 col-lg-6">
        <div class="decision-question mb-4">
          <h3>Question:</h3>
          <p class="lead">{{ decisionQuestion }}</p>
        </div>
        <div class="result-display" :style="{ backgroundColor: resultColor }">
          <p class="result-text">{{ result }}</p>
        </div>
      </div>
      <div class="col-12 text-center mt-3 action-buttons">
      <button class="btn btn-primary me-2" @click="spinAgain">Spin Again</button>
      <button class="btn btn-warning me-2" @click="newDecision">New Decision</button>
      <button class="btn btn-success me-2" @click="shareResult">Share Result</button>
      <button v-if="isLoggedIn" class="btn btn-info" @click="saveResult" :disabled="isSaving">
        {{ isSaving ? 'Saving...' : 'Save Result' }}
      </button>
      <button v-else class="btn btn-secondary" @click="promptLogin">Login to Save</button>
    </div>
      <div v-if="showShareOptions" class="col-12 text-center mt-3 share-options">
        <button class="btn btn-outline-primary me-2" @click="shareVia('twitter')">Twitter</button>
        <button class="btn btn-outline-primary me-2" @click="shareVia('facebook')">Facebook</button>
        <button class="btn btn-outline-primary" @click="shareVia('email')">Email</button>
      </div>
      <div class="col-12 col-md-8 col-lg-6 mt-3 decision-summary">
        <h3>Decision Summary</h3>
        <ul class="list-group">
          <li v-for="(choice, index) in choices" :key="index" class="list-group-item">
            {{ choice }} <span v-if="choice === result" class="badge bg-success">Selected</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Success Modal -->
    <b-modal v-model="showSuccessModal" title="Result Saved" ok-only @ok="closeModal">
      <p class="my-4">Your decision result has been saved successfully!</p>
    </b-modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import api from '@/services/api' 
import { useRouter } from 'vue-router' 

export default {
  name: 'ResultsStep',
  setup() {
    const store = useStore()
    const router = useRouter()
    const result = computed(() => store.state.result)
    const choices = computed(() => store.state.choices)
    const decisionQuestion = computed(() => store.state.decisionQuestion)
    const showShareOptions = ref(false)
    const isSaving = ref(false)
    const saveMessage = ref('')
    const isLoggedIn = computed(() => !!store.state.user)
    const userId = computed(() => store.state.user?.id)
    const showSuccessModal = ref(false)
    const userPicks = ref([])


    const resultColor = computed(() => {
      const colors = store.state.wheelCustomization.colors || []
      const index = choices.value.indexOf(result.value)
      return colors[index] || '#4caf50' // default color if not found
    })

    const spinAgain = () => {
      store.commit('setCurrentStep', 5) // Go back to spin wheel step
    }

    const newDecision = () => {
      store.commit('resetDecision')
      store.commit('setCurrentStep', 1) // Go back to first step
    }

    const shareResult = () => {
      showShareOptions.value = !showShareOptions.value
    }

    const shareVia = (platform) => {
      const message = `I used the Advanced Virtual Decision Maker and got: ${result.value}`
      let url = ''

      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
          break
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`
          break
        case 'email':
          url = `mailto:?subject=My Decision Result&body=${encodeURIComponent(message)}`
          break
      }

      if (url) {
        window.open(url, '_blank')
      }

      showShareOptions.value = false
    }


    const saveResult = async () => {
      if (isSaving.value) return;
      isSaving.value = true;
      saveMessage.value = '';
      try {
        const savedResult = await api.saveResult({
          userId: userId.value, 
          decisionQuestion: decisionQuestion.value,
          result: result.value,
          choices: choices.value
        });
        console.log('Result saved:', savedResult);
        saveMessage.value = 'Result saved successfully!';
      } catch (error) {
        console.error('Error saving result:', error);
        saveMessage.value = 'Failed to save result. Please try again.';
      } finally {
        isSaving.value = false;
      }
    }

    const closeModal = () => {
      showSuccessModal.value = false;
    }

    const promptLogin = () => {
      router.push('/login');
    }
    

    return {
      result,
      choices,
      decisionQuestion,
      resultColor,
      showShareOptions,
      spinAgain,
      newDecision,
      shareResult,
      shareVia,
      saveResult,
      isSaving,
      saveMessage,
      isLoggedIn,
      promptLogin,
      showSuccessModal,
      closeModal,
      userPicks
    }
  }
}
</script>

<style lang="scss" scoped>
.results-step {
  text-align: center;
  padding: 2rem;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .result-display {
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    max-width: 400px;
    color: white;
  }

  .result-text {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .action-buttons button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  .share-options button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 14px;
  }

  .decision-summary {
    margin-top: 30px;
    text-align: left;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      padding: 10px;
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 5px;

      .badge {
        padding: 5px 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
