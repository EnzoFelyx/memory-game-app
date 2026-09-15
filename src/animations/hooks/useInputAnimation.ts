import { colors } from "@/styles/colors"
import { useCallback } from "react"
import { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, WithSpringConfig } from "react-native-reanimated"
import { SPRING_CONFIG } from "../config/animation.config"

interface Props {
    springConfig?: WithSpringConfig
}

export const useInputAnimation = ({ springConfig = SPRING_CONFIG.press }: Props = {}) => {

    const focus = useSharedValue(0)

    const onFocus = useCallback(() => {
        focus.value = withSpring(1, springConfig)
    }, [focus, springConfig])

    const onBlur = useCallback(() => {
        focus.value = withSpring(0, springConfig)
    }, [focus, springConfig])

    const animatedStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(focus.value, [0, 1], [colors.grayscale.gray400, colors.accent.cyan])
        return {
            borderColor,
            transform: [{ scale: 1 + focus.value * 0.02 }]
        }
    })

    return {
        onFocus,
        onBlur,
        animatedStyle
    }
}