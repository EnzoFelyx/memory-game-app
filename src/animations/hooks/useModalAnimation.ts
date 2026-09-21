import { useEffect } from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { SPRING_CONFIG } from "../config/animation.config"

interface Props {
    isVisible: boolean
}

export const useModalAnimation = ({ isVisible }: Props) => {

    const translateY = useSharedValue(-1000)
    const opacity = useSharedValue(0)

    useEffect(() => {
        if (isVisible) {
            translateY.value = withSpring(0, SPRING_CONFIG.modal)
            opacity.value = withSpring(1, SPRING_CONFIG.modal)
        } else {
            translateY.value = -1000
            opacity.value = 0
        }
    }, [isVisible, translateY, opacity])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value
    }))

    return {
        animatedStyle
    }
}