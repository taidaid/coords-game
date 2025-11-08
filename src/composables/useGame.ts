import { ref } from "vue";
import type { LngLat } from "@/utils/game";

type InitialLocation = {
  center: LngLat;
  zoom: number;
};

const randomLongitude = () => Math.random() * 360 - 180;
const randomLatitude = () => Math.random() * 180 - 90;

export function useGame() {
  const initialLocation = ref<InitialLocation>({
    center: { lng: randomLongitude(), lat: randomLatitude() },
    zoom: 2,
  });

  const locationToGuess = ref<LngLat>({
    lng: randomLongitude(),
    lat: randomLatitude(),
  });

  const lastClickCoords = ref<{ lng: number | null; lat: number | null }>({
    lng: null,
    lat: null,
  });

  const clickCount = ref(0);
  const difference = ref<LngLat | null>(null);
  const isReset = ref(false);
  const isWinner = ref(false);

  const reset = () => {
    isReset.value = true;
    locationToGuess.value = {
      lng: randomLongitude(),
      lat: randomLatitude(),
    };
    initialLocation.value = {
      center: { lng: randomLongitude(), lat: randomLatitude() },
      zoom: 2,
    };
    difference.value = null;
    clickCount.value = 0;
    isWinner.value = false;
  };

  return {
    // state
    initialLocation,
    locationToGuess,
    lastClickCoords,
    clickCount,
    difference,
    isReset,
    isWinner,
    // actions
    reset,
  };
}
