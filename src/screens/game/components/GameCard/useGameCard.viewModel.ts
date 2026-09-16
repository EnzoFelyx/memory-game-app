import { useGameStore } from "@/shared/stores/game.store"
import { StoreCard } from "@/shared/utils/challenger"
import { useEffect } from "react"
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

interface Props {
    card: StoreCard
}

export const useGameCardViewModel = ({ card }: Props) => {

    const { selectCard } = useGameStore()

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
            duration: 300
        })

    }, [card.isFlipped, rotation])


    return {
        card,
        backAnimatedStyle,
        frontAnimatedStyle,
        selectCard
    }
}