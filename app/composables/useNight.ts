export type CardColor = 'red' | 'black'

export interface Card {
  id: string
  rank: string
  suit: string
  color: CardColor
  // For surplus black cards: which red card's slot they share
  // e.g. surplusIndex=0 → Joker, =1 → ♣2, =2 → ♣3 ...
  surplusIndex: number | null // null = normal red card
}

export interface Player {
  id: number
  name: string
  isHost: boolean
  card: Card | null
}

export interface SwapEntry {
  aName: string
  bName: string
  aCard: string
  bCard: string
}

export interface SlotInfo {
  slotNumber: number
  // The red card occupying this slot position
  redCard: Card
  // The surplus black card sharing this slot (if any)
  blackCard: Card | null
  // Players assigned to this slot
  players: Player[]
  songs: number // 2 if no black card sharing, 1 each if shared
}

export interface NightState {
  totalSpots: number
  numPeople: number
  hostName: string
  surplus: number
  players: Player[]

  // Surplus black cards: Joker, ♣2, ♣3 ... ♣surplus
  // These are a SEPARATE set from the red deck
  surplusCards: Card[]

  volunteerCount: number    // K people who want early + 1 song
  volunteerCards: Card[]    // first K surplus cards given to volunteers

  // Red deck: ordered ♥2..A ♦2..A (14 cards for 14 spots)
  redDeck: Card[]

  // Final deck distributed to non-volunteers:
  // red cards + (surplus-K) black surplus cards inserted
  finalDeck: Card[]

  swapLog: SwapEntry[]
  step: number
}

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Ordered red deck: ♥2,♥3...♥A, ♦2...
function buildRedDeck(n: number): Card[] {
  const cards: Card[] = []
  for (const suit of ['♥', '♦']) {
    for (const rank of RANKS) {
      if (cards.length >= n) break
      cards.push({ id: `${rank}${suit}`, rank, suit, color: 'red', surplusIndex: null })
    }
    if (cards.length >= n) break
  }
  return cards
}

// Surplus cards in fixed order: Joker, ♣2, ♣3, ♣4 ... up to n cards
function buildSurplusCards(n: number): Card[] {
  const cards: Card[] = []
  if (n === 0) return cards
  // Index 0 = Joker
  cards.push({ id: 'JOKER', rank: 'JKR', suit: '🃏', color: 'black', surplusIndex: 0 })
  // Index 1..n-1 = ♣2, ♣3 ...
  for (let i = 1; i < n; i++) {
    const rank = RANKS[i] // RANKS[1]=3 but we want 2,3,4... so use RANKS starting at index 0
    const r = RANKS[i - 1] // 2,3,4...
    cards.push({ id: `${r}♣`, rank: r, suit: '♣', color: 'black', surplusIndex: i })
  }
  return cards
}

// Insert black cards evenly into the second half of the base array
function insertIntoSecondHalf(base: Card[], extras: Card[]): Card[] {
  if (!extras.length) return [...base]
  const mid = Math.ceil(base.length / 2)
  const firstHalf = base.slice(0, mid)
  const secondHalf = [...base.slice(mid)]
  const step = Math.max(1, Math.floor(secondHalf.length / (extras.length + 1)))
  extras.forEach((e, i) => {
    const pos = Math.min(step * (i + 1) + i, secondHalf.length)
    secondHalf.splice(pos, 0, e)
  })
  return [...firstHalf, ...secondHalf]
}

// Given the final ordered deck, compute slot groupings.
// A surplus black card "shares" the slot of whatever red card it is adjacent to
// (specifically: the red card immediately before it in the deck, or after if it's first).
// The rule: black surplus card + adjacent red card = shared slot, 1 song each.
export function computeSlots(
  finalDeck: Card[],
  volunteerCards: Card[],
  players: Player[],
): SlotInfo[] {
  const slots: SlotInfo[] = []

  // Volunteer slots come first (each is a shared slot paired with a red card by surplusIndex)
  // Actually volunteer black cards are given OUT before the deck is built — they occupy
  // the very first N volunteer slots. Each volunteer black card is paired with the red card
  // at slotIndex = surplusIndex position in the red deck order... but the simpler rule from
  // the algorithm is: the volunteer black cards go to early positions.
  // We treat them as: slot 1..K are shared slots for volunteers, slotting in at the front.
  // The red card they pair with is redDeck[surplusIndex] (since surplusIndex 0=Joker pairs
  // with first red, etc.) — but actually the pairing is simply by position in the full deck.

  // Simplest correct interpretation:
  // Build a unified ordered list: volunteerCards (in surplusIndex order) interleaved with
  // finalDeck, then group consecutive (red, black) or (black, red) pairs that share a slot.

  // The clearest rule: a surplus black card inserted into a position in the deck means
  // whoever draws it shares that position's slot with the person holding the red card
  // that was at that position before insertion. In practice, the black card is inserted
  // BETWEEN two red cards, so it shares with whichever red card is adjacent (next one = same slot).

  // Implementation: walk finalDeck, when we see a black card, it shares the slot with
  // the NEXT red card in the deck.

  const playerByCard: Record<string, Player> = {}
  for (const p of players) {
    if (p.card) playerByCard[p.card.id] = p
  }

  // Volunteer slots: one slot per volunteer card, each paired with redDeck[surplusIndex]
  // But we don't have direct redDeck reference here — pass it in for completeness.
  // For now, just show them as standalone slots at the start, each 1 song (shared with TBD).

  // Process finalDeck: group black+red pairs
  let i = 0
  let slotNum = volunteerCards.length + 1 // volunteer slots come before
  while (i < finalDeck.length) {
    const card = finalDeck[i]
    if (card.color === 'black') {
      // This black card shares with the next red card
      const nextRed = finalDeck[i + 1]
      if (nextRed && nextRed.color === 'red') {
        slots.push({
          slotNumber: slotNum++,
          redCard: nextRed,
          blackCard: card,
          players: [playerByCard[card.id], playerByCard[nextRed.id]].filter(Boolean),
          songs: 1,
        })
        i += 2
      } else {
        // orphan black card (shouldn't happen in well-formed deck)
        slots.push({
          slotNumber: slotNum++,
          redCard: card as any,
          blackCard: null,
          players: [playerByCard[card.id]].filter(Boolean),
          songs: 1,
        })
        i++
      }
    } else {
      // Normal red card, 2 songs
      slots.push({
        slotNumber: slotNum++,
        redCard: card,
        blackCard: null,
        players: [playerByCard[card.id]].filter(Boolean),
        songs: 2,
      })
      i++
    }
  }

  return slots
}

export const STEPS = [
  { id: 0, label: 'Count people' },
  { id: 1, label: 'Volunteers' },
  { id: 2, label: 'Give black cards' },
  { id: 3, label: 'Build deck' },
  { id: 4, label: 'Deal to rest' },
  { id: 5, label: 'Swaps' },
  { id: 6, label: 'Final order' },
]

export function useNight() {
  const state = useState<NightState | null>('night', () => null)

  function initNight(totalSpots: number, numPeople: number, hostName: string) {
    const surplus = Math.max(0, numPeople - totalSpots)
    const players: Player[] = []
    players.push({ id: 0, name: hostName, isHost: true, card: null })
    for (let i = 1; i < numPeople; i++)
      players.push({ id: i, name: `Person ${i}`, isHost: false, card: null })

    state.value = {
      totalSpots, numPeople, hostName, surplus,
      players,
      surplusCards: buildSurplusCards(surplus),
      volunteerCount: 0,
      volunteerCards: [],
      redDeck: buildRedDeck(totalSpots),
      finalDeck: [],
      swapLog: [],
      step: 0,
    }
  }

  function setVolunteerCount(k: number) {
    if (!state.value) return
    state.value.volunteerCount = Math.max(0, Math.min(k, state.value.surplus))
  }

  // Step 2: shuffle the first K surplus cards and auto-assign one to each volunteer player
  function assignVolunteerCards(volunteerPlayerIds: number[]) {
    if (!state.value) return
    const s = state.value
    const shuffled = shuffle(s.surplusCards.slice(0, s.volunteerCount))
    s.volunteerCards = shuffled
    // Clear old volunteer card assignments
    s.players.forEach(p => {
      if (p.card && p.card.surplusIndex !== null) p.card = null
    })
    // Auto-assign: each volunteer player gets one shuffled card
    volunteerPlayerIds.slice(0, shuffled.length).forEach((pid, i) => {
      const p = s.players.find(p => p.id === pid)
      if (p) p.card = shuffled[i]
    })
  }

  // Step 3: insert remaining (surplus-K) black cards into red deck
  function buildFinalDeck() {
    if (!state.value) return
    const s = state.value
    const volunteerIds = new Set(s.volunteerCards.map(c => c.id))
    const remaining = s.surplusCards.filter(c => !volunteerIds.has(c.id))
    s.finalDeck = insertIntoSecondHalf(s.redDeck, remaining)
  }

  function dealAll() {
    if (!state.value) return
    const s = state.value
    const takenIds = new Set(s.players.filter(p => p.card).map(p => p.card!.id))
    const available = shuffle(s.finalDeck.filter(c => !takenIds.has(c.id)))
    const unassigned = s.players.filter(p => !p.card)
    unassigned.forEach((p, i) => { if (i < available.length) p.card = available[i] })
  }

  function dealOne() {
    if (!state.value) return
    const s = state.value
    const takenIds = new Set(s.players.filter(p => p.card).map(p => p.card!.id))
    const available = shuffle(s.finalDeck.filter(c => !takenIds.has(c.id)))
    const unassigned = s.players.filter(p => !p.card)
    if (unassigned.length && available.length) unassigned[0].card = available[0]
  }

  function doSwap(idA: number, idB: number) {
    if (!state.value || idA === idB) return
    const s = state.value
    const pa = s.players.find(p => p.id === idA)
    const pb = s.players.find(p => p.id === idB)
    if (!pa?.card || !pb?.card) return
    const aLabel = pa.card.rank + pa.card.suit
    const bLabel = pb.card.rank + pb.card.suit
    ;[pa.card, pb.card] = [pb.card, pa.card]
    s.swapLog.push({ aName: pa.name, bName: pb.name, aCard: bLabel, bCard: aLabel })
  }

  function setPlayerName(id: number, name: string) {
    if (!state.value) return
    const p = state.value.players.find(p => p.id === id)
    if (p) p.name = name
  }

  // Assign a volunteer card to a specific player
  function assignVolunteerToPlayer(playerId: number, cardId: string) {
    if (!state.value) return
    const s = state.value
    const player = s.players.find(p => p.id === playerId)
    const card = s.volunteerCards.find(c => c.id === cardId)
    if (!player || !card) return
    // Unassign this card from whoever had it
    s.players.forEach(p => { if (p.card?.id === cardId) p.card = null })
    player.card = card
  }

  function goTo(step: number) {
    if (!state.value) return
    state.value.step = Math.max(0, Math.min(STEPS.length - 1, step))
  }

  function reset() { state.value = null }

  const slots = computed<SlotInfo[]>(() => {
    if (!state.value) return []
    const s = state.value
    return computeSlots(s.finalDeck, s.volunteerCards, s.players)
  })

  // All players sorted by their slot position
  const sortedPlayers = computed(() => {
    if (!state.value) return []
    const s = state.value

    // Build position map from volunteerCards + finalDeck
    const order: Record<string, number> = {}
    let pos = 0
    for (const c of s.volunteerCards) order[c.id] = pos++
    for (const c of s.finalDeck) order[c.id] = pos++

    return [...s.players].sort((a, b) => {
      const ai = a.card ? (order[a.card.id] ?? 9999) : 9999
      const bi = b.card ? (order[b.card.id] ?? 9999) : 9999
      return ai - bi
    })
  })

  return {
    state: computed(() => state.value),
    initNight,
    setVolunteerCount,
    assignVolunteerCards,
    buildFinalDeck,
    dealAll,
    dealOne,
    doSwap,
    setPlayerName,
    assignVolunteerToPlayer,
    goTo,
    reset,
    slots,
    sortedPlayers,
  }
}
