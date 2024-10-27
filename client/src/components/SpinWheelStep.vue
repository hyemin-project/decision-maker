<template>
  <div class="container spin-wheel-step">
    <div class="row justify-content-center">
      <div class="col-12 text-center">
        <h2>Spin the Wheel</h2>
      </div>
      <div class="col-12 d-flex justify-content-center">
        <div class="wheel-container position-relative">
          <canvas ref="wheelCanvas" width="400" height="400"></canvas>
          <div class="wheel-arrow"></div>
        </div>
      </div>
      <div class="col-12 text-center">
        <button class="btn btn-primary mt-3" @click="spinWheel" :disabled="isSpinning">
          {{ isSpinning ? 'Spinning...' : 'Spin' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SpinWheelStep',
  setup() {
    const store = useStore()
    const wheelCanvas = ref(null)
    const isSpinning = ref(false)
    const rotation = ref(0)
    const choices = computed(() => store.state.choices)
    const customization = computed(() => store.state.wheelCustomization)

    const drawWheel = () => {
      const canvas = wheelCanvas.value
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation.value)

      const totalChoices = choices.value.length
      const anglePerChoice = (2 * Math.PI) / totalChoices

      choices.value.forEach((choice, index) => {
        const startAngle = index * anglePerChoice
        const endAngle = (index + 1) * anglePerChoice

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.closePath()

        const color = customization.value.colors?.[index] || `hsl(${(index * 360) / totalChoices}, 70%, 50%)`
        ctx.fillStyle = color
        ctx.fill()

        ctx.save()
        ctx.rotate(startAngle + anglePerChoice / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = 'white'
        ctx.font = '14px Arial'
        ctx.fillText(choice, radius - 10, 5)
        ctx.restore()
      })

      ctx.restore()
    }

    const spinWheel = () => {
      if (isSpinning.value) return

      isSpinning.value = true
      const totalRotation = 2 * Math.PI * (5 + Math.random()) // 5-6 full rotations
      const duration = 5000 // 5 seconds
      const start = performance.now()

      const animate = (time) => {
        const elapsed = time - start
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 4) // Ease out quartic

        rotation.value = totalRotation * easeProgress

        drawWheel()

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          const finalAngle = rotation.value % (2 * Math.PI)
          const choiceIndex = Math.floor(finalAngle / (2 * Math.PI / choices.value.length))
          const result = choices.value[choiceIndex]
          store.commit('setResult', result)
          store.commit('setCurrentStep', 6) 
          isSpinning.value = false
        }
      }

      requestAnimationFrame(animate)
    }

    onMounted(() => {
      drawWheel()
    })

    watch([choices, customization], () => {
      drawWheel()
    })

    return {
      wheelCanvas,
      isSpinning,
      spinWheel
    }
  }
}
</script>

<style lang="scss" scoped>
.spin-wheel-step {
  padding: 2rem;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .wheel-container {
    position: relative;
    width: 400px;
    height: 400px;
    margin: 0 auto;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .wheel-arrow {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 40px solid #333;
    transform: translateX(-50%);
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
