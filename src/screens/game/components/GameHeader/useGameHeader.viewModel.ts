import { usePressAnimation } from "@/animations/hooks/usePressAnimation"

export const useGameHeaderViewModel = () => {

    const { animatedStyles, onPressIn, onPressOut } = usePressAnimation({ scaleActive: 0.6, width: 48 })

    return {
        animatedStyles,
        onPressIn,
        onPressOut
    }
}