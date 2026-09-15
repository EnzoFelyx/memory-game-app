import { Challenge, GameState } from "../utils/challenger";
import { CardsService } from "./card.service";

export class GameService {
    //começa o jogo
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

    static startGame(gameState: GameState): GameState {
        return {
            ...gameState,
            status: 'playing',
            startedAt: new Date()
        }
    }

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

            return {
                newState: {
                    ...gameState,
                    cards: finalCards,
                    selectedCards: []
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
}