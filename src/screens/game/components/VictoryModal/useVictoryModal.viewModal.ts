import { useModalAnimation } from "@/animations/hooks/useModalAnimation"
import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { VictoryModalParams } from "."

export const useVictoryModalViewMode = ({
    visible,
    onPlayAgain,
    onGoHistory
}: VictoryModalParams) => {

    const { animatedStyle, close } = useModalAnimation({ isVisible: visible })

    const handlePlayAgain = () => {
        close(onPlayAgain)
    }

    const handleGoHistory = () => {
        close(onGoHistory)
    }

    const {
        onPressIn: onPressInPlayAgain,
        animatedStyles: buttonAnimatedStylesPlayAgain,
        onPressOut: onPressOutPlayAgain
    } = usePressAnimation()

    const {
        onPressIn: onPressInHistory,
        animatedStyles: buttonAnimatedStylesHistory,
        onPressOut: onPressOutHistory
    } = usePressAnimation()

    return {
        visible,
        handleGoHistory,
        handlePlayAgain,
        animatedStyle,
        onPressInHistory,
        onPressInPlayAgain,
        onPressOutHistory,
        onPressOutPlayAgain,
        buttonAnimatedStylesHistory,
        buttonAnimatedStylesPlayAgain
    }
}