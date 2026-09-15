import { colors } from "@/styles/colors";
import { Difficulty } from "../interfaces/difficulty";

const diffColors: Record<Difficulty, string> = {
    "Fácil": colors.feedback.info,
    "Médio": colors.semantic.warning,
    "Difícil": colors.semantic.error
}

export const getDiffColor = (diff: Difficulty) => {
    return diffColors[diff]
}