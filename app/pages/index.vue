<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col select-none">

    <!-- Header -->
    <div class="border-b border-zinc-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-2.5">
        <span class="text-lg">🎵</span>
        <span class="font-semibold text-zinc-300 tracking-wide text-sm">The List</span>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="step > 0" @click="reset" class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600">↺ restart</button>
        <button @click="showHelp = true" class="w-6 h-6 rounded-full border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors text-xs font-bold flex items-center justify-center">?</button>
      </div>
    </div>

    <!-- Help screen (full screen overlay) -->
    <div v-if="showHelp" class="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
      <div class="border-b border-zinc-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <span class="font-semibold text-zinc-300 tracking-wide text-sm">How it works</span>
        <button @click="showHelp = false" class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600">✕ close</button>
      </div>
      <div class="flex-1 overflow-y-auto px-5 py-6">
        <ol class="space-y-5 text-sm text-zinc-300">
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">1</span>
            <div class="pt-0.5"><span class="font-semibold text-zinc-100">Count people.</span> Enter how many non-host players are attending. 13 spots are available — anyone beyond 13 gets a surplus black card.</div>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">2</span>
            <div class="pt-0.5"><span class="font-semibold text-zinc-100">Volunteers.</span> If there are surplus players, some can volunteer for an early slot in exchange for only 1 song instead of 2. They get a black surplus card (Joker, ♠2, ♠3…).</div>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">3</span>
            <div class="pt-0.5"><span class="font-semibold text-zinc-100">Deal the deck.</span> A red deck (♥2–A) is shuffled and dealt to all remaining players. Any leftover surplus black cards are dealt too — whoever draws a black card shares a slot with the red card of the same rank.</div>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">4</span>
            <div class="pt-0.5"><span class="font-semibold text-zinc-100">Simulate swaps.</span> Optionally run a random swap animation — players may trade cards with each other to shuffle up the order.</div>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">5</span>
            <div class="pt-0.5"><span class="font-semibold text-zinc-100">The final list.</span> Order is always Joker → 2 → 3 → … → A. The host holds the red Joker and always plays slot 1. If someone holds the black Joker, they share slot 1 with the host — both get 1 song. The night splits into two sets of 7 with a break in between.</div>
          </li>
        </ol>
        <div class="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-zinc-400 space-y-1.5">
          <p class="text-zinc-200 font-semibold">Shared slots</p>
          <p>A black ♠X card shares a slot with the red ♥X of the same rank. Both players play 1 song instead of 2.</p>
        </div>
      </div>
    </div>

    <!-- Step indicator -->
    <div class="flex gap-1 px-5 pt-3 pb-0 flex-shrink-0">
      <div v-for="i in 6" :key="i" class="flex-1 h-0.5 rounded-full transition-all duration-300"
        :class="i - 1 <= step ? 'bg-zinc-300' : 'bg-zinc-800'"></div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto px-4 pt-6 pb-32">
      <div class="max-w-md mx-auto">

        <!-- ══ STEP 0: Count ══ -->
        <div v-if="step === 0" class="space-y-6">
          <div>
            <h1 class="text-2xl font-bold">How many players tonight?</h1>
            <p class="text-zinc-500 text-sm mt-1">Not counting the host</p>
          </div>

          <div class="flex items-center justify-center gap-6 py-2">
            <button @click="numPlayers = Math.max(1, numPlayers - 1)"
              class="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-2xl font-bold transition-all flex items-center justify-center">−</button>
            <span class="text-7xl font-black tabular-nums w-24 text-center">{{ numPlayers }}</span>
            <button @click="numPlayers++"
              class="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-2xl font-bold transition-all flex items-center justify-center">+</button>
          </div>

          <div>
            <p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">What you need on the table</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3">
                <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Red deck</p>
                <div class="relative flex-shrink-0" style="height:76px;width:66px">
                  <div v-for="i in 7" :key="i" class="absolute bg-white border border-zinc-300 rounded-lg shadow-sm"
                    :style="{ width:'44px', height:'62px', bottom:`${(i-1)*2}px`, left:`${(i-1)*2}px`, zIndex:i }">
                    <span class="absolute top-1 left-1 text-rose-500 text-[8px] font-bold leading-none">{{ RED_RANKS[i-1] }}</span>
                    <div class="absolute inset-0 flex items-center justify-center text-rose-500 text-lg">♥</div>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-black">13 cards</div>
                  <div class="text-[10px] text-zinc-500 mt-0.5">♥2 through ♥A</div>
                </div>
              </div>
              <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center gap-3">
                <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Black deck</p>
                <div class="relative flex-shrink-0" style="height:76px;width:66px">
                  <div v-for="i in 7" :key="i" class="absolute bg-zinc-800 border border-zinc-600 rounded-lg shadow-sm"
                    :style="{ width:'44px', height:'62px', bottom:`${(i-1)*2}px`, left:`${(i-1)*2}px`, zIndex:i }">
                    <span class="absolute top-1 left-1 text-zinc-300 text-[8px] font-bold leading-none">{{ i === 7 ? 'J' : RED_RANKS[i-1] }}</span>
                    <div class="absolute inset-0 flex items-center justify-center text-zinc-300 text-lg">{{ i === 7 ? '🃏' : '♠' }}</div>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xl font-black">13 cards</div>
                  <div class="text-[10px] text-zinc-500 mt-0.5">Joker + ♠2 through ♠A</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800 text-sm overflow-hidden">
            <div class="px-4 py-3 flex justify-between items-center">
              <span class="text-zinc-500">Host card</span>
              <div class="bg-white border border-rose-300 rounded-lg px-2 py-0.5 text-rose-500 text-xs font-bold">🃏 Red Joker</div>
            </div>
            <div class="px-4 py-3 flex justify-between">
              <span class="text-zinc-500">Red cards needed</span>
              <span class="font-medium">{{ Math.min(numPlayers, NON_HOST_SPOTS) }}</span>
            </div>
            <div class="px-4 py-3 flex justify-between items-start">
              <span class="text-zinc-500">Black surplus cards</span>
              <span class="font-medium text-right" :class="surplus > 0 ? 'text-zinc-200' : 'text-zinc-600'">
                {{ surplus > 0 ? surplusCards.map(c => c.label).join(', ') : 'none' }}
              </span>
            </div>
          </div>
        </div>

        <!-- ══ STEP 1: Cards setup ══ -->
        <div v-if="step === 1" class="space-y-6">
          <div>
            <h1 class="text-2xl font-bold">Set up the cards</h1>
            <p class="text-zinc-500 text-sm mt-1">
              {{ surplus > 0 ? `Take ${surplus} card${surplus > 1 ? 's' : ''} from the top of the black deck.` : 'Everyone gets a red card — no surplus needed.' }}
            </p>
          </div>

          <div class="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
            <div class="relative bg-white border-2 border-rose-400 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style="width:44px;height:62px">
              <span class="text-[8px] absolute top-1 left-1 leading-none text-rose-400 font-bold">JKR</span>
              <span class="text-rose-500 text-xl">🃏</span>
              <span class="text-[8px] absolute bottom-1 right-1 leading-none rotate-180 text-rose-400 font-bold">JKR</span>
            </div>
            <div>
              <div class="text-sm font-semibold">Host holds the red Joker</div>
              <div class="text-xs text-zinc-500 mt-0.5">Fixed — not drawn from either deck</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-2">
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Red deck</p>
              <div class="relative flex-shrink-0" style="height:80px;width:66px">
                <div v-for="i in 7" :key="i" class="absolute bg-white border border-zinc-300 rounded-lg"
                  :style="{ width:'46px', height:'64px', bottom:`${(i-1)*2}px`, left:`${(i-1)*2}px`, zIndex:i }">
                  <span class="absolute top-1 left-1 text-rose-500 text-[8px] font-bold">{{ RED_RANKS[i-1] }}</span>
                  <div class="absolute inset-0 flex items-center justify-center text-rose-500 text-xl">♥</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-black">{{ NON_HOST_SPOTS }}</div>
                <div class="text-[10px] text-zinc-500">♥2 – ♥A · 2 songs</div>
              </div>
            </div>
            <div class="bg-zinc-900 rounded-2xl p-3 flex flex-col items-center gap-2 transition-all"
              :class="surplus > 0 ? 'border-2 border-zinc-500' : 'border border-zinc-800 opacity-40'">
              <p class="text-[10px] text-zinc-400 uppercase tracking-widest">
                {{ surplus > 0 ? `Black deck — take ${surplus}` : 'Black deck' }}
              </p>
              <div class="relative flex-shrink-0" style="height:80px;width:66px">
                <div v-for="i in 7" :key="i"
                  class="absolute rounded-lg transition-colors"
                  :class="surplus > 0 && (8 - i) <= surplus ? 'bg-zinc-800 border-2 border-zinc-300' : 'bg-zinc-800 border border-zinc-600'"
                  :style="{ width:'46px', height:'64px', bottom:`${(i-1)*2}px`, left:`${(i-1)*2}px`, zIndex:i }">
                  <span class="absolute top-1 left-1 text-[8px] font-bold leading-none text-zinc-300">{{ i === 7 ? 'J' : RED_RANKS[i-1] }}</span>
                  <div class="absolute inset-0 flex items-center justify-center text-lg text-zinc-300">{{ i === 7 ? '🃏' : '♠' }}</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-lg font-black">{{ surplus > 0 ? surplus : '—' }}</div>
                <div class="text-[10px] text-zinc-500">{{ surplus > 0 ? '1 song (shared)' : 'set aside' }}</div>
              </div>
            </div>
          </div>

          <div v-if="surplus > 0" class="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 space-y-2">
            <p class="text-xs font-semibold text-zinc-200">Take the {{ surplus }} lowest from the black deck:</p>
            <div class="flex flex-wrap gap-1.5">
              <div v-for="c in surplusCards" :key="c.id"
                class="bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-xs text-zinc-300 font-medium flex items-center gap-1">
                <span>{{ c.suit }}</span><span>{{ c.label }}</span>
              </div>
            </div>
            <p class="text-[11px] text-zinc-600">Each shares a slot with the red card next to it — 2 people, 1 song each.</p>
          </div>
        </div>

        <!-- ══ STEP 2: Volunteers ══ -->
        <div v-if="step === 2" class="space-y-5">
          <div>
            <h1 class="text-2xl font-bold">Any volunteers?</h1>
            <p class="text-zinc-500 text-sm mt-1">"Who only wants to play 1 song, or wants an earlier slot at the cost of only playing 1?"</p>
          </div>

          <div v-if="surplus === 0" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-500 text-center">
            No surplus — everyone plays 2 songs. Skip ahead.
          </div>

          <template v-else>
            <!-- Count picker — only shown before dealing -->
            <div v-if="!volDealt" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <p class="text-sm text-zinc-400">How many volunteered?</p>
              <div class="flex items-center justify-center gap-6">
                <button @click="setVolunteerCount(volunteerCount - 1)"
                  class="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-2xl font-bold transition-all flex items-center justify-center">−</button>
                <div class="text-center w-20">
                  <div class="text-5xl font-black tabular-nums" :class="volunteerCount > 0 ? 'text-zinc-100' : 'text-zinc-600'">{{ volunteerCount }}</div>
                  <div class="text-xs text-zinc-600 mt-1">of {{ surplus }}</div>
                </div>
                <button @click="setVolunteerCount(volunteerCount + 1)"
                  class="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-2xl font-bold transition-all flex items-center justify-center">+</button>
              </div>
            </div>

            <!-- Deal out button -->
            <button v-if="!volDealt && volunteerCount > 0" @click="dealToVolunteers"
              class="w-full bg-zinc-200 hover:bg-white text-zinc-900 font-bold py-4 rounded-2xl transition-colors">
              🃏 Deal out to {{ volunteerCount }} volunteer{{ volunteerCount > 1 ? 's' : '' }}
            </button>

            <!-- Revealed assignments all at once -->
            <div v-if="volDealt" class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-[10px] text-zinc-600 uppercase tracking-widest">Dealt to volunteers:</p>
                <button @click="redealVolunteers" class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">↺ re-deal</button>
              </div>
              <div class="space-y-2">
                <div v-for="(va, i) in volunteerAssignments" :key="i"
                  class="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-zinc-200">{{ va.playerName }}</div>
                    <div class="text-xs text-orange-400">1 song · drew blind</div>
                  </div>
                  <span class="text-zinc-700">→</span>
                  <div class="relative flex flex-col items-center justify-center font-bold rounded-xl flex-shrink-0 bg-zinc-800 border border-zinc-600"
                    style="width:44px;height:62px">
                    <span class="text-[8px] absolute top-1 left-1 leading-none text-zinc-400">{{ va.card.rank }}</span>
                    <span class="text-xl leading-none text-zinc-300">{{ va.card.suit }}</span>
                    <span class="text-[7px] absolute bottom-1 right-1 leading-none rotate-180 text-zinc-400">{{ va.card.rank }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Remaining into deck -->
            <div v-if="volDealt && surplus - volunteerCount > 0"
              class="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center gap-2 flex-wrap">
              <span class="text-xs text-zinc-600">Rest go into the deck:</span>
              <div class="flex flex-wrap gap-1">
                <span v-for="c in surplusCards.slice(volunteerCount)" :key="c.id"
                  class="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-500 font-medium">{{ c.label }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- ══ STEP 3: Deal ══ -->
        <div v-if="step === 3" class="space-y-5">
          <div>
            <h1 class="text-2xl font-bold">{{ dealDone ? 'Cards dealt!' : 'Deal the cards' }}</h1>
            <p class="text-zinc-500 text-sm mt-1">{{ dealDone ? 'All assignments for tonight.' : 'Tap to deal and reveal the deck order.' }}</p>
          </div>

          <!-- Deal animation box -->
          <div class="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden" style="height:160px">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div class="relative" style="width:48px;height:68px">
                <template v-if="redStackRemaining > 0">
                  <div v-for="i in Math.min(redStackRemaining, 5)" :key="i"
                    class="absolute bg-white border border-zinc-200 rounded-lg"
                    :style="{ width:'44px', height:'62px', bottom:`${(i-1)*2}px`, left:`${(i-1)*1}px`, zIndex:i }">
                    <div class="absolute inset-0 flex items-center justify-center text-rose-400 text-lg">♥</div>
                  </div>
                </template>
                <div v-else class="w-[44px] h-[62px] border border-dashed border-zinc-800 rounded-lg flex items-center justify-center text-zinc-700 text-[9px]">done</div>
              </div>
              <span class="text-[9px] text-zinc-600">{{ redStackRemaining }}</span>
            </div>

            <div v-if="surplusStackRemaining > 0" class="absolute left-4 bottom-3 flex flex-col items-center gap-0.5">
              <div class="relative" style="width:36px;height:50px">
                <div v-for="i in Math.min(surplusStackRemaining, 3)" :key="i"
                  class="absolute bg-zinc-800 border border-zinc-600 rounded-md"
                  :style="{ width:'32px', height:'46px', bottom:`${(i-1)*2}px`, left:`${(i-1)*1}px`, zIndex:i }">
                  <div class="absolute inset-0 flex items-center justify-center text-zinc-300 text-sm">♠</div>
                </div>
              </div>
              <span class="text-[9px] text-zinc-600">{{ surplusStackRemaining }}</span>
            </div>

            <Transition name="fly">
              <div v-if="flyingCard" :key="flyingCard.id"
                class="absolute z-20 rounded-lg shadow-2xl font-bold flex flex-col items-center justify-center"
                :class="flyingCard.isBlack ? 'bg-zinc-800 border border-zinc-600' : 'bg-white border border-zinc-200'"
                style="width:44px;height:62px;top:50%;left:50%;transform:translate(-50%,-50%)">
                <span :class="flyingCard.isBlack ? 'text-zinc-200 text-xl' : 'text-rose-500 text-xl'">{{ flyingCard.suit }}</span>
                <span :class="flyingCard.isBlack ? 'text-zinc-400 text-[9px]' : 'text-rose-400 text-[9px]'">{{ flyingCard.rank }}</span>
              </div>
            </Transition>

            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div class="relative" style="width:48px;height:68px">
                <div v-for="(c, i) in dealtVisible.slice(-5)" :key="c.id"
                  class="absolute rounded-lg border flex flex-col items-center justify-center font-bold"
                  :class="c.isBlack ? 'bg-zinc-800 border-zinc-600' : 'bg-white border-zinc-200'"
                  :style="{ width:'44px', height:'62px', bottom:`${i*2}px`, left:`${i*1}px`, zIndex:i+1 }">
                  <span class="text-[7px] absolute top-1 left-1 leading-none" :class="c.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ c.rank }}</span>
                  <span class="text-base leading-none" :class="c.isBlack ? 'text-zinc-300' : 'text-rose-500'">{{ c.suit }}</span>
                  <span class="text-[7px] absolute bottom-1 right-1 leading-none rotate-180" :class="c.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ c.rank }}</span>
                </div>
                <div v-if="dealtVisible.length === 0" class="w-[44px] h-[62px] border border-dashed border-zinc-800 rounded-lg"></div>
              </div>
              <span class="text-[9px] text-zinc-600">{{ dealtVisible.length }}</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
              <div class="h-full bg-zinc-400 transition-all duration-150"
                :style="{ width: `${dealtDeck.length > 0 ? (dealtVisible.length / dealtDeck.length) * 100 : 0}%` }"></div>
            </div>
          </div>

          <button v-if="!dealStarted" @click="startDealAnimation"
            class="w-full bg-zinc-200 hover:bg-white text-zinc-900 font-bold py-4 rounded-2xl transition-colors">
            🃏 Deal cards
          </button>

          <!-- All slots: fills in as cards are dealt -->
          <div class="space-y-2">
            <template v-for="slot in allSlots" :key="slot.slotNum">
              <div :class="slot.shared ? 'border border-orange-900/50' : 'border border-zinc-800'" class="rounded-2xl overflow-hidden bg-zinc-900">
                <div class="px-4 py-2 border-b" :class="slot.shared ? 'border-orange-900/30' : 'border-zinc-800'">
                  <span class="text-[10px] uppercase tracking-widest font-semibold" :class="slot.shared ? 'text-orange-600' : 'text-zinc-500'">Slot {{ slot.slotNum }}</span>
                </div>
                <div :class="slot.shared ? 'divide-y divide-orange-900/30' : ''">
                  <div v-for="p in slot.players" :key="p.isHost ? 'host' : p.id" class="flex items-center gap-3 px-4 py-3.5">
                    <div class="relative rounded-lg flex-shrink-0 flex flex-col items-center justify-center font-bold"
                      :class="p.isHost ? 'bg-white border border-rose-300' : p.card?.isBlack ? 'bg-zinc-800 border border-zinc-600' : 'bg-white'"
                      style="width:32px;height:44px">
                      <span class="text-[6px] absolute top-1 left-1 leading-none" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                      <span class="text-sm leading-none" :class="p.isHost ? 'text-rose-500' : p.card?.isBlack ? 'text-zinc-300' : 'text-rose-500'">{{ p.isHost ? '🃏' : p.card?.suit }}</span>
                      <span class="text-[6px] absolute bottom-1 right-1 leading-none rotate-180" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                    </div>
                    <span class="text-sm font-medium text-zinc-100 flex-1 truncate">{{ p.name }}<span v-if="p.isHost" class="text-zinc-600 font-normal text-xs ml-1.5">host</span></span>
                    <span class="text-xs font-semibold flex-shrink-0" :class="slot.shared ? 'text-orange-400' : 'text-emerald-500'">{{ slot.shared ? '1 song' : '2 songs' }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- ══ STEP 4: Swaps ══ -->
        <div v-if="step === 4" class="space-y-5">
          <div>
            <h1 class="text-2xl font-bold">Simulate swaps</h1>
            <p class="text-zinc-500 text-sm mt-1">Some people trade cards after drawing.</p>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span class="text-xs text-zinc-500 flex-shrink-0">Swap rate</span>
            <input type="range" min="0" max="100" step="5" v-model.number="swapPct"
              :disabled="swapAnimating"
              class="flex-1 accent-white h-1.5 rounded-full disabled:opacity-40 cursor-pointer" />
            <span class="text-sm font-bold text-zinc-200 w-10 text-right flex-shrink-0">{{ swapPct }}%</span>
          </div>

          <div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(68px, 1fr))">
            <div v-for="p in nonHostPlayers" :key="p.id"
              class="flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all duration-300"
              :class="{
                'bg-zinc-700/30 ring-2 ring-zinc-400/60 scale-105': swapHighlight.has(p.id) && !swapDone.has(p.id),
                'bg-emerald-950/30 ring-1 ring-emerald-800/40': swapDone.has(p.id),
              }">
              <div class="relative rounded-lg flex flex-col items-center justify-center font-bold flex-shrink-0 transition-transform duration-300"
                :class="[
                  p.card!.isBlack ? 'bg-zinc-800 border border-zinc-600' : 'bg-white',
                  swapHighlight.has(p.id) && !swapDone.has(p.id) ? 'scale-110' : '',
                ]"
                style="width:42px;height:58px">
                <span class="text-[7px] absolute top-1 left-1 leading-none"
                  :class="p.card!.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.card!.rank }}</span>
                <span class="text-base leading-none"
                  :class="p.card!.isBlack ? 'text-zinc-300' : 'text-rose-500'">{{ p.card!.suit }}</span>
                <span class="text-[7px] absolute bottom-1 right-1 leading-none rotate-180"
                  :class="p.card!.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.card!.rank }}</span>
              </div>
              <span class="text-[8px] text-zinc-600 truncate w-full text-center">{{ p.name }}</span>
            </div>
          </div>

          <div v-if="swapLog.length" class="space-y-1">
            <p class="text-[10px] text-zinc-600 uppercase tracking-widest">{{ swapLog.length }} swap{{ swapLog.length !== 1 ? 's' : '' }}:</p>
            <div class="space-y-1 max-h-48 overflow-y-auto">
              <div v-for="(sw, i) in swapLog" :key="i"
                class="text-xs flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                <div class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-700"></div>
                <span class="text-zinc-300 font-medium">{{ sw.aName }}</span>
                <span class="text-zinc-700">→</span>
                <span class="font-bold" :class="sw.bCard.isBlack ? 'text-zinc-300' : 'text-rose-400'">{{ sw.bCard.label }}</span>
                <span class="text-zinc-700 mx-0.5">⇄</span>
                <span class="text-zinc-300 font-medium">{{ sw.bName }}</span>
                <span class="text-zinc-700">→</span>
                <span class="font-bold" :class="sw.aCard.isBlack ? 'text-zinc-300' : 'text-rose-400'">{{ sw.aCard.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ STEP 5: Call up ══ -->
        <div v-if="step === 5" class="space-y-4">
          <h1 class="text-2xl font-bold">The List</h1>

          <!-- First set -->
          <div class="space-y-2">
            <p class="text-[10px] uppercase tracking-widest text-zinc-500 px-1">First set</p>
            <template v-for="slot in allSlots.slice(0, 7)" :key="slot.slotNum">
              <div :class="slot.shared ? 'border border-orange-900/50' : 'border border-zinc-800'" class="rounded-2xl overflow-hidden bg-zinc-900">
                <div class="px-4 py-2 border-b" :class="slot.shared ? 'border-orange-900/30' : 'border-zinc-800'">
                  <span class="text-[10px] uppercase tracking-widest font-semibold" :class="slot.shared ? 'text-orange-600' : 'text-zinc-500'">Slot {{ slot.slotNum }}</span>
                </div>
                <div :class="slot.shared ? 'divide-y divide-orange-900/30' : ''">
                  <div v-for="p in slot.players" :key="p.isHost ? 'host' : p.id" class="flex items-center gap-3 px-4 py-3.5">
                    <div class="relative rounded-lg flex-shrink-0 flex flex-col items-center justify-center font-bold"
                      :class="p.isHost ? 'bg-white border border-rose-300' : p.card?.isBlack ? 'bg-zinc-800 border border-zinc-600' : 'bg-white'"
                      style="width:32px;height:44px">
                      <span class="text-[6px] absolute top-1 left-1 leading-none" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                      <span class="text-sm leading-none" :class="p.isHost ? 'text-rose-500' : p.card?.isBlack ? 'text-zinc-300' : 'text-rose-500'">{{ p.isHost ? '🃏' : p.card?.suit }}</span>
                      <span class="text-[6px] absolute bottom-1 right-1 leading-none rotate-180" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                    </div>
                    <span class="text-sm font-medium text-zinc-100 flex-1 truncate">{{ p.name }}<span v-if="p.isHost" class="text-zinc-600 font-normal text-xs ml-1.5">host</span></span>
                    <span class="text-xs font-semibold flex-shrink-0" :class="slot.shared ? 'text-orange-400' : 'text-emerald-500'">{{ slot.shared ? '1 song' : '2 songs' }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Break -->
          <div class="flex items-center gap-3 py-2">
            <div class="flex-1 h-px bg-zinc-800"></div>
            <span class="text-[10px] text-zinc-500 uppercase tracking-widest flex-shrink-0 px-1">Break</span>
            <div class="flex-1 h-px bg-zinc-800"></div>
          </div>

          <!-- Second set -->
          <div class="space-y-2">
            <p class="text-[10px] uppercase tracking-widest text-zinc-500 px-1">Second set</p>
            <template v-for="slot in allSlots.slice(7)" :key="slot.slotNum">
              <div :class="slot.shared ? 'border border-orange-900/50' : 'border border-zinc-800'" class="rounded-2xl overflow-hidden bg-zinc-900">
                <div class="px-4 py-2 border-b" :class="slot.shared ? 'border-orange-900/30' : 'border-zinc-800'">
                  <span class="text-[10px] uppercase tracking-widest font-semibold" :class="slot.shared ? 'text-orange-600' : 'text-zinc-500'">Slot {{ slot.slotNum }}</span>
                </div>
                <div :class="slot.shared ? 'divide-y divide-orange-900/30' : ''">
                  <div v-for="p in slot.players" :key="p.isHost ? 'host' : p.id" class="flex items-center gap-3 px-4 py-3.5">
                    <div class="relative rounded-lg flex-shrink-0 flex flex-col items-center justify-center font-bold"
                      :class="p.isHost ? 'bg-white border border-rose-300' : p.card?.isBlack ? 'bg-zinc-800 border border-zinc-600' : 'bg-white'"
                      style="width:32px;height:44px">
                      <span class="text-[6px] absolute top-1 left-1 leading-none" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                      <span class="text-sm leading-none" :class="p.isHost ? 'text-rose-500' : p.card?.isBlack ? 'text-zinc-300' : 'text-rose-500'">{{ p.isHost ? '🃏' : p.card?.suit }}</span>
                      <span class="text-[6px] absolute bottom-1 right-1 leading-none rotate-180" :class="p.isHost ? 'text-rose-400' : p.card?.isBlack ? 'text-zinc-400' : 'text-rose-500'">{{ p.isHost ? 'JKR' : p.card?.rank }}</span>
                    </div>
                    <span class="text-sm font-medium text-zinc-100 flex-1 truncate">{{ p.name }}<span v-if="p.isHost" class="text-zinc-600 font-normal text-xs ml-1.5">host</span></span>
                    <span class="text-xs font-semibold flex-shrink-0" :class="slot.shared ? 'text-orange-400' : 'text-emerald-500'">{{ slot.shared ? '1 song' : '2 songs' }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ Sticky footer ══ -->
    <div class="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-900 px-4 py-3 flex gap-3">
      <button v-if="step > 0" @click="goBack"
        :disabled="swapAnimating || (step === 3 && dealStarted && !dealDone)"
        class="flex-shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 font-semibold py-3.5 px-5 rounded-2xl transition-colors text-sm">
        ← Back
      </button>
      <template v-if="step === 0">
        <button @click="step = 1" class="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">Continue →</button>
      </template>
      <template v-else-if="step === 1">
        <button @click="step = 2" class="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">Continue →</button>
      </template>
      <template v-else-if="step === 2">
        <button @click="goToDeal"
          :disabled="surplus > 0 && volunteerCount > 0 && !volDealt"
          class="flex-1 bg-white hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">Deal cards →</button>
      </template>
      <template v-else-if="step === 3">
        <button v-if="dealDone" @click="goToSwaps" class="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">Continue →</button>
        <div v-else class="flex-1"></div>
      </template>
      <template v-else-if="step === 4">
        <button v-if="swapLog.length > 0" @click="resetSwaps"
          class="flex-shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-semibold py-3.5 px-5 rounded-2xl transition-colors text-sm">
          ↺
        </button>
        <button v-if="!swapAnimating && swapLog.length === 0" @click="runSwapAnimation"
          class="flex-1 bg-zinc-200 hover:bg-white text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">
          🔀 Simulate swaps
        </button>
        <button v-if="!swapAnimating && swapLog.length > 0" @click="step = 5"
          class="flex-1 bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3.5 rounded-2xl transition-colors">
          Continue →
        </button>
        <button v-if="!swapAnimating && swapLog.length === 0" @click="step = 5"
          class="flex-shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-semibold py-3.5 px-5 rounded-2xl transition-colors text-sm">
          Skip →
        </button>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
interface NightCard {
  id: string; label: string; isBlack: boolean; suit: string; rank: string
}
interface Player {
  id: number; name: string; isHost: boolean; card: NightCard | null
}
interface VolunteerAssignment {
  playerName: string
  card: NightCard
}
interface DeckAssignment {
  card: NightCard
  playerName: string
  slot: number
  songs: number
  shared: boolean
}

const NON_HOST_SPOTS = 13
const RED_RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const HOST_CARD: NightCard = { id: 'HOST_JOKER', label: 'Red Joker', isBlack: false, suit: '🃏', rank: 'JKR' }

function buildRedDeck(): NightCard[] {
  return RED_RANKS.map(rank => ({ id:`${rank}♥`, label:`${rank}♥`, isBlack:false, suit:'♥', rank }))
}

function buildSurplusCards(n: number): NightCard[] {
  const cards: NightCard[] = []
  if (!n) return cards
  cards.push({ id:'JOKER', label:'Joker', isBlack:true, suit:'🃏', rank:'JKR' })
  const cr = ['2','3','4','5','6','7','8','9','10','J','Q','K']
  for (let i = 1; i < n; i++) cards.push({ id:`${cr[i-1]}♠`, label:`♠${cr[i-1]}`, isBlack:true, suit:'♠', rank:cr[i-1] })
  return cards
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1))
    ;[a[i],a[j]] = [a[j],a[i]]
  }
  return a
}

function insertIntoSecondHalf(base: NightCard[], extras: NightCard[]): NightCard[] {
  if (!extras.length) return [...base]
  const result = [...base]
  const mid = Math.ceil(base.length / 2)
  const stepSize = Math.max(1, Math.floor((base.length - mid) / (extras.length + 1)))
  extras.forEach((e, i) => {
    const pos = Math.min(mid + stepSize*(i+1)+i, result.length)
    result.splice(pos, 0, e)
  })
  return result
}

// ── State ──────────────────────────────────────────────────────────────────
const step = ref(0)
const showHelp = ref(false)
const numPlayers = ref(16)
const volunteerCount = ref(0)
const volunteerAssignments = ref<VolunteerAssignment[]>([])
const volDealt = ref(false)
const swapPct = ref(20)
const seenIds = ref(new Set<number>())
const players = ref<Player[]>([])
const dealtDeck = ref<NightCard[]>([])
const originalCards = ref<Record<number, NightCard>>({})
const revealedCardIds = ref<Set<string>>(new Set())

const dealStarted = ref(false)
const dealDone = ref(false)
const dealtVisible = ref<NightCard[]>([])
const flyingCard = ref<NightCard | null>(null)
const redStackRemaining = ref(NON_HOST_SPOTS)
const surplusStackRemaining = ref(0)

const surplus = computed(() => Math.max(0, numPlayers.value - NON_HOST_SPOTS))
const surplusCards = computed(() => buildSurplusCards(surplus.value))
const hostPlayer = computed(() => players.value.find(p => p.isHost))
const nonHostPlayers = computed(() => players.value.filter(p => !p.isHost))
// Whoever holds the black Joker (non-host)
const blackJokerHolder = computed<Player | undefined>(() =>
  nonHostPlayers.value.find(p => p.card?.id === 'JOKER')
)
// Host shares slot with whoever holds the black Joker
const blackJokerInDeck = computed(() => !!blackJokerHolder.value)

function setVolunteerCount(n: number) {
  volunteerCount.value = Math.max(0, Math.min(surplus.value, n))
  volunteerAssignments.value = []
  volDealt.value = false
}

function dealToVolunteers() {
  const playerNums = shuffle(Array.from({ length: numPlayers.value }, (_, i) => i + 1))
  const selectedNums = playerNums.slice(0, volunteerCount.value)
  const shuffledCards = shuffle(surplusCards.value.slice(0, volunteerCount.value))
  volunteerAssignments.value = selectedNums.map((num, i) => ({
    playerName: `Person ${num}`,
    card: shuffledCards[i],
  }))
  volDealt.value = true
}

function redealVolunteers() {
  volDealt.value = false
  volunteerAssignments.value = []
}

function reset() {
  step.value = 0; numPlayers.value = 16; volunteerCount.value = 0
  volunteerAssignments.value = []; volDealt.value = false
  swapPct.value = 20; seenIds.value = new Set()
  players.value = []; dealtDeck.value = []; originalCards.value = {}
  dealStarted.value = false; dealDone.value = false
  dealtVisible.value = []; flyingCard.value = null; revealedCardIds.value = new Set()
}

function goBack() {
  if (step.value === 3) {
    dealStarted.value = false; dealDone.value = false
    dealtVisible.value = []; flyingCard.value = null; revealedCardIds.value = new Set()
  }
  step.value--
}

function goToDeal() {
  const sc = surplusCards.value
  const ps: Player[] = []
  ps.push({ id:0, name:'Host', isHost:true, card: HOST_CARD })
  for (let i = 1; i <= numPlayers.value; i++)
    ps.push({ id:i, name:`Person ${i}`, isHost:false, card:null })

  // Apply volunteer assignments from step 2 simulation
  const va = volunteerAssignments.value
  va.forEach(assignment => {
    const p = ps.find(p => p.name === assignment.playerName)
    if (p) p.card = assignment.card
  })

  // Build deck for remaining players
  const redDeck = buildRedDeck()
  const remainingBlack = sc.slice(volunteerCount.value)
  const combined = insertIntoSecondHalf(redDeck, remainingBlack)
  dealtDeck.value = combined

  const unassigned = ps.filter(p => !p.isHost && !p.card)
  const shuffled = shuffle(combined)
  unassigned.forEach((p, i) => { p.card = shuffled[i] ?? null })

  // Save full assignments
  const snap: Record<number, NightCard> = {}
  ps.forEach(p => { if (p.card) snap[p.id] = p.card })
  originalCards.value = snap

  // Strip deck-dealt cards from players until revealed during animation
  const volunteerCardIds = new Set(va.map(v => v.card.id))
  ps.forEach(p => {
    if (!p.isHost && p.card && !volunteerCardIds.has(p.card.id)) p.card = null
  })
  players.value = ps
  revealedCardIds.value = new Set()

  dealStarted.value = false; dealDone.value = false
  dealtVisible.value = []; flyingCard.value = null; revealedCardIds.value = new Set()
  redStackRemaining.value = NON_HOST_SPOTS
  surplusStackRemaining.value = surplus.value - volunteerCount.value
  step.value = 3
}

async function startDealAnimation() {
  dealStarted.value = true
  // Build reverse map: cardId → player id
  const cardToPlayer: Record<string, number> = {}
  Object.entries(originalCards.value).forEach(([pid, card]) => {
    cardToPlayer[card.id] = Number(pid)
  })
  const cards = [...dealtDeck.value]
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    flyingCard.value = card
    if (card.isBlack) surplusStackRemaining.value = Math.max(0, surplusStackRemaining.value - 1)
    else redStackRemaining.value = Math.max(0, redStackRemaining.value - 1)
    await new Promise(r => setTimeout(r, 120))
    dealtVisible.value = [...dealtVisible.value, card]
    // Reveal card on the player so the slot appears
    const pid = cardToPlayer[card.id]
    if (pid !== undefined) {
      const p = players.value.find(p => p.id === pid)
      if (p) p.card = originalCards.value[pid]
    }
    flyingCard.value = null
    await new Promise(r => setTimeout(r, 40))
  }
  dealDone.value = true
}

// Build a flat list of card→player for the dealt deck, with slot numbers
// Pairing rule: a black surplus card shares a slot with the red card of the SAME rank.
// Black Joker shares with host (red Joker). Order follows the red deck sequence.
const deckAssignments = computed((): DeckAssignment[] => {
  if (!players.value.length || !dealDone.value) return []
  const byRedId: Record<string, Player> = {}
  const byBlackRank: Record<string, Player> = {}
  for (const p of nonHostPlayers.value) {
    if (!p.card) continue
    if (!p.card.isBlack) byRedId[p.card.id] = p
    else byBlackRank[p.card.rank] = p
  }

  const host = hostPlayer.value!
  const result: DeckAssignment[] = []
  let slotNum = 1

  // Joker slot first — host always shares if anyone holds the black Joker
  const jokerHolder = blackJokerHolder.value
  const hostShared = !!jokerHolder
  result.push({ card: HOST_CARD, playerName: host.name, slot: slotNum, songs: hostShared ? 1 : 2, shared: hostShared })
  if (jokerHolder) {
    result.push({ card: jokerHolder.card!, playerName: jokerHolder.name, slot: slotNum, songs: 1, shared: true })
  }
  slotNum++

  // 2 → A: black card of matching rank always shares, volunteer or not
  for (const redCard of buildRedDeck()) {
    const redPlayer = byRedId[redCard.id]
    const blackPlayer = byBlackRank[redCard.rank]
    if (blackPlayer) {
      if (redPlayer) result.push({ card: redCard, playerName: redPlayer.name, slot: slotNum, songs: 1, shared: true })
      result.push({ card: blackPlayer.card!, playerName: blackPlayer.name, slot: slotNum, songs: 1, shared: true })
      slotNum++
    } else if (redPlayer) {
      result.push({ card: redCard, playerName: redPlayer.name, slot: slotNum, songs: 2, shared: false })
      slotNum++
    }
  }
  return result
})

function goToSwaps() {
  swapLog.value = []; swapHighlight.value = new Set(); swapDone.value = new Set()
  swapAnimating.value = false; seenIds.value = new Set(); step.value = 4
}

const swapAnimating = ref(false)
const swapHighlight = ref(new Set<number>())
const swapDone = ref(new Set<number>())
const swapPairCount = computed(() => Math.floor(Math.round(numPlayers.value * swapPct.value / 100) / 2))

interface SwapEntry { aName: string; bName: string; aCard: NightCard; bCard: NightCard }
const swapLog = ref<SwapEntry[]>([])

function resetSwaps() {
  players.value.forEach(p => { if (!p.isHost) p.card = originalCards.value[p.id] ?? p.card })
  swapLog.value = []; swapHighlight.value = new Set(); swapDone.value = new Set()
  swapAnimating.value = false
}

async function runSwapAnimation() {
  const ps = nonHostPlayers.value
  const pairCount = swapPairCount.value
  if (pairCount < 1) return
  const picked = shuffle([...ps]).slice(0, pairCount * 2)
  const pairs: [Player, Player][] = []
  for (let i = 0; i < picked.length - 1; i += 2) pairs.push([picked[i]!, picked[i+1]!])

  swapAnimating.value = true
  swapLog.value = []; swapHighlight.value = new Set(); swapDone.value = new Set()

  for (const [a, b] of pairs) {
    swapHighlight.value = new Set([...swapHighlight.value, a.id, b.id])
    await new Promise(r => setTimeout(r, 400))
    const ac = a.card!, bc = b.card!
    a.card = bc; b.card = ac
    swapLog.value = [...swapLog.value, { aName: a.name, bName: b.name, aCard: ac, bCard: bc }]
    await new Promise(r => setTimeout(r, 350))
    swapDone.value = new Set([...swapDone.value, a.id, b.id])
    swapHighlight.value = new Set([...swapHighlight.value].filter(id => id !== a.id && id !== b.id))
    await new Promise(r => setTimeout(r, 120))
  }
  swapAnimating.value = false
}

function slotOf(p: Player): number | string {
  const entry = deckAssignments.value.find(d => d.playerName === p.name)
  return entry ? entry.slot : '?'
}

const unseenPlayers = computed(() =>
  playersInSlotOrder.value.filter(p => !seenIds.value.has(p.id))
)
const seenPlayers = computed(() => players.value.filter(p => seenIds.value.has(p.id)))
function markSeen(id: number) { seenIds.value = new Set([...seenIds.value, id]) }

const finalOrder = computed(() => {
  if (!players.value.length) return []
  // Build lookup: rank → player holding that card
  const byRedId: Record<string, Player> = {}
  const byBlackRank: Record<string, Player> = {} // rank → player with black card of that rank
  for (const p of nonHostPlayers.value) {
    if (!p.card) continue
    if (!p.card.isBlack) byRedId[p.card.id] = p
    else byBlackRank[p.card.rank] = p
  }
  const host = hostPlayer.value!
  const result: { slotNum: number; shared: boolean; players: Player[] }[] = []
  let slotNum = 1

  // Slot order: Joker first, then 2, 3 … A.
  // A black surplus card (volunteer or not) always shares the slot of its matching rank.
  // Volunteer status only means they got the card earlier — it doesn't change slot position.

  // Joker slot (host always shares if anyone holds the black Joker)
  const blackJokerPlayer = blackJokerHolder.value
  const hostSlotPlayers: Player[] = blackJokerPlayer ? [host, blackJokerPlayer] : [host]
  result.push({ slotNum: slotNum++, shared: !!blackJokerPlayer, players: hostSlotPlayers })

  // 2 → A slots
  for (const redCard of buildRedDeck()) {
    const redPlayer = byRedId[redCard.id]
    const blackPlayer = byBlackRank[redCard.rank]
    if (blackPlayer) {
      // Black card of this rank exists — shared slot (red + black), regardless of volunteer status
      const pair: Player[] = []
      if (redPlayer) pair.push(redPlayer)
      pair.push(blackPlayer)
      result.push({ slotNum: slotNum++, shared: true, players: pair })
    } else if (redPlayer) {
      result.push({ slotNum: slotNum++, shared: false, players: [redPlayer] })
    }
  }
  return result
})

// Alias for final order page — all slots in order (volunteers + host + deck)
const allSlots = finalOrder

// Players in slot order (Joker → 2 → A) for the call-up page
const playersInSlotOrder = computed(() => {
  const seen = new Set<number>()
  const ordered: Player[] = []
  for (const slot of finalOrder.value) {
    for (const p of slot.players) {
      const id = p.isHost ? -1 : p.id
      if (!seen.has(id)) { seen.add(id); ordered.push(p) }
    }
  }
  return ordered
})
</script>

<style>
.fly-enter-active { transition: all 0.1s ease-out; }
.fly-leave-active { transition: all 0.1s ease-in; }
.fly-enter-from   { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
.fly-leave-to     { opacity: 0; transform: translate(calc(-50% + 80px), -50%) scale(0.8); }
</style>
