import { create } from "zustand";
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

    initGame: () => { },
    finished: () => null,
    resetMissMatchedCards: () => { },
    selectCard: (cardId: string) => { },
    startGame: () => { },
    tick: () => { },
    startTimer: () => { },
    stopTimer: () => { },
    pauseGame: () => { },
    resumeGame: () => { },
    resetGame: () => { },
    clearGame: () => { },
    previewAllCards: () => { },
    hideAllCards: () => { }
})) 