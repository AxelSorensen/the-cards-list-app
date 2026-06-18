<template>
  <div class="rounded-xl p-4 text-center border" :class="bg">
    <div class="text-3xl font-black" :class="textColor">{{ value }}</div>
    <div class="text-[10px] uppercase tracking-widest mt-1" :class="subColor">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; value: number | string; color: 'amber' | 'white' | 'green' | 'orange' }>()

const bg = computed(() => ({
  amber: 'bg-amber-950/30 border-amber-800/30',
  white: 'bg-zinc-800/60 border-zinc-700/40',
  green: 'bg-emerald-950/40 border-emerald-800/30',
  orange: 'bg-orange-950/40 border-orange-800/30',
}[props.color]))

const textColor = computed(() => ({
  amber: 'text-amber-400', white: 'text-zinc-100',
  green: 'text-emerald-400', orange: 'text-orange-400',
}[props.color]))

const subColor = computed(() => ({
  amber: 'text-amber-700', white: 'text-zinc-500',
  green: 'text-emerald-700', orange: 'text-orange-700',
}[props.color]))
</script>
