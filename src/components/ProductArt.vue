<script setup lang="ts">
defineProps<{ kind: string; variant?: number }>()
</script>
<template>
  <div class="product-art" :class="[kind, `variant-${variant ?? 0}`]" aria-hidden="true">
    <div class="product-shadow"></div>
    <div class="object"><i class="part-one"></i><i class="part-two"></i><i class="part-three"></i><i class="part-four"></i></div>
  </div>
</template>
