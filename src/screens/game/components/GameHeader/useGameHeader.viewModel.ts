import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { useGameStore } from "@/shared/stores/game.store"
import { colors } from "@/styles/colors"

export const useGameHeaderViewModel = () => {

    const { animatedStyles, onPressIn, onPressOut } = usePressAnimation({ scaleActive: 0.6, width: 48 })

    const { timeRemaing } = useGameStore()

    const minutes = Math.floor(timeRemaing / 60)
    const seconds = timeRemaing % 60

    const timeLimit = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

    const isLowTime = timeRemaing <= 30

    const isCriticalTime = timeRemaing <= 10

    const timerColor = isCriticalTime
        ? colors.feedback.danger
        : isLowTime
            ? colors.semantic.warning
            : colors.feedback.info

    return {
        animatedStyles,
        onPressIn,
        onPressOut,
        timeLimit,
        isLowTime,
        isCriticalTime,
        timerColor
    }
}