import { Difficulty } from "@/shared/interfaces/difficulty";
import { useGameStore } from "@/shared/stores/game.store";
import { challengeTheme, diffConfigs } from "@/shared/utils/challenger";
import { createSequence } from "@/shared/utils/sequence";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const useGameViewModel = () => {

    const { difficulty, themeId } = useLocalSearchParams<{
        themeId: string;
        difficulty: Difficulty
    }>()

    const { initGame, status, previewAllCards, hideAllCards, startGame } = useGameStore()

    const [visibleCounting, setVisibleCounting] = useState(Boolean(status === 'countdown'))

    const selectedTheme = challengeTheme.find(({ id }) => id === themeId)

    const handleCountdown = useCallback(() => {
        setVisibleCounting(false)
        createSequence()
            .wait(300)
            .then(previewAllCards)
            .wait(2000)
            .then(hideAllCards)
            .wait(300)
            .then(startGame)
            .run()
    }, [previewAllCards, hideAllCards, startGame])

    useEffect(() => {
        initGame({
            id: `${themeId}-${difficulty}`,
            title: selectedTheme?.title || '',
            cards: selectedTheme?.cards || [],
            difficulty,
            estimedTime: diffConfigs[difficulty].estimedTime,
            timeLimit: diffConfigs[difficulty].timeLimit,
        })
    }, [
        difficulty,
        initGame,
        selectedTheme?.cards,
        selectedTheme?.title,
        themeId,
    ])

    return {
        difficulty,
        selectedTheme,
        visibleCounting,
        handleCountdown
    }
}