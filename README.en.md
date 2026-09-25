# Memory Game App

A React Native memory game built on a custom animation layer over Reanimated 4, MVVM architecture, and game rules written as pure functions.

[Português](README.md) · **English**

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated-4.5-001A72)
![Zustand](https://img.shields.io/badge/Zustand-5.0-2B2B2B)

## Demo

[![Memory Game demo](https://img.youtube.com/vi/NkITKgMAV6U/maxresdefault.jpg)](https://youtu.be/NkITKgMAV6U)

The video walks through the full flow: login, picking a theme and a difficulty, the countdown, the choreographed card entrance, the two-second preview, the 3D flip during play, the shake on a wrong pair, the cards falling when time runs out, the victory confetti, and the history with swipe-to-delete.

## About the Project

A memory game with technology themes, where every match crosses two independent axes: the **theme** decides which cards are in play, the **difficulty** decides how much time you get.

- **Three themes** — Programming Languages, Frameworks and Libraries, Developer Tools — with 6 pairs each
- **Three difficulties** that change only the time limit: 60s, 30s, and 15s over the same 12-card grid
- **Persisted history** with a podium, aggregate statistics, and swipe-to-delete
- **No backend and no environment variables** — clone it, install it, run it

The project was a deliberate exercise in **motion architecture**. A memory game is trivial as business logic: compare two names and count the seconds. What makes it a *game* is the time between things — how long the wrong card stays visible before it shakes, how long it shakes before flipping back, when the defeat modal is allowed to appear without cutting the animation short. That timing usually ends up as `setTimeout(…, 700)` scattered across the codebase. Here it is treated as a layer with its own design tokens, and the game rules **import** that layer instead of guessing at its numbers.

## Stack

| Technology | Version | Role in the project |
|------------|---------|---------------------|
| React Native | 0.86.3 | Application foundation |
| Expo | ~57.0.22 | Platform and build |
| Expo Router | ~57.0.21 | File-based routing, with public and private routes |
| TypeScript | ~6.0.3 | Static typing, including the View–ViewModel contract |
| Reanimated | 4.5.1 | Every animation, running on the UI thread |
| React Native Worklets | 0.10.1 | UI → JS bridge (in Reanimated 4, `runOnJS` moved out of the main package) |
| Gesture Handler | ~2.32.0 | Swipe-to-delete gesture in the history screen |
| Zustand | ^5.0.15 | Auth, ranking, match, and animation state |
| AsyncStorage | ^3.1.1 | Local persistence for session and ranking |
| Expo Blur / Linear Gradient | ~57.0.3 / ~57.0.2 | Blurred modal backdrops, card and button gradients |
| date-fns | ^4.4.0 | Date formatting in the history screen |
| Baloo 2 (Google Fonts) | ^0.4.2 | Typography, in five weights |

## Technical Decisions

### Animation as a layer, not a screen detail

The [src/animations/](src/animations/) folder is an internal library with four layers — `config` (tokens), `utils` (derived durations), `store` (orchestration), and `hooks` (eleven of them). No hook renders JSX: every one returns an `animatedStyle` and, when the animation is imperative, a trigger (`shakeCards`, `playSucess`, `fallTriger`, `close`). The style is always applied by an `Animated.View` in the View.

Springs are tokens, the same way colors are tokens:

```ts
// src/animations/config/animation.config.ts
export const SPRING_CONFIG = {
    press:      { damping: 15, stiffness: 150 } satisfies WithSpringConfig,
    entryThrow: { damping: 27, stiffness: 180 } satisfies WithSpringConfig,
    entryDeck:  { damping: 22, stiffness: 140 } satisfies WithSpringConfig,
    entryScale: { damping: 22, stiffness: 180 } satisfies WithSpringConfig,
    selection:  { damping: 15, stiffness: 300 } satisfies WithSpringConfig,
    modal:      { damping: 25, stiffness: 120, mass: 1 } satisfies WithSpringConfig,
}
```

`satisfies` validates each preset against `WithSpringConfig` without widening the type — autocomplete still knows the exact keys.

### The game rules import the animation config

This is the central decision of the project.

Reanimated runs on the UI thread and **does not tell JavaScript** when a sequence finishes. When logic has to react to the end of an animation, the usual path is to fill the code with `runOnJS` — or, worse, guess a `setTimeout` with a number nobody can trace.

The way out here was making the duration **computable**. The wrong-pair shake is a `withSequence` with a known structure, so its total duration is reconstructed algebraically from the very tokens that generate it:

```ts
// src/animations/config/animation.config.ts
export const MISS_MATCH_TIMINGS = {
    // how long the wrong pair stays visible before the shake starts
    peek: 300,
    // duration of each step of the shake's back-and-forth
    shakeStep: 50,
    // how many back-and-forth cycles after the initial kick
    shakeCycles: 3,
}

// initial kick + (there and back * cycles) + return to center
export const SHAKE_DURATION =
    MISS_MATCH_TIMINGS.shakeStep * (2 + MISS_MATCH_TIMINGS.shakeCycles * 2)
```

And the match store — which is business logic, not presentation — imports those values to schedule the flip-back:

```ts
// src/shared/stores/game.store.ts
case "missMatch":
    setTimeout(() => get().flagMissMatch(), MISS_MATCH_TIMINGS.peek)
    setTimeout(
        () => get().resetMissMatchedCards(),
        MISS_MATCH_TIMINGS.peek + SHAKE_DURATION
    )
    break
```

The wrong pair stays visible for 300ms, shakes for 400ms, and flips back at 700ms — and none of those three numbers is written as a literal anywhere. Changing `shakeCycles` from 3 to 5 re-tunes the game logic on its own.

The same reasoning covers the entrance cascade and the timeout fall, in [animation.utils.ts](src/animations/utils/animation.utils.ts):

```ts
export const getEntryAnimationDuration = (
    cardCount: number,
    animationType: CardEntryAnimationType
) => {
    const config = ANIMATION_TIMINGS.entry[animationType]
    const lastCardDelay = (cardCount - 1) * config.delayBetweenCards
    const springSettaleTime = animationType === 'throw' ? 800 : config.duration

    return lastCardDelay + springSettaleTime + 200
}
```

The practical result: `runOnJS` appears **twice** in the entire project, and in both places it is genuinely required — the end of an animation needs to touch React state.

### A thin store, a pure service

`GameService` is a class of pure static methods: they take state and return new state. No React, no store, no side effects — testable without rendering anything.

The store is a transactional shell. The pattern repeats ten times:

```ts
// src/shared/stores/game.store.ts
flagMissMatch: () => {
    const currentState = get()
    const newState = GameService.flagMissMatch(currentState)
    set(newState)
},
```

What the store adds is exactly what a pure function cannot have: the clock's `setInterval` and the flow's `setTimeout` calls. And the bridge between the two worlds is a discriminator — the pure function doesn't just return the new state, it **says what happened**:

```ts
// src/shared/services/game.service.ts
static selectCard(gameState: GameState, cardId: string): {
    newState: GameState,
    action: 'flip' | 'match' | 'missMatch' | 'invalid'
}
```

The pure function decides *what happened*; the store decides *what to do about it over time*. That is what keeps all the scheduling concentrated in a single `switch` instead of spread across the screens.

### Choreography without nested callbacks

Opening a match is a four-beat sequence. Written with nested `setTimeout`, it becomes a staircase. [sequence.ts](src/shared/utils/sequence.ts) is a fluent builder where `wait` accumulates, `then` freezes the accumulated delay, and `run` converts relative delays into absolute ones:

```ts
// src/screens/game/useGame.viewModel.ts
const totalAnimationTime = getEntryAnimationDuration(cards.length, entryAnimationType)

createSequence()
    .wait(totalAnimationTime + 150).then(previewAllCards)
    .wait(2000).then(hideAllCards)
    .wait(300).then(startGame)
    .run()
```

It reads in the order it happens: the cards come in, they all open for two seconds, they close, and the clock starts.

### A deliberate persistence boundary

There are four Zustand stores, and only two are persisted. `auth` and `ranking` go to AsyncStorage because session and history should survive the app closing. `game` and `animation` stay in memory only — a match in progress should **not** be restored, and an animation in flight even less so.

### A trade-off taken on purpose

`GameCard` reacts to five different animations — entrance, press, miss, match, and fall — and stacks all five styles on the same wrapper:

```tsx
// src/screens/game/components/GameCard/GameCard.view.tsx
<Animated.View style={[
    styles.containerWrapper, entry.animatedStyle, animatedSelection,
    animatedShake, sucessAnimationStyle, timeoutAnimatiedStyle
]}>
```

All five return an object with a `transform` key, and React Native's style merge is shallow: the last one wins. In practice the styles **don't compose, they take turns** — it works because each hook holds identity values while idle and because the states are almost mutually exclusive in time, but a shake during a press doesn't add the two transforms together.

The correct alternative would be a single `useAnimatedStyle` in the ViewModel, composing every shared value into one `transform` array. The gain would be real composition; the cost, losing the one-hook-per-animation isolation that is precisely what makes that folder reusable. For an app this size the trade paid off, and it's on the roadmap.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) 18 or higher
- [Yarn](https://yarnpkg.com/) or npm
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) (iOS on macOS only)

There is no backend, no `.env`, and no account to create. The app is entirely local.

### Installation

```bash
git clone https://github.com/EnzoFelyx/memory-game-app.git
cd memory-game-app
yarn
```

### Running

```bash
yarn start     # development server
yarn android   # run on Android
yarn ios       # run on iOS (macOS only)
```

The project uses a native build (`expo run:*`), not Expo Go — Reanimated 4 depends on `react-native-worklets` being compiled into the app.

## Architecture in Detail

### The MVVM triad, in two variations

Every View is typed as `FC<ReturnType<typeof useXViewModel>>`. That holds for **15 out of 15** `*.view.tsx` files in the project, and the important detail is that the View imports the hook **only to extract the type** — it never calls it. There isn't a single duplicated props interface in the repository: the ViewModel's return value *is* the contract.

Where the container lives depends on what is being assembled.

**For screens, the route is the container.** `src/screens/<screen>/` holds only the View and the ViewModel; the route file wires them together:

```tsx
// src/app/(private)/game.tsx — the entire file
export default function Game() {
    const viewModel = useGameViewModel()

    return <GameView {...viewModel} />
}
```

**For components, `index.tsx` is the container** and also owns the public contract, which the ViewModel imports back:

```tsx
// src/screens/game/components/CountDown/index.tsx
export interface CountDownProps {
    visibleCounting: boolean
    handleCountdown: () => void
}

export const CountDown: FC<CountDownProps> = (params) => {
    const viewModel = useCountDownViewModel(params)

    return <CountDownOverlayView {...viewModel} />
}
```

Not every component gets a ViewModel. The rule that emerged is simple: anything with logic, derivation, or stateful animation gets one; anything that only composes markup — `CardGrid`, `ChallengerList`, `ListHeader` — stays a plain `FC<Props>`.

### Styling without a CSS framework

Unlike other projects of mine, there's no NativeWind here: it's `StyleSheet.create` in each View, over the tokens in [colors.ts](src/styles/colors.ts). Typography comes in through a ten-line component that aliases the native `Text`:

```tsx
// src/components/Text/index.tsx
export const Text: FC<TextProps> = (params) => {
    return (
        <RNText
            {...params}
            style={[{ fontFamily: "Baloo2_400Regular", color: colors.grayscale.gray100 }, params.style]}
        />
    )
}
```

The defaults stay overridable because `params.style` comes **after** in the array — the component sets a floor, not a rule.

### Declarative route protection

Expo Router 57 lets you make a route's *existence* conditional instead of redirecting away from it:

```tsx
// src/app/_layout.tsx
<Stack.Protected guard={!user}>
    <Stack.Screen name="(public)" />
</Stack.Protected>

<Stack.Protected guard={!!user}>
    <Stack.Screen name="(private)" />
</Stack.Protected>
```

The private route simply doesn't exist while there's no session. No effect, no imperative redirect, and no frame in which the protected screen ever mounts.

### The card flip is driven by state

Two faces stacked with `position: "absolute"` and `backfaceVisibility: "hidden"`, rotating through ranges offset by 180° from the same shared value:

```ts
// src/screens/game/components/GameCard/useGameCard.viewModel.ts
const rotation = useSharedValue(card.isFlipped ? 180 : 0)

const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }]
}))

const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` }]
}))

useEffect(() => {
    rotation.value = withSpring(card.isFlipped ? 180 : 0, { duration: 600 })
}, [card.isFlipped, rotation])
```

The point isn't the 3D effect, it's the direction of the flow: the `Pressable` **animates nothing**. It calls `selectCard(card.id)`, the service decides whether the move is legal, the state changes, and the `useEffect` reacts. A rejected card — because the game is still counting down, or because two cards are already face up — doesn't flip even for a single frame, and the animation layer needs no validation of its own.

### A choreographed entrance, drawn at random each match

Every match draws one of two entrance styles: `throw`, where the cards arrive from the bottom-right corner spinning with `withSpring`, or `deck`, where they slide up from below with `withTiming` and `Easing.out(cubic)`. The stagger is the card's index:

```ts
// src/animations/hooks/useCardEntryAnimation.ts
const delay = cardIndex * config.delayBetweenCards

translateX.value = ENTRY_ANIMATION_START_POSITIONS.throw.x   // teleports
translateY.value = ENTRY_ANIMATION_START_POSITIONS.throw.y
rotation.value = -30

translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.entryThrow))
```

The trick is assigning the raw position and reassigning it animated within the same tick: the card jumps off-screen and gets pulled back.

The drawn type lives in `animation.store` rather than in props because it has **two distinct consumers**: each of the twelve cards, which needs to know which animation to play, and the screen, which needs the same value to compute `getEntryAnimationDuration` and schedule the preview. Passing it down would mean prop drilling to twelve children and duplicating the draw.

<details>
<summary><b>Confetti: 40 pieces, one shared value each, zero re-renders</b></summary>

A win fires a burst of 40 pieces, followed by two pieces every 500ms. Each piece is `memo` with `useEffect([])` — it animates once on mount and never re-renders. All the motion derives from a single linear `progress`, interpolated inside the worklet:

```tsx
// src/components/Confetti/ConfettiPiece.tsx
const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-50, screenHeight + 100])

    const swingPhase = progress.value * Math.PI * 6
    const translateX = Math.sin(swingPhase) * swingAmount * swingDuration

    return {
        transform: [{ translateX }, { translateY }, { rotateZ: `${rotateZ.value}deg` }],
        opacity: interpolate(progress.value, [0, 0.05, 0.9, 1], [0, 1, 1, 0])
    }
})
```

Fall, a three-period sine swing, rotation, and fade all come out of arithmetic over the same value — not four competing animations.

The variety comes from a pure factory that randomizes seven axes per piece (color out of twelve, starting position, delay, duration, size, shape, swing amplitude and direction), so no two pieces fall alike. And since the continuous stream never stops on its own, the ViewModel runs a garbage collector that drops anything past six seconds of life:

```ts
// src/components/ConfettiEffect/useConfettiEffect.viewModel.ts
const cleanUp = useCallback(() => {
    const now = Date.now()
    const maxLifeTime = 6000
    setPieces((prev) => prev.filter((confetti) => now - confetti.createdAt < maxLifeTime))
}, [])
```

Without it the array would grow for as long as the modal stayed open.

</details>

<details>
<summary><b>Two-phase swipe-to-delete</b></summary>

Deleting a match from the history is two animations in sequence, not one. If the height collapsed along with the slide, the list would jump while the card was still visible:

```ts
// src/animations/hooks/useSwipeToDelete.ts
// phase 1: the card leaves the screen
translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, (finished) => {
    if (!finished) return

    // phase 2: only now does the height collapse → the next card moves up
    itemHeight.value = withTiming(0, { duration: 250 }, (collapsed) => {
        if (collapsed) runOnJS(onDelete)()
    })
})
```

`onDelete` only reaches React at the end of the second phase, so the item never disappears before the animation is done.

The height is **measured**, not estimated — an `onLayout` stores the card's real height, with a guard against re-measuring during the collapse. The gesture fires on distance **or** velocity (`< -100px` or `< -500px/s`), accepts leftward drag only (`Math.min(0, e.translationX)`), and uses `.activeOffsetX(-10)` so it doesn't steal the `FlatList`'s vertical scroll.

</details>

<details>
<summary><b>Three ways out, one modal</b></summary>

Leaving mid-match has three different paths, and each platform brought its own problem.

On Android, the back button and gesture are intercepted before the screen can leave:

```ts
// src/screens/game/useGame.viewModel.ts
usePreventRemove(status === "playing", handleOpenExitModal)
```

On iOS, the native edge swipe can't be intercepted — the screen leaves and gets yanked back, which looks terrible. The fix was turning it off during a match:

```ts
const isGameActive = status === "playing" || status === "paused"

useEffect(() => {
    navigation.setOptions({ gestureEnabled: !isGameActive })
}, [navigation, isGameActive])
```

But disabling a native gesture creates a new problem: users will still reach for it, and now nothing happens. `EdgeSwipeDetector` recovers the lost gesture as an *intent* to leave — an invisible 24px strip on the left edge, iOS only, opening the same modal:

```tsx
// src/screens/game/components/EdgeSwipeDetector/index.tsx
onMoveShouldSetPanResponder: (_, { dx, dy }) => dx > 5 && Math.abs(dx) > Math.abs(dy),
onPanResponderGrant: () => { triggered.current = false },
onPanResponderMove: (_, { dx }) => {
    if (!triggered.current && dx > SWIPE_THRESHOLD) {
        triggered.current = true
        onSwipeRef.current()
    }
},
```

The `triggered` ref guarantees one fire per gesture, and `onSwipeRef` keeps the callback fresh without rebuilding the `PanResponder` on every render.

All three paths converge on the same `ExitConfirmModal`, and opening the modal pauses the game — cancelling resumes exactly where it left off.

</details>

<details>
<summary><b>Exhaustive typing of difficulty</b></summary>

```ts
// src/shared/interfaces/difficulty.ts — the entire file
export type Difficulty = "Fácil" | "Médio" | "Difícil"
```

That one-line type (the literals are the Portuguese labels shown in the UI: Easy, Medium, Hard) is the key of three `Record<Difficulty, …>` maps across the project: `diffConfigs` (time limit), `diffColors` (color), and `difficultyWeight` (ranking weight). Adding a fourth level breaks compilation in all three places — there is no path where a new level slips through with a silent default.

</details>

<details>
<summary><b>Ranking by weight, not just by time</b></summary>

```ts
// src/shared/stores/ranking.store.ts
const difficultyWeight: Record<Difficulty, number> = { Difícil: 3, Médio: 2, Fácil: 1 }

scores: [...state.scores, score].sort((a, b) => {
    const diffA = difficultyWeight[a.difficulty] || 0
    const diffB = difficultyWeight[b.difficulty]

    if (diffB !== diffA) return diffB - diffA

    return a.time - b.time
}),
```

The sort is lexicographic on two levels: difficulty first, time only as a tiebreaker. A 14s win on Hard ranks above a 3s win on Easy — otherwise the leaderboard would reward whoever picked the easiest mode. The list is persisted already sorted, so a podium position is just the array index.

</details>

<details>
<summary><b>Typed palette and gradients</b></summary>

[colors.ts](src/styles/colors.ts) organizes the palette into five semantic groups — `grayscale`, `accent`, `semantic`, `feedback`, and `ranking` (podium gold, silver, and bronze) — plus seven gradient presets, all `as const` to preserve the literals.

The `gray700` background shows up coordinated in five places: the Expo Router theme, the `contentStyle` of all three stacks, the `GestureHandlerRootView`, the splash screen, and the Android adaptive icon — which removes the wrong-color flash on launch and during transitions.

</details>

## Project Structure

```
src/
├── app/              # Expo Router routes: (public) and (private) groups
├── screens/          # MVVM screens: Auth, Home, Game, History
├── animations/       # The motion layer
│   ├── config/       # Spring tokens, timings, and start positions
│   ├── utils/        # Total durations derived from the config
│   ├── store/        # Card entrance orchestration
│   └── hooks/        # Eleven hooks, all returning animatedStyle
├── components/       # Global components: Text, ConfettiEffect
├── shared/
│   ├── stores/       # Zustand: auth and ranking (persisted), game
│   ├── services/     # Pure rules: GameService and CardsService
│   ├── utils/        # Challenge catalog, sequence, confetti, level colors
│   └── interfaces/   # Domain types
├── styles/           # Palette and gradients
└── assets/           # Logos and card images
```

## Features

- **Local authentication** persisted in AsyncStorage, with logout
- **Protected routes** via `Stack.Protected`, with no imperative redirect
- **Nine challenges** from three themes and three difficulties
- **Countdown** and a two-second preview with every card face up
- **Choreographed entrance**, drawn between two styles each match
- **3D flip** with two faces and `backfaceVisibility`, driven by game state
- **Shake on a wrong pair**, with the logic synced to the animation's real duration
- **Cards falling** with random rotation and delay when time runs out
- **A timer that reacts**: changes color at 30s and pulses continuously at 10s
- **Confetti** on victory, with 40 pieces animated on the UI thread
- **History** with a podium, total matches, and average time
- **Two-phase swipe-to-delete**, with measured rather than estimated height
- **Guarded exit** during a match, covering the Android back and the iOS swipe

## Roadmap

Known gaps, in the order I intend to close them:

- **Tests** — the most glaring gap precisely because the design already laid the groundwork: `shuffle`, `selectCard`, `tick`, and `isGameCompleted` are pure functions that need no rendered tree to be verified.
- **Compose the `GameCard` transforms** into a single `useAnimatedStyle`, resolving the trade-off described above.
- **Record losses** — only wins make it into the history today, which makes the average time look better than it is.
- **Distributable build** — EAS Build producing an APK for direct download, so nobody has to clone the repo just to see the app run.

## Credits

Some of the card icons come from [Icons8](https://icons8.com/). The remaining logos are trademarks of their respective owners and appear here for illustrative purposes only, in an educational, non-commercial project.

The typeface is [Baloo 2](https://fonts.google.com/specimen/Baloo+2), distributed by Google Fonts under the SIL Open Font License.

## Author

**Enzo Felix** — Mobile Developer

[GitHub](https://github.com/EnzoFelyx) · [LinkedIn](https://www.linkedin.com/in/enzofelyx/) · [enzofelyx@gmail.com](mailto:enzofelyx@gmail.com)

---

Built from a [Rocketseat](https://www.rocketseat.com.br/) challenge.
