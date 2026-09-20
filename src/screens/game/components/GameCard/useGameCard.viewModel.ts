import { useCardEntryAnimation } from "@/animations/hooks/useCardEntryAnimation"
import { useCardSelectionAnimation } from "@/animations/hooks/useCardSelectionAnimation"
import { useCardShakeAnimation } from "@/animations/hooks/useCardShakeAnimation"
import { useCardSucessAnimation } from "@/animations/hooks/useCardSucessAnimation"
import { useCardTimeoutAnimation } from "@/animations/hooks/useCardTimeoutAnimation"
import { useGameStore } from "@/shared/stores/game.store"
import { StoreCard } from "@/shared/utils/challenger"
import { useEffect } from "react"
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

interface Props {
    card: StoreCard
    index: number
}

export const useGameCardViewModel = ({ card, index }: Props) => {

    const selectCard = useGameStore((state) => state.selectCard)

    const { status } = useGameStore()

    const { animatedStyle: sucessAnimationStyle, playSucess } = useCardSucessAnimation()

    const { animatedStyle: animatedSelection, onPressIn, onPressOut } = useCardSelectionAnimation()

    const { animatedStyle: animatedShake, shakeCards } = useCardShakeAnimation()

    const { animatedStyle: timeoutAnimatiedStyle, fallTriger, resetTrigger } = useCardTimeoutAnimation()

    const isMissMatched = useGameStore((state) => state.missMatchedIds.includes(card.id))

    const entry = useCardEntryAnimation({ cardIndex: index })

    const rotation = useSharedValue(card.isFlipped ? 180 : 0)

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{
            perspective: 1000
        }, {
            rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg`
        }]
    }))

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{
            perspective: 1000
        }, {
            rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg`
        }]
    }))

    useEffect(() => {
        rotation.value = withSpring(card.isFlipped ? 180 : 0, {
            duration: 600
        })

    }, [card.isFlipped, rotation])

    useEffect(() => {
        if (isMissMatched) {
            shakeCards()
        }
    }, [isMissMatched, shakeCards])

    useEffect(() => {
        if (card.isMatched) {
            playSucess()
        }
    }, [card.isMatched, playSucess])

    useEffect(() => {
        if (status === 'timeout' && !card.isMatched) {
            const randomDelay = Math.random() * 200
            fallTriger(randomDelay)
        }
    }, [status, card.isMatched])


    return {
        card,
        backAnimatedStyle,
        frontAnimatedStyle,
        selectCard,
        entry,
        animatedSelection,
        onPressIn,
        onPressOut,
        animatedShake,
        sucessAnimationStyle,
        timeoutAnimatiedStyle
    }
}