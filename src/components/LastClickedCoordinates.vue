<template>
  <div id="last-clicked-coordinates">
    <h3>Last Click</h3>
    <div>Longitude: {{ lastClickCoords.lng?.toFixed(4) }}</div>
    <div>Latitude: {{ lastClickCoords.lat?.toFixed(4) }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lastClickCoords: { lng: number | null; lat: number | null }
}>()
</script>
