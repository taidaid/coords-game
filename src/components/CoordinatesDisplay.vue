<template>
  <div id="coordinates">
    <h2>Coordinates</h2>
    <div>Longitude: {{ modelValue?.lng.toFixed(4) }}</div>
    <div>Latitude: {{ modelValue?.lat.toFixed(4) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<{ lng: number; lat: number }>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  name: 'CoordinatesDisplay',

  methods: {
    generateCoords() {
      const randomLng = Math.random() * 360 - 180
      const randomLat = Math.random() * 180 - 90
      this.$emit('update:modelValue', { lng: randomLng, lat: randomLat })
    },
  },
})
</script>
