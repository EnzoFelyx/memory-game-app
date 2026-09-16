import { Difficulty } from "@/shared/interfaces/difficulty"
import { router } from "expo-router"
import { useCallback, useState } from "react"

export const useHomeViewModel = () => {

    const [selectedDiff, setSelectedDiff] = useState<Difficulty>("Fácil")

    const handleSelectChallenge = useCallback((themeId: string) => {
        router.push({
            pathname: "/(private)/game",
            params: {
                themeId,
                difficulty: selectedDiff
            }
        })
    }, [selectedDiff])

    return {
        selectedDiff,
        setSelectedDiff,
        handleSelectChallenge
    }
}