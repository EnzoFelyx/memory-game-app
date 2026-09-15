import { Difficulty } from "@/shared/interfaces/difficulty"
import { useState } from "react"

export const useDiffSelectionsViewModel = () => {

    const difficulties: Difficulty[] = ["Fácil", "Médio", "Difícil"]

    const [selectedDiff, setSelectedDiff] = useState<Difficulty>("Fácil")

    return {
        difficulties,
        selectedDiff,
        setSelectedDiff
    }
}