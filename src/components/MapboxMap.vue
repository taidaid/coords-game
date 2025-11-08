<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, onUnmounted, ref, watch, type PropType } from 'vue'
import { isWinnerByDistance } from '@/utils/game'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string

const props = defineProps({
  locationToGuess: {
    type: Object as PropType<{ lng: number; lat: number }>,
    required: true,
  },
  clickCount: {
    type: Number,
    required: true,
  },
  initialLocation: {
    type: Object as PropType<{ center: { lng: number; lat: number }; zoom: number }>,
    required: true,
  },
  isReset: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits([
  'update:clickCount',
  'update:difference',
  'update:lastClickCoords',
  'update:isReset',
  'update:isWinner',
])

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<mapboxgl.Map | null>(null)
const markers = ref<mapboxgl.Marker[]>([])

onMounted(() => {
  // instantiate the map using the center and zoom from the modelValue prop
  const map = new mapboxgl.Map({
    container: mapContainer.value as HTMLElement,
    style: 'mapbox://styles/mapbox/standard',
    center: props.initialLocation.center,
    zoom: props.initialLocation.zoom,
  })

  // add a circle around the initial center when the style loads
  map.on('load', () => {
    map.on('click', (e) => {
      emits('update:lastClickCoords', { lng: e.lngLat.lng, lat: e.lngLat.lat })
      // compute next click count and emit update (do not mutate prop directly)
      const nextCount = props.clickCount + 1
      emits('update:clickCount', nextCount)

      // calculate difference between generated coords and clicked coords
      const difference = {
        lng: props.locationToGuess.lng - e.lngLat.lng,
        lat: props.locationToGuess.lat - e.lngLat.lat,
      }
      emits('update:difference', difference)

      // if the clicked point is a winner, use a golden marker
      const isWinner = isWinnerByDistance(props.locationToGuess, { lng: e.lngLat.lng, lat: e.lngLat.lat })
      emits('update:isWinner', isWinner)
      const markerColor = isWinner ? 'gold' : 'red'
      const marker = new mapboxgl.Marker({
        color: markerColor, // set marker color
        scale: isWinner ? 1.5 : 1, // scale the marker size
      })
      marker.setLngLat([e.lngLat.lng, e.lngLat.lat]).addTo(map)

      // @ts-expect-error - mapbox-gl types can trigger deep instantiation issues in TS
      markers.value.push(marker)
    })
    mapInstance.value = map as mapboxgl.Map
  })

  // assign the map instance reference
})
const removeAllClickedPoints = () => {
  for (const marker of markers.value) {
    marker.remove()
  }
  markers.value = []
}
watch(
  () => props.isReset,
  (isReset: boolean) => {
    if (isReset) {
      mapInstance.value?.setCenter(props.initialLocation.center)
      mapInstance.value?.setZoom(props.initialLocation.zoom)
      removeAllClickedPoints()
      emits('update:isReset', false)
    }
  },
)

onUnmounted(() => {
  // clean up the map instance when the component is unmounted
  mapInstance.value?.remove()
  mapInstance.value = null
})
</script>

<style>
/* make the map container fill its parent */
.map-container {
  width: 100%;
  height: 100%;
}
</style>
