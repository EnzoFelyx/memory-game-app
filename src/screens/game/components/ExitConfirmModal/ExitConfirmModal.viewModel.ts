import { useModalAnimation } from "@/animations/hooks/useModalAnimation"
import { ExitConfirmModalParams } from "."

export const useExitConfirmModalViewModel = ({ onCancel, onConfirm, visible }: ExitConfirmModalParams) => {

    const { animatedStyle, close } = useModalAnimation({ isVisible: visible })

    const handleConfirm = () => {
        close(onConfirm)
    }

    const handleCancel = () => {
        close(onCancel)
    }

    return {
        handleCancel,
        handleConfirm,
        animatedStyle,
        close,
        visible
    }
}