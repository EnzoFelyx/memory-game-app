import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { SPRING_CONFIG } from "../config/animation.config"

export const useCardSelectionAnimation = () => {

    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))

    const onPressIn = () => {
        scale.value = withSpring(1.1, SPRING_CONFIG.selection)
    }

    const onPressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG.selection)
    }

    return {
        animatedStyle,
        onPressIn,
        onPressOut
    }
}