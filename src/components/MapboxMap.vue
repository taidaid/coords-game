<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { defineComponent, type PropType } from 'vue'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string

export default defineComponent({
  props: {
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
  },
  emits: ['update:clickCount', 'update:difference', 'update:lastClickCoords', 'update:isReset'],
  data() {
    return {
      map: null as mapboxgl.Map | null,
    }
  },

  mounted() {
    // instantiate the map using the center and zoom from the modelValue prop
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer as HTMLElement,
      style: 'mapbox://styles/mapbox/standard',
      center: this.initialLocation.center,
      zoom: this.initialLocation.zoom,
    })

    // add a circle around the initial center when the style loads
    const initialCenter = mapboxgl.LngLat.convert(this.initialLocation.center)
    map.on('load', () => {
      map.addSource('initial-center', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [initialCenter.lng, initialCenter.lat],
              },
              properties: {},
            },
          ],
        },
      })

      map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error, image) => {
        if (error) throw error

        // Add the image to the map style.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.addImage('cat', image as any)

        // Add a data source containing one point feature.
        map.addSource('initial-center-point', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [initialCenter.lng, initialCenter.lat],
                },
                properties: {
                  // icon: 'cat',
                },
              },
            ],
          },
        })

        map.on('click', (e) => {
          this.$emit('update:lastClickCoords', { lng: e.lngLat.lng, lat: e.lngLat.lat })
          // compute next click count and emit update (do not mutate prop directly)
          const nextCount = this.clickCount + 1
          this.$emit('update:clickCount', nextCount)

          // put cat where you clicked
          map.addSource(`clicked-point-${nextCount}`, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [e.lngLat.lng, e.lngLat.lat],
                  },
                  properties: {
                    icon: 'cat',
                  },
                },
              ],
            },
          })
          map.addLayer({
            id: `clicked-icon-${nextCount}`,
            type: 'symbol',
            source: `clicked-point-${nextCount}`,
            layout: {
              'icon-image': 'cat',
              'icon-size': 0.25,
            },
          })

          // calculate difference between generated coords and clicked coords
          const difference = {
            lng: this.locationToGuess.lng - e.lngLat.lng,
            lat: this.locationToGuess.lat - e.lngLat.lat,
          }
          this.$emit('update:difference', difference)
        })
      })
    })

    // assign the map instance to this component's map property
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - mapbox-gl types can trigger deep instantiation issues in TS
    this.map = map as mapboxgl.Map
  },
  methods: {
    removeAllClickedPoints() {
      const map = this.map
      if (map) {
        const style = map.getStyle()
        if (style && style.layers) {
          for (const layer of style.layers) {
            const id = layer.id
            if (id.startsWith('clicked-icon-') && map.getLayer(id)) {
              map.removeLayer(id)
            }
          }
        }
      }
    },
    removeAllClickedSources() {
      const map = this.map
      if (map) {
        const style = map.getStyle()
        if (style && style.sources) {
          for (const id of Object.keys(style.sources)) {
            if (id.startsWith('clicked-point-') && map.getSource(id)) {
              map.removeSource(id)
            }
          }
        }
      }
    },
  },
  watch: {
    isReset(isReset: boolean) {
      if (isReset) {
        this.map?.setCenter(this.initialLocation.center)
        this.map?.setZoom(this.initialLocation.zoom)
        this.removeAllClickedPoints()
        this.removeAllClickedSources()
      }
      this.$emit('update:isReset', false)
    },
  },
  // clean up the map instance when the component is unmounted
  unmounted() {
    this.map?.remove()
    this.map = null
  },
})
</script>

<style>
/* make the map container fill its parent */
.map-container {
  width: 100%;
  height: 100%;
}
</style>
