<template>
  <div class="wheel-container">
    <canvas ref="wheelCanvas" width="500" height="500"></canvas>
    <button @click="spin" :disabled="isSpinning">Spin</button>
  </div>
</template>

<script>
export default {
  name: 'WheelOfFortune',
  props: {
    choices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isSpinning: false
    }
  },
  mounted() {
    this.drawWheel()
  },
  methods: {
    drawWheel() {
      const canvas = this.$refs.wheelCanvas
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 10

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const totalChoices = this.choices.length
      const arc = Math.PI * 2 / totalChoices

      for (let i = 0; i < totalChoices; i++) {
        ctx.beginPath()
        ctx.fillStyle = this.getColor(i)
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, i * arc, (i + 1) * arc)
        ctx.lineTo(centerX, centerY)
        ctx.fill()

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(i * arc + arc / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 18px Arial'
        ctx.fillText(this.choices[i], radius - 10, 0)
        ctx.restore()
      }
    },
    getColor(index) {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      return colors[index % colors.length]
    },
    spin() {
      if (this.isSpinning) return

      this.isSpinning = true
      const canvas = this.$refs.wheelCanvas
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      let currentRotation = 0
      const totalRotation = 360 * 5 + Math.random() * 360 // 5 full spins + random

      const spinWheel = () => {
        currentRotation += 10
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(currentRotation * Math.PI / 180)
        ctx.translate(-centerX, -centerY)
        this.drawWheel()
        ctx.restore()

        if (currentRotation < totalRotation) {
          requestAnimationFrame(spinWheel)
        } else {
          this.isSpinning = false
          const result = this.choices[Math.floor(Math.random() * this.choices.length)]
          this.$emit('spin-result', result)
        }
      }

      requestAnimationFrame(spinWheel)
    }
  }
}
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>