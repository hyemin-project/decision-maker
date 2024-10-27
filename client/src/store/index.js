import { createStore } from 'vuex'
import api from '@/services/api'

export default createStore({
  state: {
    currentStep: 1,
    choices: [],
    probabilities: [],
    wheelCustomization: {},
    result: null,
    user: null,
    decisionQuestion: '',
    decisionHistory: [],
    loading: false,
    error: null
  },
  mutations: {
    setDecisionHistory(state, history) {
      state.decisionHistory = history
    },
    setLoading(state, isLoading) {
      state.loading = isLoading
    },
    setError(state, error) {
      state.error = error
    }
    ,
    setUser(state, user) {
      state.user = user;
    },
    setCurrentStep(state, step) {
      state.currentStep = step
    },
    addChoice(state, choice) {
      state.choices.push(choice)
    },
    removeChoice(state, index) {
      state.choices.splice(index, 1)
      if (state.probabilities.length > index) {
        state.probabilities.splice(index, 1)
      }
    },
    setProbabilities(state, probabilities) {
      state.probabilities = probabilities
    },
    setWheelCustomization(state, customization) {
      state.wheelCustomization = customization
    },
    setResult(state, result) {
      state.result = result
    },
    resetDecision(state) {
      state.choices = []
      state.probabilities = []
      state.wheelCustomization = {}
      state.result = null
    },
    setDecisionQuestion(state, decisionQuestion){
      state.decisionQuestion = decisionQuestion
    }
  },
  actions: {
    
    setUser({ commit }, user) {
      commit('setUser', user)
    },

    setDecisionQuestion({commit}, decisionQuestion){
      commit('setDecisionQuestion', decisionQuestion)
    },

    async fetchChoices({ commit }) {
      const choices = await api.getChoices();
      commit('setChoices', choices);
    },
    async createChoice({ commit }, choice) {
      const newChoice = await api.addChoice(choice);
      commit('addChoice', newChoice);
    },
    async login({ commit }, { email, password }) {
      try {
        const response = await api.login({ email, password });
        commit('setUser', response.user);
        localStorage.setItem('token', response.token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async logout({ commit }) {
      commit('setUser', null);
      localStorage.removeItem('token');
    },
    async signUp({ commit }, { username, email, password }) {
      try {
        const response = await api.signup({ username, email, password });
        commit('setUser', response.user);
        localStorage.setItem('token', response.token);
      } catch (error) {
        console.error('Sign up failed:', error);
        throw error;
      }
    },
    async saveResult({ state }) {
      try {
        const savedResult = await api.saveResult({
          result: state.result,
          choices: state.choices,
          probabilities: state.probabilities,
          decision: state.decision,
          userId: state.user ? state.user.id : null
        });
        return savedResult;
      } catch (error) {
        console.error('Failed to save result:', error);
        throw error;
      }
    },
    async checkAuth({ commit }) {
      try {
        const userData = await api.verifyToken();
        if (userData && userData.user) {
          commit('setUser', userData.user);
        } else {
          commit('setUser', null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        commit('setUser', null);
      }
    },
    async fetchDecisionHistory({ commit }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const response = await api.getDecisionHistory()
        commit('setDecisionHistory', response.data)
      } catch (error) {
        console.error('Error in fetchDecisionHistory:', error)
        commit('setError', 'Failed to fetch decision history. Please try again later.')
      } finally {
        commit('setLoading', false)
      }
    },
    
  },
  modules: {
    // Add modules if needed
  },
})