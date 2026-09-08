<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, useId } from 'vue'
const props = withDefaults(defineProps<{ intro?: boolean }>(), { intro: false })
const id = useId().replace(/:/g, '')
const spread = ref(0)
const hovered = ref(false)
let frame = 0
let media: MediaQueryList | undefined
// Original contour paths from the supplied Figma SVG.
const left = 'M206 327.81C259.387 327.81 302.667 284.444 302.667 230.95C302.667 177.456 259.387 134.09 206 134.09C152.612 134.09 109.333 177.456 109.333 230.95C109.333 284.444 152.612 327.81 206 327.81Z'
const right = 'M306 377.91C359.387 377.91 402.667 334.544 402.667 281.05C402.667 227.556 359.387 184.19 306 184.19C252.612 184.19 209.333 227.556 209.333 281.05C209.333 334.544 252.612 377.91 306 377.91Z'
const lt = computed(() => `translate(${-spread.value} ${-spread.value * .5})`)
const rt = computed(() => `translate(${spread.value} ${spread.value * .5})`)
function animate(target: number, duration = 650) {
  cancelAnimationFrame(frame)
  if (media?.matches) { spread.value = 0; return }
  const from = spread.value
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    spread.value = from + (target - from) * (1 - Math.pow(1 - t, 3))
    if (t < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}
function setHover(value: boolean) { hovered.value = value; animate(value ? 17 : 0) }
function motionChanged() { animate(hovered.value ? 17 : 0) }
onMounted(() => {
  media = matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', motionChanged)
  if (props.intro && !media.matches) { spread.value = 65; animate(0, 1100) }
})
onBeforeUnmount(() => { cancelAnimationFrame(frame); media?.removeEventListener('change', motionChanged) })
</script>

<template>
  <svg class="brand-mark" viewBox="65 90 382 325" fill="none" aria-hidden="true" @pointerenter="setHover(true)" @pointerleave="setHover(false)">
    <defs>
      <clipPath :id="`${id}-left`"><path :d="left" :transform="lt" /></clipPath>
      <!-- Subtract the purple stroke to keep tint strictly inside its inner edge. -->
      <mask :id="`${id}-left-interior`" maskUnits="userSpaceOnUse" x="-100" y="-100" width="712" height="712" style="mask-type: luminance">
        <path :d="left" :transform="lt" fill="white" stroke="black" stroke-width="26" />
      </mask>
    </defs>
    <path :opacity="Math.max(0, 1 - spread / 8)" d="M297.728 179.391C302.322 192.046 304.727 205.656 304.504 219.806C303.664 273.194 265.763 317.74 214.408 331.747C209.815 319.092 207.412 305.483 207.635 291.334C208.475 237.948 246.374 193.398 297.728 179.391Z" fill="#20C7A5" />
    <g :opacity="Math.min(1, spread / 8)" :clip-path="`url(#${id}-left)`"><path :d="right" :transform="rt" fill="#20C7A5" /></g>

    <path :opacity="Math.max(0, 1 - spread / 8)" d="M270.114 176.728C282.519 191.367 290 210.309 290 231C290 277.392 252.392 315 206 315C204.456 315 202.923 314.956 201.399 314.874C197.895 304.128 196 292.654 196 280.738C196 232.553 226.984 191.606 270.114 176.728Z" fill="#20C7A5" fill-opacity="0.6" />
    <!-- Keep the purple contour un-tinted at every animation position. -->
    <path :d="left" :transform="lt" stroke="#6D3DF5" stroke-width="26" />
    <!-- Keep the dark contour above the lens, then tint only its portion inside the purple circle. -->
    <path :d="right" :transform="rt" stroke="#211C2F" stroke-width="26" />
    <g :mask="`url(#${id}-left-interior)`">
      <path :d="right" :transform="rt" stroke="#20C7A5" stroke-width="26" opacity=".6" />
    </g>
  </svg>
</template>

