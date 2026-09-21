import { useModalAnimation } from "@/animations/hooks/useModalAnimation"
import { DefeatModalParams } from "."

export const useDefeatModalViewMode = ({ onGoHome, onTryAgain, visible }: DefeatModalParams) => {

    const { animatedStyle } = useModalAnimation({ isVisible: visible })

    return {
        onGoHome,
        onTryAgain,
        visible,
        animatedStyle
    }
}