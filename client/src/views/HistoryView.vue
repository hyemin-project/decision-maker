<template>
  <div class="history-view">
    <h2>Decision History</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ul v-else-if="decisionHistory && decisionHistory.length > 0" class="decision-list">
      <li v-for="decision in decisionHistory" :key="decision.id" class="decision-item">
        <h3>{{ decision.decisionQuestion }}</h3>
        <p>Result: {{ decision.result }}</p>
        <p>Date: {{ formatDate(decision.createdAt) }}</p>
      </li>
    </ul>
    <div v-else class="no-decisions">No decisions found.</div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HistoryView',
  setup() {
    const store = useStore()

    const decisionHistory = computed(() => store.state.decisionHistory)
    const loading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)

    const fetchDecisionHistory = () => {
      store.dispatch('fetchDecisionHistory')
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(fetchDecisionHistory)

    return {
      decisionHistory,
      loading,
      error,
      formatDate
    }
  }
}
</script>

<style scoped>
.history-view {
  padding: 1rem;
}

.decision-list {
  list-style-type: none;
  padding: 0;
}

.decision-item {
  background-color: #f0f0f0;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
}

.decision-item h3 {
  margin-top: 0;
}

.loading, .error {
  text-align: center;
  margin-top: 2rem;
}

.error {
  color: red;
}
</style>