<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";

withDefaults(defineProps<{ panel?: boolean }>(), { panel: false });

const id = "header-lens-" + useId().replace(/:/g, "");
const surface = ref<HTMLElement>();
const map = ref("");
const width = ref(1);
const height = ref(1);
const refracts = ref(false);
const filterStyle = computed(() => refracts.value && map.value
  ? { backdropFilter: `url(#${id}) blur(2px) saturate(1.25)` }
  : {});
let observer: ResizeObserver | undefined;
let frame = 0;

// A size-matched rounded-rectangle displacement map bends only the glass rim.
// The neutral center leaves the page recognizable; navigation is on a separate layer.
function updateMap() {
  if (!surface.value) return;
  // Layout dimensions remain stable while the menu scales during its transition.
  width.value = Math.max(1, surface.value.offsetWidth);
  height.value = Math.max(1, surface.value.offsetHeight);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width.value / 2);
  canvas.height = Math.ceil(height.value / 2);
  const context = canvas.getContext("2d");
  if (!context) return;
  const pixels = context.createImageData(canvas.width, canvas.height);
  const radius = parseFloat(getComputedStyle(surface.value).borderTopLeftRadius) || 22;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = (x + .5) * width.value / canvas.width - width.value / 2;
      const py = (y + .5) * height.value / canvas.height - height.value / 2;
      const qx = Math.abs(px) - (width.value / 2 - radius);
      const qy = Math.abs(py) - (height.value / 2 - radius);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const length = Math.hypot(ox, oy);
      const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
      const rim = Math.pow(Math.max(0, 1 - Math.max(0, -distance) / 20), 2);
      const nx = length ? ox / length : qx > qy ? 1 : 0;
      const ny = length ? oy / length : qy >= qx ? 1 : 0;
      const offset = (y * canvas.width + x) * 4;
      pixels.data[offset] = 128 + Math.sign(px) * nx * rim * 120;
      pixels.data[offset + 1] = 128 + Math.sign(py) * ny * rim * 120;
      pixels.data[offset + 2] = 128;
      pixels.data[offset + 3] = 255;
    }
  }
  context.putImageData(pixels, 0, 0);
  map.value = canvas.toDataURL();
}
onMounted(() => {
  // SVG backdrop displacement is not interoperable: keep CSS glass elsewhere.
  refracts.value = /Chrome|Chromium|Edg\//.test(navigator.userAgent)
    && CSS.supports("backdrop-filter", `url(#${id})`);
  if (!refracts.value) return;
  updateMap();
  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(updateMap);
  });
  if (surface.value) observer.observe(surface.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="header-glass" :class="{ 'panel-glass': panel }" ref="surface" aria-hidden="true">
    <svg class="glass-filter-definitions" width="0" height="0" focusable="false">
      <defs>
        <filter :id="id" filterUnits="userSpaceOnUse" x="0" y="0"
          :width="width" :height="height" color-interpolation-filters="sRGB">
          <feImage :href="map || undefined" x="0" y="0" :width="width" :height="height"
            preserveAspectRatio="none" result="rim" />
          <feDisplacementMap in="SourceGraphic" in2="rim" scale="18"
            xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div class="glass-refraction" :style="filterStyle"></div>
    <div class="glass-highlight"></div>
  </div>
</template>

<style>
.site-header {
  background: transparent;
  border-bottom-color: transparent;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
.site-header .header-inner { position: relative; z-index: 1; }
.header-glass {
  position: absolute;
  inset: 6px 12px;
  border-radius: 22px;
  pointer-events: none;
  box-shadow: 0 7px 24px rgb(33 28 47 / 7%), 0 1px 3px rgb(33 28 47 / 5%);
}
.glass-filter-definitions { position: absolute; }
.glass-refraction, .glass-highlight {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.glass-refraction { background: #f8f7fc; }
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-refraction {
    background: rgb(248 247 252 / 52%);
    -webkit-backdrop-filter: blur(12px) saturate(140%);
    backdrop-filter: blur(12px) saturate(140%);
  }
}
.glass-highlight {
  border: 1px solid rgb(255 255 255 / 70%);
  background:
    linear-gradient(120deg, rgb(255 255 255 / 40%), transparent 25%, transparent 70%, rgb(255 255 255 / 20%)),
    linear-gradient(180deg, rgb(255 255 255 / 28%), transparent 38%, rgb(109 61 245 / 3%));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 95%),
    inset 0 -1px 0 rgb(255 255 255 / 55%),
    inset 1px 0 0 rgb(255 255 255 / 65%),
    inset -1px 0 0 rgb(255 255 255 / 35%);
}
.site-header .mobile-nav {
  z-index: 2;
  margin: 4px 12px 0;
  border: 1px solid transparent;
  border-radius: 18px;
  background: transparent;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
.site-header .mobile-nav > .panel-glass {
  inset: 0;
  border-radius: inherit;
}
.site-header .mobile-nav > a {
  position: relative;
  z-index: 1;
}
@media (max-width: 600px) {
  .header-glass { inset: 5px 8px; }
  .site-header .mobile-nav { margin-inline: 8px; }
}
@media (prefers-reduced-transparency: reduce), (forced-colors: active) {
  .glass-refraction {
    background: Canvas;
    -webkit-backdrop-filter: none !important;
    backdrop-filter: none !important;
  }
  .glass-highlight { background: none; border-color: ButtonBorder; }
  .site-header .mobile-nav { background: Canvas; }
}
</style>
