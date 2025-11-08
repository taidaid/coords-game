<template>
  <div>
    <h3><strong>Distance to target:</strong></h3>
    <div v-if="distanceMeters !== null || distanceMeters !== undefined">
      {{ formattedDistance }}
    </div>
    <div v-else>-</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LngLat } from '@/utils/game'
import { getDistanceMeters } from '@/utils/game'

const props = defineProps<{
  target: LngLat
  lastClickCoords: { lng: number | null; lat: number | null }
}>()

const distanceMeters = computed<number | null>(() => {
  const { lng, lat } = props.lastClickCoords
  if (lng == null || lat == null) return null
  return Math.round(getDistanceMeters(props.target, { lng, lat }))
})

const formattedDistance = computed(() => {
  if (distanceMeters.value === null) return '-'
  const meters = distanceMeters.value
  return meters >= 1000 ? `${(meters / 1000).toFixed(2)} km` : `${meters} m`
})
</script>
