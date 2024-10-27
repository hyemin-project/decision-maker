<template>
  <div class="decision-maker container">
    <StepProgress :currentStep="currentStep" />
    <component :is="currentStepComponent"></component>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppHeader from '@/components/AppHeader.vue'
import StepProgress from '@/components/StepProgress.vue'
import IntroStep from '@/components/IntroStep.vue'
import EnterChoicesStep from '@/components/EnterChoicesStep.vue'
import SetProbabilitiesStep from '@/components/SetProbabilitiesStep.vue'
import CustomizeWheelStep from '@/components/CustomizeWheelStep.vue'
import SpinWheelStep from '@/components/SpinWheelStep.vue'
import ResultsStep from '@/components/ResultsStep.vue'

export default {
  name: 'NewDecisionView',
  components: {
    AppHeader,
    StepProgress,
    IntroStep,
    EnterChoicesStep,
    SetProbabilitiesStep,
    CustomizeWheelStep,
    SpinWheelStep,
    ResultsStep
  },
  setup() {
    const store = useStore()
    const currentStep = computed(() => store.state.currentStep)
    const currentStepComponent = computed(() => {
      switch(currentStep.value) {
        case 1: return IntroStep
        case 2: return EnterChoicesStep
        case 3: return SetProbabilitiesStep
        case 4: return CustomizeWheelStep
        case 5: return SpinWheelStep
        case 6: return ResultsStep
        default: return IntroStep
      }
    })

    return {
      currentStep,
      currentStepComponent
    }
  }
}
</script>

<style scoped>
.decision-maker {
  padding: 2rem 0;
}
</style>
