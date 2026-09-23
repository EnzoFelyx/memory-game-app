import { colors } from "@/styles/colors"
import { StatCardParams } from "."

export const useStatCardViewModel = ({
    icon,
    label,
    value,
    variant = "purple"
}: StatCardParams) => {

    const valueCalor = variant === "purple" ? colors.accent.lightPurple : colors.accent.cyan

    return {
        icon,
        label,
        value,
        valueCalor
    }
}