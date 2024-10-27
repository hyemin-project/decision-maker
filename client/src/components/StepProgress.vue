<template>
  <div class="progress step-progress">
    <div 
      v-for="step in totalSteps" 
      :key="step" 
      class="progress-bar step" 
      :class="{ active: step <= currentStep, completed: step < currentStep }"
      :style="{ width: 100 / totalSteps + '%' }"
    >
      {{ step }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepProgress',
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  },
  setup() {
    const totalSteps = 6 

    return {
      totalSteps
    }
  }
}
</script>

<style scoped lang="scss">
.step-progress {
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  height: 30px;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  position: relative;
  background-color: #e0e0e0;
  color: #fff;

  &.active, &.completed {
    background-color: #4caf50;
  }

  &.completed {
    background-color: #4caf50;
  }
}
</style>
