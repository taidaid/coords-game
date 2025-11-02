<template>
  <div id="coords-generator">
    <h1>Coords Generator</h1>
    <button @click="generateCoords">Generate Coords</button>
    <p>Longitude: {{ modelValue?.lng.toFixed(4) }}</p>
    <p>Latitude: {{ modelValue?.lat.toFixed(4) }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<{ lng: number, lat: number }>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  name: 'CoordsGenerator',

  methods: {
    generateCoords() {
      const randomLng = Math.random() * 360 - 180;
      const randomLat = Math.random() * 180 - 90;
      this.$emit('update:modelValue', { lng: randomLng, lat: randomLat })
    },
  },
})
</script>

<style>
#coords-generator {
  position: absolute;
  top: 0;
  right: 0;
  margin: 12px;
  z-index: 1;
  color: #fff;
  background-color: rgb(35 55 75 / 90%);
  padding: 6px 12px;
  font-family: monospace;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgb(35 55 75 / 100%);
  }
}
</style>