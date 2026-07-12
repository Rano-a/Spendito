<script setup lang="ts">
import { PartyPopper } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center gap-2 text-good text-sm font-medium mt-2 animate-bounce">
    <PartyPopper :size="16" />
    Goal reached, nice work!
  </div>
</template>
