import { CardItem, Challenge, StoreCard } from "../utils/challenger";

export class CardsService {

    //logica que embaralha os cards
    static shuffle(cards: StoreCard[]) {
        const shuffled = [...cards]
        for (let index = shuffled.length - 1; index > 0; index--) {
            const secondItem = Math.floor(Math.random() * (index + 1));

            [shuffled[index], shuffled[secondItem]] = [
                shuffled[secondItem],
                shuffled[index],
            ];
        }
        return shuffled
    }

    //link de pares
    static createCardPair(cardItem: CardItem, startIndex: number): [StoreCard, StoreCard] {
        return [
            {
                id: `${cardItem.name}-1-${startIndex}`,
                ...cardItem,
                isFlipped: false,
                isMatched: false
            },
            {
                id: `${cardItem.name}-2-${startIndex + 2}`,
                ...cardItem,
                isFlipped: false,
                isMatched: false
            }
        ]
    }

    //gera as cards
    static generateCards(challenge: Challenge): StoreCard[] {
        const cards: StoreCard[] = []
        challenge.cards.forEach((cardItem, index) => {
            const [card_1, card_2] = this.createCardPair(cardItem, index)
            cards.push(card_1, card_2)
        })
        return this.shuffle(cards)
    }
}