<template>
  <div class="relative rounded-xl flex-shrink-0 select-none flex flex-col items-center justify-center font-bold"
    :class="[sizes[size], isBlack ? 'bg-zinc-900 border-2 border-amber-500/60 text-amber-400' : 'bg-white text-rose-600 border border-zinc-200']">

    <span class="absolute top-0.5 left-1 leading-none" :class="rankSizes[size]">{{ card.rank }}</span>
    <span :class="suitSizes[size]">{{ card.suit }}</span>
    <span class="absolute bottom-0.5 right-1 leading-none rotate-180" :class="rankSizes[size]">{{ card.rank }}</span>

    <!-- red suit override to black for ♠♣ -->
    <template v-if="!isBlack && (card.suit === '♠' || card.suit === '♣')">
      <!-- these won't appear since we only use ♥♦ for red -->
    </template>

    <div v-if="slotNum !== undefined"
      class="absolute bottom-0 left-0 right-0 text-center rounded-b-xl text-white leading-none"
      :class="[labelSizes[size], isBlack ? 'bg-amber-900/80' : 'bg-rose-600/80']">
      #{{ slotNum }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface NightCard { id: string; label: string; isBlack: boolean; suit: string; rank: string }

const props = defineProps<{
  card: NightCard
  size?: 'xs' | 'sm' | 'md' | 'lg'
  slotNum?: number
}>()

const isBlack = computed(() => props.card.isBlack)

const sizes = { xs: 'w-8 h-11', sm: 'w-11 h-15', md: 'w-14 h-20', lg: 'w-16 h-22' }
const rankSizes = { xs: 'text-[7px]', sm: 'text-[9px]', md: 'text-xs', lg: 'text-sm' }
const suitSizes = { xs: 'text-xs', sm: 'text-base', md: 'text-xl', lg: 'text-2xl' }
const labelSizes = { xs: 'text-[6px] py-0.5', sm: 'text-[7px] py-0.5', md: 'text-[8px] py-1', lg: 'text-[9px] py-1' }
</script>
