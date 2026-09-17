import { create } from "zustand";
import { GameService } from "../services/game.service";
import { Challenge, GameResult, GameState } from "../utils/challenger";

interface GameStore extends GameState {
    initGame: (challenge: Challenge) => void
    startGame: () => void
    selectCard: (id: string) => void
    resetMissMatchedCards: () => void
    finished: () => GameResult | null
    tick: () => void
    _timerId: number | null
    startTimer: () => void
    stopTimer: () => void
    pauseGame: () => void
    resumeGame: () => void
    resetGame: () => void
    clearGame: () => void
    previewAllCards: () => void
    hideAllCards: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
    status: "idle",
    challenge: null,
    cards: [],
    selectedCards: [],
    timeElapsed: 0,
    startedAt: null,
    timeRemaing: 0,
    _timerId: null,

    initGame: (challenger: Challenge) => {
        const gameState = GameService.initializeGame(challenger)
        set(gameState)
    },
    finished: () => {
        const currentState = get()
        const result = GameService.finishGame(currentState)
        return result
    },
    resetMissMatchedCards: () => {
        const currentState = get()
        const newState = GameService.resetMissMatchedCards(currentState)
        set(newState)
    },
    selectCard: (cardId: string) => {
        const currentState = get()
        const { newState, action } = GameService.selectCard(currentState, cardId)
        set(newState)

        switch (action) {
            case "flip":
                break;

            case "invalid":
                break;
            case "missMatch":
                setTimeout(() => get().resetMissMatchedCards(), 1000);

            case "match":
                if (newState.status === "finished") {
                    setTimeout(() => get().finished(), 500)
                }
        }

    },
    startGame: () => {
        const currentState = get()
        const newState = GameService.startGame(currentState)
        set(newState)
    },
    tick: () => {
        const currentState = get()
        const newState = GameService.tick(currentState)
        set(newState)

        if (newState.status === 'timeout') {
            get().stopTimer()
        }
    },
    startTimer: () => {
        const currentState = get()
        if (currentState._timerId) {
            clearInterval(currentState._timerId)
        }
        const timerId = setInterval(() => {
            get().tick()
        }, 1000)

        set({ _timerId: timerId })
    },
    stopTimer: () => {
        const currentState = get()
        if (currentState._timerId) {
            clearInterval(currentState._timerId)
            set({ _timerId: null })
        }
    },
    pauseGame: () => {
        const currentState = get()
        const newState = GameService.pauseGame(currentState)
        set(newState)
        get().stopTimer()
    },
    resumeGame: () => {
        const currentState = get()
        const newState = GameService.resumeGame(currentState)
        set(newState)
        get().startTimer()
    },
    resetGame: () => {
        const currentState = get()
        if (!currentState.challenge) return

        const newState = GameService.resetGame(currentState.challenge)
        set(newState)
        get().stopTimer()
    },
    clearGame: () => {
        get().stopTimer()
        set({
            status: "idle",
            challenge: null,
            cards: [],
            selectedCards: [],
            timeElapsed: 0,
            startedAt: null,
            timeRemaing: 0,
            _timerId: null,
        })
    },
    previewAllCards: () => {
        const currentState = get()
        const flippedCards = GameService.previewAllCards(currentState.cards)
        set({ cards: flippedCards })
    },
    hideAllCards: () => {
        const currentState = get()
        const flippedCards = GameService.hideAllCards(currentState.cards)
        set({ cards: flippedCards })
    }
})) 