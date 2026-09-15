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
}