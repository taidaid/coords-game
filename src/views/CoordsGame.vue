<template>
  <div id="sidebar">
    <CoordinatesDisplay v-model="locationToGuess" />
    <LastClickedCoordinates :lastClickCoords="lastClickCoords" />
    <DifferenceDisplay :target="locationToGuess" :lastClickCoords="lastClickCoords" />
    <br />
    <div>
      <div>Attempts: {{ clickCount }}</div>
      <button id="reset-button" @click="reset">Reset</button>
    </div>
  </div>
  <FireworksDisplay :isWinner="isWinner" />
  <MapboxMap
    v-model:click-count="clickCount"
    v-model:difference="difference"
    v-model:isWinner="isWinner"
    :initialLocation
    :locationToGuess
    v-model:isReset="isReset"
    @update:lastClickCoords="lastClickCoords = $event"
  />
</template>

<script setup lang="ts">
import MapboxMap from '../components/MapboxMap.vue'
import CoordinatesDisplay from '../components/CoordinatesDisplay.vue'
import FireworksDisplay from '../components/FireworksDisplay.vue'
import LastClickedCoordinates from '../components/LastClickedCoordinates.vue'
import DifferenceDisplay from '../components/DifferenceDisplay.vue'
import { useGame } from '@/composables/useGame'

const {
  initialLocation,
  locationToGuess,
  lastClickCoords,
  clickCount,
  difference,
  isReset,
  isWinner,
  reset,
} = useGame()
</script>

<style lang="scss">
#sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 1rem 1.5rem;
  font-family: monospace;
  z-index: 1;
  margin: 1rem;
  border-radius: 4px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 12rem;
}
#reset-button {
  margin-top: 1rem;
}
</style>
