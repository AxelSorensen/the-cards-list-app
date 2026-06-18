<template>
  <div
    class="relative bg-white rounded-md font-bold select-none flex-shrink-0 flex flex-col items-center justify-center transition-transform"
    :class="[sizeClasses, colorClass, { 'opacity-25': dimmed, 'cursor-pointer hover:-translate-y-1': clickable }]"
  >
    <span class="absolute top-0.5 left-1 leading-none" :class="rankSize">{{ card.rank }}</span>
    <span :class="suitSize">{{ card.suit }}</span>
    <span class="absolute bottom-0.5 right-1 leading-none rotate-180" :class="rankSize">{{ card.rank }}</span>
    <span v-if="label"
      class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center rounded-b-md leading-tight overflow-hidden text-ellipsis whitespace-nowrap px-0.5"
      :class="labelSize">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '~/composables/useNight'

const props = defineProps<{
  card: Card
  size?: 'xs' | 'sm' | 'md'
  label?: string | null
  dimmed?: boolean
  clickable?: boolean
}>()

const sz = computed(() => props.size ?? 'sm')
const sizeClasses = computed(() => ({ xs: 'w-8 h-11', sm: 'w-10 h-14', md: 'w-14 h-20' }[sz.value]))
const rankSize = computed(() => ({ xs: 'text-[7px]', sm: 'text-[9px]', md: 'text-xs' }[sz.value]))
const suitSize = computed(() => ({ xs: 'text-xs', sm: 'text-sm', md: 'text-xl' }[sz.value]))
const labelSize = computed(() => ({ xs: 'text-[6px]', sm: 'text-[7px]', md: 'text-[9px]' }[sz.value]))
const colorClass = computed(() => props.card.color === 'red' ? 'text-rose-600' : 'text-zinc-900')
</script>
