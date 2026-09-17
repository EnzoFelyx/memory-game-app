import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { useGameStore } from "@/shared/stores/game.store"
import { colors } from "@/styles/colors"
import { useEffect } from "react"
import { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated"

interface Props {
    handleGoBack: () => void
}

export const useGameHeaderViewModel = ({ handleGoBack }: Props) => {

    const { animatedStyles, onPressIn, onPressOut } = usePressAnimation({ scaleActive: 0.6, width: 48 })

    const { timeRemaing, status } = useGameStore()

    const isGameReady = status !== "idle"

    const minutes = Math.floor(timeRemaing / 60)
    const seconds = timeRemaing % 60

    const timeLimit = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

    const isLowTime = isGameReady && timeRemaing <= 30

    const isCriticalTime = isGameReady && timeRemaing <= 10

    const timerColor = isCriticalTime
        ? colors.feedback.danger
        : isLowTime
            ? colors.semantic.warning
            : colors.feedback.info

    const scale = useSharedValue(1)

    const animatedTimerStyles = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))

    useEffect(() => {
        if (!isCriticalTime) {
            cancelAnimation(scale)
            scale.value = withTiming(1, { duration: 150 })
            return
        }

        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 300 }),
                withTiming(1, { duration: 300 }),
            ),
            -1,
            true,
        );
    }, [isCriticalTime])

    return {
        animatedStyles,
        onPressIn,
        onPressOut,
        timeLimit,
        isLowTime,
        isCriticalTime,
        timerColor,
        animatedTimerStyles,
        handleGoBack
    }
}