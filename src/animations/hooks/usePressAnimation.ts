import { useCallback } from "react"
import { useAnimatedStyle, useSharedValue, withSpring, WithSpringConfig } from "react-native-reanimated"
import { SPRING_CONFIG } from "../config/animation.config"

interface Props {
    scaleActive?: number
    springConfig?: WithSpringConfig
}

export const usePressAnimation = ({ scaleActive = 0.95, springConfig = SPRING_CONFIG.press }: Props = {}) => {

    const scale = useSharedValue(1)

    const onPressIn = useCallback(() => {
        scale.value = withSpring(scaleActive, springConfig)
    }, [scale, scaleActive, springConfig])

    const onPressOut = useCallback(() => {
        scale.value = withSpring(1, springConfig)
    }, [scale, springConfig])

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        width: "100%"
    }))

    return {
        onPressIn,
        animatedStyles,
        onPressOut
    }
}