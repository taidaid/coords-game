<template>
  <div id="sidebar">
    <h2 id="last-click-coords-heading">Last Click Coords</h2>
    <br />
    Longitude: {{ lastClickCoords.lng?.toFixed(4) }}
    <br />
    Latitude: {{ lastClickCoords.lat?.toFixed(4) }}
    <br />
    <hr />
    <div>
      <div><strong>Difference:</strong></div>
      <div>&nbsp;&nbsp;Longitude: {{ difference?.lng.toFixed(4) }}</div>
      <div>&nbsp;&nbsp;Latitude: {{ difference?.lat.toFixed(4) }}</div>
    </div>
    <br />
    <div>
      <div>Attempts: {{ clickCount }}</div>
      <button id="reset-button" @click="reset">Reset</button>
    </div>
  </div>
  <div
    v-if="difference && Math.abs(difference.lng) < 5 && Math.abs(difference.lat) < 5"
    id="fireworks"
  >
    <div class="pyro">
      <div class="before"></div>
      <div class="after"></div>
    </div>
  </div>
  <CoordsGenerator v-model="locationToGuess" />
  <MapboxMap
    v-model:click-count="clickCount"
    v-model:difference="difference"
    :initialLocation
    :locationToGuess
    v-model:isReset="isReset"
    @update:lastClickCoords="lastClickCoords = $event"
  />
</template>

<script setup lang="ts">
import MapboxMap from '../components/MapboxMap.vue'
import CoordsGenerator from '../components/CoordsGenerator.vue'
import { ref } from 'vue'

const randomLongitude = () => Math.random() * 360 - 180
const randomLatitude = () => Math.random() * 180 - 90

const initialLocation = ref({
  center: { lng: randomLongitude(), lat: randomLatitude() },
  zoom: 2,
})

const locationToGuess = ref({
  lng: randomLongitude(),
  lat: randomLatitude(),
})

const lastClickCoords = ref({
  lng: null as number | null,
  lat: null as number | null,
})

const clickCount = ref(0)
const difference = ref<{ lng: number; lat: number } | null>(null)
const isReset = ref(false)
const reset = () => {
  isReset.value = true
  locationToGuess.value = {
    lng: randomLongitude(),
    lat: randomLatitude(),
  }

  initialLocation.value = {
    center: { lng: randomLongitude(), lat: randomLatitude() },
    zoom: 2,
  }
  difference.value = null
  clickCount.value = 0
}
</script>

<style lang="scss">
@use 'sass:math';

#sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  border-radius: 4px;
}
#last-click-coords-heading {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 0;
}
#reset-button {
  margin-top: 1rem;
}

/**
 * Fireworks animation
 * https://codepen.io/hmaw/pen/qBEMLxV
 */

#fireworks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

$particles: 50;
$width: 500;
$height: 500;

// Create the explosion...
$box-shadow: ();
$box-shadow2: ();
@for $i from 0 through $particles {
  $box-shadow:
    $box-shadow,
    math.random($width) - calc($width / 2) +
      px
      math.random($height) - calc($height / 1.2) +
      px
      hsl(math.random(360), 100%, 50%);
  $box-shadow2:
    $box-shadow2,
    0 0 #fff;
}
@mixin keyframes($animationName) {
  @-webkit-keyframes #{$animationName} {
    @content;
  }

  @-moz-keyframes #{$animationName} {
    @content;
  }

  @-o-keyframes #{$animationName} {
    @content;
  }

  @-ms-keyframes #{$animationName} {
    @content;
  }

  @keyframes #{$animationName} {
    @content;
  }
}

@mixin animation-delay($settings) {
  -moz-animation-delay: $settings;
  -webkit-animation-delay: $settings;
  -o-animation-delay: $settings;
  -ms-animation-delay: $settings;
  animation-delay: $settings;
}

@mixin animation-duration($settings) {
  -moz-animation-duration: $settings;
  -webkit-animation-duration: $settings;
  -o-animation-duration: $settings;
  -ms-animation-duration: $settings;
  animation-duration: $settings;
}

@mixin animation($settings) {
  -moz-animation: $settings;
  -webkit-animation: $settings;
  -o-animation: $settings;
  -ms-animation: $settings;
  animation: $settings;
}

@mixin transform($settings) {
  transform: $settings;
  -moz-transform: $settings;
  -webkit-transform: $settings;
  -o-transform: $settings;
  -ms-transform: $settings;
}

body {
  margin: 0;
  padding: 0;
  background: #000;
  overflow: hidden;
}

.pyro > .before,
.pyro > .after {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  box-shadow: $box-shadow2;
  @include animation(
    (
      1s bang ease-out infinite backwards,
      1s gravity ease-in infinite backwards,
      5s position linear infinite backwards
    )
  );
}

.pyro > .after {
  @include animation-delay((1.25s, 1.25s, 1.25s));
  @include animation-duration((1.25s, 1.25s, 6.25s));
}

@include keyframes(bang) {
  to {
    box-shadow: $box-shadow;
  }
}

@include keyframes(gravity) {
  to {
    @include transform(translateY(200px));
    opacity: 0;
  }
}

@include keyframes(position) {
  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }
  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }
  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }
  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }
  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}
</style>
