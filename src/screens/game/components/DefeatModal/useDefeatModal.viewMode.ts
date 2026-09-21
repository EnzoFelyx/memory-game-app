import { useModalAnimation } from "@/animations/hooks/useModalAnimation"
import { DefeatModalParams } from "."

export const useDefeatModalViewMode = ({ onGoHome, onTryAgain, visible }: DefeatModalParams) => {

    const { animatedStyle, close } = useModalAnimation({ isVisible: visible })

    const handleTryAgain = () => {
        close(onTryAgain)
    }

    return {
        onGoHome,
        visible,
        animatedStyle,
        handleTryAgain
    }
}