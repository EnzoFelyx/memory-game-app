import { Difficulty } from "@/shared/interfaces/difficulty";
import { useGameStore } from "@/shared/stores/game.store";
import { challengeTheme } from "@/shared/utils/challenger";
import { createSequence } from "@/shared/utils/sequence";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

export const useGameViewModel = () => {

    const { difficulty, themeId } = useLocalSearchParams<{
        themeId: string;
        difficulty: Difficulty
    }>()

    const { status, previewAllCards, hideAllCards, startGame } = useGameStore()

    const [visibleCounting, setVisibleCounting] = useState(Boolean(status === 'countdown'))

    const selectedTheme = challengeTheme.find(({ id }) => id === themeId)

    const handleCountdown = useCallback(() => {
        setVisibleCounting(false)
        createSequence()
            .wait(2000)
            .then(previewAllCards)
            .wait(2000)
            .then(hideAllCards)
            .wait(300)
            .then(startGame)
            .run()
    }, [previewAllCards, hideAllCards, startGame])

    return {
        difficulty,
        selectedTheme,
        visibleCounting,
        handleCountdown
    }
}