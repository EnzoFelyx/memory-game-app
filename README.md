# Memory Game App

Jogo da memória mobile em React Native, com uma camada de animação própria sobre Reanimated 4, arquitetura MVVM e regra de jogo em funções puras.

**Português** · [English](README.en.md)

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated-4.5-001A72)
![Zustand](https://img.shields.io/badge/Zustand-5.0-2B2B2B)

## Demonstração

[![Demonstração do Memory Game](https://img.youtube.com/vi/NkITKgMAV6U/maxresdefault.jpg)](https://youtu.be/NkITKgMAV6U)

O vídeo percorre o fluxo completo: login, escolha de tema e dificuldade, contagem regressiva, a entrada coreografada das cartas, o preview de dois segundos, o flip 3D durante a partida, o tremor no par errado, a queda das cartas quando o tempo acaba, o confetti da vitória e o histórico com exclusão por swipe.

## Sobre o Projeto

Jogo da memória com temas de tecnologia, onde cada partida cruza dois eixos independentes: o **tema** define quais cartas entram em jogo, a **dificuldade** define quanto tempo você tem.

- **Três temas** — Linguagens de Programação, Frameworks e Bibliotecas, Ferramentas de Desenvolvimento — com 6 pares cada
- **Três dificuldades** que alteram apenas o tempo limite: 60s, 30s e 15s sobre o mesmo grid de 12 cartas
- **Histórico persistido** com pódio, estatísticas agregadas e exclusão por swipe
- **Sem backend e sem variável de ambiente** — clonou, instalou, rodou

O projeto foi um exercício deliberado de **arquitetura de movimento**. Um jogo da memória é trivial como regra de negócio: comparar dois nomes e contar o tempo. O que o torna um jogo é o tempo entre as coisas — quanto a carta errada fica visível antes de tremer, quanto ela treme antes de desvirar, quando o modal de derrota pode aparecer sem atropelar a animação. Esse tempo costuma virar `setTimeout(…, 700)` espalhado pelo código. Aqui ele é tratado como uma camada com tokens próprios, e a regra do jogo **importa** essa camada em vez de adivinhar seus números.

## Stack

| Tecnologia | Versão | Papel no projeto |
|------------|--------|------------------|
| React Native | 0.86.3 | Base do aplicativo |
| Expo | ~57.0.22 | Plataforma e build |
| Expo Router | ~57.0.21 | Roteamento por arquivos, com rotas públicas e privadas |
| TypeScript | ~6.0.3 | Tipagem estática, incluindo o contrato entre View e ViewModel |
| Reanimated | 4.5.1 | Toda a animação, executada na UI thread |
| React Native Worklets | 0.10.1 | Ponte UI → JS (no Reanimated 4, `runOnJS` saiu do pacote principal) |
| Gesture Handler | ~2.32.0 | Gesto de swipe-to-delete no histórico |
| Zustand | ^5.0.15 | Estado de autenticação, ranking, partida e animação |
| AsyncStorage | ^3.1.1 | Persistência local de sessão e ranking |
| Expo Blur / Linear Gradient | ~57.0.3 / ~57.0.2 | Fundo desfocado dos modais e gradientes de carta e botão |
| date-fns | ^4.4.0 | Formatação de data no histórico |
| Baloo 2 (Google Fonts) | ^0.4.2 | Tipografia, em cinco pesos |

## Decisões Técnicas

### Animação como camada, não como detalhe de tela

A pasta [src/animations/](src/animations/) é uma biblioteca interna com quatro camadas — `config` (tokens), `utils` (durações derivadas), `store` (orquestração) e `hooks` (onze deles). Nenhum hook renderiza JSX: todos devolvem um `animatedStyle` e, quando a animação é imperativa, um gatilho (`shakeCards`, `playSucess`, `fallTriger`, `close`). Quem aplica o estilo é sempre um `Animated.View` na View.

As molas são tokens, do mesmo jeito que cores são tokens:

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

O `satisfies` valida cada preset contra `WithSpringConfig` sem alargar o tipo — o autocomplete continua conhecendo as chaves exatas.

### A regra do jogo importa a config de animação

Esta é a decisão central do projeto.

Reanimated roda na UI thread e **não avisa o JavaScript** quando uma sequência termina. Quando a lógica precisa reagir ao fim de uma animação, o caminho comum é encher o código de `runOnJS` — ou, pior, chutar um `setTimeout` com um número que ninguém sabe de onde veio.

A saída aqui foi tornar a duração **calculável**. O tremor do par errado é um `withSequence` com uma estrutura conhecida, então sua duração total é reconstruída algebricamente a partir dos mesmos tokens que a geram:

```ts
// src/animations/config/animation.config.ts
export const MISS_MATCH_TIMINGS = {
    // tempo que o par errado fica visível antes do shake começar
    peek: 300,
    // duração de cada passo do vai-e-vem do shake
    shakeStep: 50,
    // quantos ciclos de vai-e-vem depois do impulso inicial
    shakeCycles: 3,
}

// impulso inicial + (ida e volta * ciclos) + retorno ao centro
export const SHAKE_DURATION =
    MISS_MATCH_TIMINGS.shakeStep * (2 + MISS_MATCH_TIMINGS.shakeCycles * 2)
```

E a store da partida — que é lógica de negócio, não de apresentação — importa esses valores para agendar o desvirar:

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

O par errado fica 300ms visível, treme 400ms e desvira em 700ms — e nenhum desses três números está escrito como literal em lugar nenhum. Mudar `shakeCycles` de 3 para 5 reajusta a lógica do jogo sozinho.

O mesmo raciocínio cobre a cascata de entrada e a queda no timeout, em [animation.utils.ts](src/animations/utils/animation.utils.ts):

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

O resultado prático: `runOnJS` aparece **duas vezes** no projeto inteiro, e nas duas é genuinamente necessário — o fim de uma animação precisa mexer em estado do React.

### Store magra, service puro

`GameService` é uma classe de métodos estáticos puros: recebem estado, devolvem estado novo. Sem React, sem store, sem efeito colateral — testáveis sem renderizar nada.

A store é uma casca transacional. O padrão se repete dez vezes:

```ts
// src/shared/stores/game.store.ts
flagMissMatch: () => {
    const currentState = get()
    const newState = GameService.flagMissMatch(currentState)
    set(newState)
},
```

O que a store acrescenta é exatamente aquilo que uma função pura não pode ter: o `setInterval` do relógio e os `setTimeout` do fluxo. E a ponte entre os dois mundos é um discriminador — a função pura não só devolve o novo estado, ela **diz o que aconteceu**:

```ts
// src/shared/services/game.service.ts
static selectCard(gameState: GameState, cardId: string): {
    newState: GameState,
    action: 'flip' | 'match' | 'missMatch' | 'invalid'
}
```

A função pura decide *o que aconteceu*; a store decide *o que fazer a respeito ao longo do tempo*. É o que mantém todo o agendamento concentrado num único `switch`, em vez de espalhado pelas telas.

### Coreografia sem callbacks aninhados

Abrir uma partida é uma sequência de quatro tempos. Escrita com `setTimeout` aninhado, vira uma escada. [sequence.ts](src/shared/utils/sequence.ts) é um builder fluente onde `wait` acumula, `then` congela o acumulado e `run` converte os atrasos relativos em absolutos:

```ts
// src/screens/game/useGame.viewModel.ts
const totalAnimationTime = getEntryAnimationDuration(cards.length, entryAnimationType)

createSequence()
    .wait(totalAnimationTime + 150).then(previewAllCards)
    .wait(2000).then(hideAllCards)
    .wait(300).then(startGame)
    .run()
```

Lê-se na ordem em que acontece: as cartas entram, todas abrem por dois segundos, fecham, e o cronômetro começa.

### Uma fronteira de persistência deliberada

São quatro stores Zustand, e só duas são persistidas. `auth` e `ranking` vão para o AsyncStorage porque sessão e histórico devem sobreviver ao app fechar. `game` e `animation` ficam só em memória — uma partida em andamento **não** deve ser restaurada, e uma animação em curso menos ainda.

### Um trade-off assumido

O `GameCard` reage a cinco animações diferentes — entrada, toque, erro, acerto e queda — e empilha os cinco estilos no mesmo wrapper:

```tsx
// src/screens/game/components/GameCard/GameCard.view.tsx
<Animated.View style={[
    styles.containerWrapper, entry.animatedStyle, animatedSelection,
    animatedShake, sucessAnimationStyle, timeoutAnimatiedStyle
]}>
```

Todos os cinco devolvem um objeto com a chave `transform`, e o merge de estilos do React Native é raso: o último vence. Na prática os estilos **não compõem, eles se revezam** — funciona porque cada hook mantém valor-identidade quando ocioso e porque os estados são praticamente exclusivos no tempo, mas um tremor durante um toque não soma as duas transformações.

A alternativa correta seria um único `useAnimatedStyle` no ViewModel, compondo todos os shared values num só array de `transform`. O ganho seria composição real; o custo, perder o isolamento de um hook por animação, que é justamente o que torna essa pasta reutilizável. Para o tamanho deste app a troca compensou, e está na lista de próximos passos.

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) 18 ou superior
- [Yarn](https://yarnpkg.com/) ou npm
- [Android Studio](https://developer.android.com/studio) ou [Xcode](https://developer.apple.com/xcode/) (iOS apenas em macOS)

Não há backend, nem `.env`, nem conta para criar. O app é inteiramente local.

### Instalação

```bash
git clone https://github.com/EnzoFelyx/memory-game-app.git
cd memory-game-app
yarn
```

### Execução

```bash
yarn start     # servidor de desenvolvimento
yarn android   # executa no Android
yarn ios       # executa no iOS (apenas macOS)
```

O projeto usa build nativo (`expo run:*`), não Expo Go — o Reanimated 4 depende do `react-native-worklets` compilado junto com o app.

## Arquitetura em Detalhe

### A tríade MVVM, em duas variações

Toda View é tipada como `FC<ReturnType<typeof useXViewModel>>`. Isso vale para **15 dos 15** arquivos `*.view.tsx` do projeto, e o detalhe importante é que a View importa o hook **apenas para extrair o tipo** — nunca o chama. Não existe uma única interface de props duplicada no repositório: o retorno do ViewModel é o contrato.

Onde vive o container depende do que está sendo montado.

**Nas telas, a rota é o container.** `src/screens/<tela>/` contém só a View e o ViewModel; quem os liga é o arquivo de rota:

```tsx
// src/app/(private)/game.tsx — o arquivo inteiro
export default function Game() {
    const viewModel = useGameViewModel()

    return <GameView {...viewModel} />
}
```

**Nos componentes, o `index.tsx` é o container** e também o dono do contrato público, que o ViewModel importa de volta:

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

Nem todo componente tem ViewModel. A regra que emergiu é simples: quem tem lógica, derivação ou animação com estado ganha um; quem só compõe markup — `CardGrid`, `ChallengerList`, `ListHeader` — fica como `FC<Props>` puro.

### Estilo sem framework de CSS

Diferente de outros projetos meus, aqui não há NativeWind: é `StyleSheet.create` em cada View, sobre os tokens de [colors.ts](src/styles/colors.ts). A tipografia entra por um componente de dez linhas que aliasa o `Text` nativo:

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

Os defaults são sobrescrevíveis porque `params.style` vem **depois** no array — o componente dá um piso, não uma regra.

### Proteção de rota declarativa

O Expo Router 57 permite condicionar a existência da rota em vez de redirecionar para fora dela:

```tsx
// src/app/_layout.tsx
<Stack.Protected guard={!user}>
    <Stack.Screen name="(public)" />
</Stack.Protected>

<Stack.Protected guard={!!user}>
    <Stack.Screen name="(private)" />
</Stack.Protected>
```

A rota privada simplesmente não existe enquanto não há sessão. Não há efeito, nem redirecionamento imperativo, nem um frame em que a tela protegida chega a montar.

### O flip da carta é reativo ao estado

Duas faces sobrepostas em `position: "absolute"`, com `backfaceVisibility: "hidden"`, girando em faixas defasadas de 180° a partir do mesmo shared value:

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

O ponto não é o efeito 3D, é a direção do fluxo: o `Pressable` **não anima nada**. Ele chama `selectCard(card.id)`, o service decide se a jogada é válida, o estado muda, e o `useEffect` reage. Uma carta rejeitada — porque o jogo está em contagem regressiva, ou porque já há duas viradas — não vira nem por um frame, sem precisar de nenhuma verificação na camada de animação.

### Entrada coreografada, sorteada a cada partida

Cada partida sorteia um de dois estilos de entrada: `throw`, em que as cartas chegam do canto inferior direito girando com `withSpring`, ou `deck`, em que sobem de baixo com `withTiming` e `Easing.out(cubic)`. O escalonamento é o índice da carta:

```ts
// src/animations/hooks/useCardEntryAnimation.ts
const delay = cardIndex * config.delayBetweenCards

translateX.value = ENTRY_ANIMATION_START_POSITIONS.throw.x   // teleporta
translateY.value = ENTRY_ANIMATION_START_POSITIONS.throw.y
rotation.value = -30

translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.entryThrow))
```

O truque é atribuir a posição crua e reatribuir animado no mesmo tick: a carta salta para fora da tela e é puxada de volta.

O tipo sorteado vive na `animation.store` e não em props porque tem **dois consumidores distintos**: cada uma das doze cartas, que precisa saber qual animação tocar, e a tela, que precisa do mesmo valor para calcular `getEntryAnimationDuration` e agendar o preview. Passar por props significaria prop drilling para doze filhos e duplicar o sorteio.

<details>
<summary><b>Confetti: 40 peças, um shared value cada, zero re-render</b></summary>

A vitória dispara um estouro de 40 peças, seguido de duas peças a cada 500ms. Cada peça é `memo` com `useEffect([])` — anima uma vez ao montar e nunca mais re-renderiza. Todo o movimento deriva de um único `progress` linear, interpolado dentro do worklet:

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

Queda, balanço senoidal de três períodos, rotação e fade saem todos de matemática sobre o mesmo valor — não de quatro animações concorrentes.

A variação vem de uma factory pura que sorteia sete eixos por peça (cor entre doze, posição inicial, atraso, duração, tamanho, forma, amplitude e sentido do balanço), então nenhuma peça cai igual a outra. E como o fluxo contínuo nunca para sozinho, o ViewModel roda um coletor de lixo que descarta o que já passou de seis segundos de vida:

```ts
// src/components/ConfettiEffect/useConfettiEffect.viewModel.ts
const cleanUp = useCallback(() => {
    const now = Date.now()
    const maxLifeTime = 6000
    setPieces((prev) => prev.filter((confetti) => now - confetti.createdAt < maxLifeTime))
}, [])
```

Sem isso o array cresceria enquanto o modal estivesse aberto.

</details>

<details>
<summary><b>Swipe-to-delete em duas fases</b></summary>

Excluir uma partida do histórico são duas animações em sequência, não uma. Se a altura colapsasse junto com o deslize, a lista saltaria com o card ainda visível:

```ts
// src/animations/hooks/useSwipeToDelete.ts
// 1ª fase: o card sai da tela
translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, (finished) => {
    if (!finished) return

    // 2ª fase: só agora a altura colapsa → o próximo card sobe
    itemHeight.value = withTiming(0, { duration: 250 }, (collapsed) => {
        if (collapsed) runOnJS(onDelete)()
    })
})
```

O `onDelete` só chega ao React no fim da segunda fase, então o item nunca desaparece antes da animação terminar.

A altura é **medida**, não estimada — um `onLayout` guarda a altura real do card, com uma guarda para não remedir durante o colapso. O gesto dispara por distância **ou** por velocidade (`< -100px` ou `< -500px/s`), aceita apenas arrasto para a esquerda (`Math.min(0, e.translationX)`) e usa `.activeOffsetX(-10)` para não roubar o scroll vertical da `FlatList`.

</details>

<details>
<summary><b>Três formas de sair, um único modal</b></summary>

Sair no meio de uma partida tem três caminhos diferentes, e cada plataforma trouxe um problema próprio.

No Android, o botão e o gesto de voltar são interceptados antes de a tela sair:

```ts
// src/screens/game/useGame.viewModel.ts
usePreventRemove(status === "playing", handleOpenExitModal)
```

No iOS, o swipe de borda nativo não pode ser interceptado — a tela sai e é puxada de volta, o que fica péssimo. A solução foi desligá-lo durante a partida:

```ts
const isGameActive = status === "playing" || status === "paused"

useEffect(() => {
    navigation.setOptions({ gestureEnabled: !isGameActive })
}, [navigation, isGameActive])
```

Mas desligar um gesto nativo cria um problema novo: o usuário ainda vai tentar usá-lo, e agora nada acontece. O `EdgeSwipeDetector` recupera o gesto perdido como *intenção* de sair — uma faixa invisível de 24px na borda esquerda, só no iOS, que abre o mesmo modal:

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

A ref `triggered` garante um disparo por gesto, e `onSwipeRef` mantém o callback fresco sem recriar o `PanResponder` a cada render.

Os três caminhos convergem no mesmo `ExitConfirmModal`, e abrir o modal pausa o jogo — cancelar retoma exatamente de onde parou.

</details>

<details>
<summary><b>Tipagem exaustiva da dificuldade</b></summary>

```ts
// src/shared/interfaces/difficulty.ts — o arquivo inteiro
export type Difficulty = "Fácil" | "Médio" | "Difícil"
```

Esse tipo de uma linha é a chave de três `Record<Difficulty, …>` espalhados pelo projeto: `diffConfigs` (tempo limite), `diffColors` (cor) e `difficultyWeight` (peso no ranking). Adicionar um quarto nível quebra a compilação nos três lugares — não existe caminho em que um nível novo passe despercebido com um valor default silencioso.

</details>

<details>
<summary><b>Ranking por peso, não só por tempo</b></summary>

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

A ordenação é lexicográfica em dois níveis: dificuldade primeiro, tempo só como desempate. Uma vitória no Difícil em 14s fica acima de uma no Fácil em 3s — caso contrário o ranking premiaria justamente quem escolheu o modo mais fácil. A lista já é persistida ordenada, então a posição no pódio é o índice do array.

</details>

<details>
<summary><b>Paleta e gradientes tipados</b></summary>

[colors.ts](src/styles/colors.ts) organiza a paleta em cinco grupos semânticos — `grayscale`, `accent`, `semantic`, `feedback` e `ranking` (ouro, prata e bronze do pódio) — mais sete presets de gradiente, tudo `as const` para preservar os literais.

O fundo `gray700` aparece coordenado em cinco lugares: o tema do Expo Router, o `contentStyle` dos três stacks, o `GestureHandlerRootView`, a splash screen e o ícone adaptativo do Android — o que elimina o flash de cor errada na abertura e nas transições.

</details>

## Estrutura do Projeto

```
src/
├── app/              # Rotas do Expo Router: grupos (public) e (private)
├── screens/          # Telas em MVVM: Auth, Home, Game, History
├── animations/       # A camada de movimento
│   ├── config/       # Tokens de mola, timings e posições iniciais
│   ├── utils/        # Durações totais derivadas do config
│   ├── store/        # Orquestração da entrada das cartas
│   └── hooks/        # Onze hooks, todos devolvendo animatedStyle
├── components/       # Componentes globais: Text, ConfettiEffect
├── shared/
│   ├── stores/       # Zustand: auth e ranking (persistidas), game
│   ├── services/     # Regra pura: GameService e CardsService
│   ├── utils/        # Catálogo de desafios, sequence, confetti, cores de nível
│   └── interfaces/   # Tipos de domínio
├── styles/           # Paleta e gradientes
└── assets/           # Logos e imagens das cartas
```

## Funcionalidades

- **Autenticação local** persistida em AsyncStorage, com logout
- **Rotas protegidas** por `Stack.Protected`, sem redirecionamento imperativo
- **Nove desafios** a partir de três temas e três dificuldades
- **Contagem regressiva** e preview de dois segundos com todas as cartas abertas
- **Entrada coreografada** das cartas, sorteada entre dois estilos a cada partida
- **Flip 3D** com duas faces e `backfaceVisibility`, reativo ao estado do jogo
- **Tremor no par errado**, com a lógica sincronizada à duração real da animação
- **Queda das cartas** com rotação e atraso aleatórios quando o tempo acaba
- **Timer que reage**: muda de cor aos 30s e pulsa continuamente aos 10s
- **Confetti** na vitória, com 40 peças animadas na UI thread
- **Histórico** com pódio, total de partidas e tempo médio
- **Swipe-to-delete** em duas fases, com altura medida em vez de estimada
- **Saída protegida** durante a partida, cobrindo back do Android e swipe do iOS

## Próximos Passos

Lacunas conhecidas, na ordem em que pretendo resolvê-las:

- **Testes** — é a lacuna mais gritante justamente porque o desenho já preparou o terreno: `shuffle`, `selectCard`, `tick` e `isGameCompleted` são funções puras que não precisam de árvore renderizada para serem verificadas.
- **Compor os transforms do `GameCard`** num único `useAnimatedStyle`, resolvendo o trade-off descrito acima.
- **Registrar derrotas** — hoje só vitórias entram no histórico, o que torna a média de tempo otimista demais.
- **Build distribuível** — EAS Build gerando um APK para download direto, dispensando clonar o repositório para ver o app rodando.

## Autor

**Enzo Felix** — Mobile Developer

[GitHub](https://github.com/EnzoFelyx) · [LinkedIn](https://www.linkedin.com/in/enzofelyx/) · [enzofelyx@gmail.com](mailto:enzofelyx@gmail.com)

---

Desenvolvido a partir de um desafio da [Rocketseat](https://www.rocketseat.com.br/).
