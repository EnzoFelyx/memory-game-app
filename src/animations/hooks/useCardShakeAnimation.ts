import { useCallback } from "react"
import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated"
import { MISS_MATCH_TIMINGS } from "../config/animation.config"

const SHAKE_DISTANCE = 10

export const useCardShakeAnimation = () => {

    const translateX = useSharedValue(0)

    const shakeCards = useCallback(() => {
        const duration = MISS_MATCH_TIMINGS.shakeStep

        translateX.value = withSequence(
            withTiming(SHAKE_DISTANCE, { duration }),
            withRepeat(withSequence(
                withTiming(-SHAKE_DISTANCE, { duration }),
                withTiming(SHAKE_DISTANCE, { duration }),
            ),
                MISS_MATCH_TIMINGS.shakeCycles,
                false,
            ),
            withTiming(0, { duration })
        )
    }, [translateX])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }))

    return {
        shakeCards,
        animatedStyle
    }
}