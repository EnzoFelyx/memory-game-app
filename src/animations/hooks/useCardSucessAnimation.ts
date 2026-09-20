import { useCallback } from "react"
import { useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated"

export const useCardSucessAnimation = () => {

    const scale = useSharedValue(1)
    const opacity = useSharedValue(1)

    const playSucess = useCallback(() => {
        scale.value = withSequence(
            withTiming(1.1, { duration: 300 }),
            withTiming(1, { duration: 150 }),
            withDelay(150, withTiming(0.8, { duration: 300 }))
        )

        opacity.value = withDelay(600, withTiming(0, { duration: 300 }))
    }, [scale, opacity])

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }))

    return {
        animatedStyle,
        playSucess
    }

}
