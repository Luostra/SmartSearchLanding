<script setup lang="ts">
import { useId } from "vue";
withDefaults(defineProps<{ animated?: boolean }>(), { animated: false });
const cutoutId = "brand-cutout-" + useId().replace(/:/g, "");
</script>

<template>
  <svg class="brand-mark" :class="{ 'brand-mark--animated': animated }" viewBox="51 68 376 376" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
<defs><mask :id="cutoutId" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512" style="mask-type:luminance"><rect width="512" height="512" fill="white"/><g class="brand-loupe"><path d="M271 289.333L322.667 344.333" stroke="black" stroke-width="68.8" stroke-linecap="round"/></g></mask></defs>
<path class="brand-purple" d="M149.123 288.834C84.1333 267.2 82.5333 188.8 120.933 137.6C143.333 105.6 178.533 88 213.733 88H392.933C392.933 145.6 327.973 180.363 264.18 163.271C247.216 158.726 229.33 158.921 212.47 163.835C195.609 168.75 180.42 178.195 168.555 191.143C156.69 204.092 148.604 220.047 145.178 237.271C141.752 254.496 143.116 272.331 149.123 288.834Z" fill="#6D3DF5"/>
<g :mask="`url(#${cutoutId})`"><path class="brand-mint" d="M329.544 223.166C394.533 244.8 396.133 323.2 357.733 374.4C335.333 406.4 300.133 424 264.933 424L85.7332 424C85.7332 366.4 150.693 331.637 214.487 348.729C231.45 353.274 249.336 353.079 266.197 348.165C283.057 343.25 298.247 333.805 310.112 320.857C321.977 307.908 330.062 291.953 333.489 274.729C336.915 257.504 335.55 239.669 329.544 223.166Z" fill="#20C7A5"/></g>
<g class="brand-loupe">
<path d="M239.333 312.667C270.629 312.667 296 287.296 296 256C296 224.704 270.629 199.333 239.333 199.333C208.037 199.333 182.667 224.704 182.667 256C182.667 287.296 208.037 312.667 239.333 312.667Z" fill="#211C2F"/>
<path d="M271 289.333L322.667 344.333" stroke="#211C2F" stroke-width="33.6" stroke-linecap="round"/>
</g>
  </svg>
</template>

<style>
/* The new upright symbol uses the source geometry on a transparent background. */
.hero-mark { width: 300px; height: 260px; top: 43%; transform: translate(-50%, -50%); }
@media (max-width: 600px) { .hero-mark { width: 240px; height: 210px; top: 44%; } }

.brand-mark--animated .brand-purple,
.brand-mark--animated .brand-mint,
.brand-mark--animated .brand-loupe {
  transform-box: view-box;
  transform-origin: 239.333px 256px;
  transition: transform 650ms cubic-bezier(.22, .8, .25, 1);
}
@media (hover: hover) and (pointer: fine) {
  .brand-mark--animated:hover .brand-purple { transform: translate(-4px, -8px); }
  .brand-mark--animated:hover .brand-mint { transform: translate(4px, 8px); }
  .brand-mark--animated:hover .brand-loupe {
    transform: translate(-5px, -6px) rotate(-8deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .brand-mark--animated .brand-purple,
  .brand-mark--animated .brand-mint,
  .brand-mark--animated .brand-loupe {
    transform: none !important;
    transition: none;
  }
}

</style>

