import { Challenge, GameResult, GameState, StoreCard } from "../utils/challenger";
import { CardsService } from "./card.service";

export class GameService {
    //começa a contagem regressiva para começar o jogo
    static initializeGame(challenge: Challenge): GameState {
        const cards = CardsService.generateCards(challenge)

        return {
            status: "countdown",
            challenge,
            selectedCards: [],
            cards,
            timeRemaing: challenge.timeLimit,
            timeElapsed: 0,
            startedAt: null
        }
    }

    //começa o jogo
    static startGame(gameState: GameState): GameState {
        return {
            ...gameState,
            status: 'playing',
            startedAt: new Date()
        }
    }

    static isGameCompleted(cards: StoreCard[]): boolean {
        return cards.every((card) => card.isMatched)
    }

    //seleciona o card alvo
    static selectCard(gameState: GameState, cardId: string): {
        newState: GameState,
        action: 'flip' | 'match' | 'missMatch' | 'invalid'
    } {
        const { cards, selectedCards, status } = gameState

        if (status !== 'playing') return {
            newState: gameState,
            action: 'invalid'
        }

        const card = cards.find((card) => cardId === cardId)

        if (!card || card.isMatched || card.isFlipped) return {
            newState: gameState,
            action: 'invalid'
        }

        if (selectedCards.length >= 2) return {
            newState: gameState,
            action: 'invalid'
        }

        const updatedCardArray = cards.map((card) => {
            if (card.id === cardId) {
                return CardsService.flipCard(card, true)
            } else {
                return card
            }
        })

        const newSelectedCards = [...selectedCards, card]

        if (newSelectedCards.length === 1) {
            return {
                newState: {
                    ...gameState,
                    cards: updatedCardArray,
                    selectedCards: newSelectedCards
                },
                action: "flip"
            }
        }

        const [firstCard, secondCard] = newSelectedCards

        const isMatch = Boolean(firstCard.name === secondCard.name)

        if (isMatch) {
            const finalCards = updatedCardArray.map((card) => {
                if (card.id === firstCard.id || card.id === secondCard.id) {
                    return CardsService.markAsMatched(card)
                } else {
                    return card
                }
            })

            const isComplete = this.isGameCompleted(finalCards)

            return {
                newState: {
                    ...gameState,
                    cards: finalCards,
                    selectedCards: [],
                    status: isComplete ? "finished" : 'playing'
                },
                action: 'match'
            }
        } else {
            return {
                newState: {
                    ...gameState,
                    cards: updatedCardArray,
                    selectedCards: newSelectedCards,
                },
                action: 'missMatch'
            }
        }
    }

    //metodo para virar os cards novamente quando erra a match
    static resetMissMatchedCards(gameState: GameState) {

        const { cards, selectedCards } = gameState

        const updatedCardArray = cards.map((card) => {
            const isSelected = selectedCards.some(({ id }) => card.id === id)

            if (isSelected && !card.isMatched) {
                return CardsService.flipCard(card, false)
            } else {
                return card
            }
        })

        return {
            ...gameState,
            cards: updatedCardArray,
            selectedCards: []
        }
    }

    //pausa o jogo
    static pauseGame(gameState: GameState): GameState {
        return {
            ...gameState,
            status: 'paused'
        }
    }

    //continua o jogo dentro do tempo limite
    static resumeGame(gameState: GameState): GameState {
        return {
            ...gameState,
            status: 'playing'
        }
    }

    //reseta o jogo 
    static resetGame(challenge: Challenge): GameState {
        return this.initializeGame(challenge)
    }

    //clock do jogo, tempo restante e tempo percorrido para fazer o desafio
    static tick(gameState: GameState): GameState {
        if (gameState.status !== 'playing') {
            return gameState
        }

        const timeRemaing = Math.max(0, gameState.timeRemaing - 1)
        const timeElapsed = gameState.timeElapsed + 1

        return {
            ...gameState,
            timeElapsed,
            timeRemaing,
            status: timeRemaing === 0 ? "timeout" : gameState.status
        }
    }

    //função que é chamada quando o jogo acaba e mostra os resultados
    static finishGame(gameState: GameState): GameResult | null {
        if (!gameState.challenge) {
            return null
        }
        return {
            completed: Boolean(gameState.status === 'finished'),
            timeElapsed: gameState.timeElapsed,
            challenge: gameState.challenge
        }
    }
    
    //mostra todas as cards
    static previewAllCards(cards: StoreCard[]): StoreCard[] {
        return cards.map((card) => CardsService.flipCard(card, true))
    }

    //esconde todas as cards
    static hideAllCards(cards: StoreCard[]): StoreCard[] {
        return cards.map((card) => CardsService.flipCard(card, false))
    }
}