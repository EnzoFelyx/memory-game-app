import { CardEntryAnimationType } from "@/animations/config/animation.config";
import { useAnimationStore } from "@/animations/store/animation.store";
import { getEntryAnimationDuration } from "@/animations/utils/animation.utils";
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

    const { entryAnimationType, setShouldAnimate, setEntryAnimationType } = useAnimationStore()

    const { initGame, clearGame, status, previewAllCards, hideAllCards, startGame, cards } = useGameStore()

    const [visibleCounting, setVisibleCounting] = useState(true)

    const selectedTheme = challengeTheme.find(({ id }) => id === themeId)

    const handleCountdown = useCallback(() => {
        setVisibleCounting(false)
        setShouldAnimate(true)

        const totalAnimationTime = getEntryAnimationDuration(cards.length, entryAnimationType)

        createSequence()
            .wait(totalAnimationTime + 150)
            .then(previewAllCards)
            .wait(2000)
            .then(hideAllCards)
            .wait(300)
            .then(startGame)
            .run()
    }, [previewAllCards, hideAllCards, startGame, cards.length, entryAnimationType, setShouldAnimate])

    useEffect(() => {

        const theme = challengeTheme.find(({ id }) => id === themeId)

        if (theme && difficulty) {

            const animationTypes: CardEntryAnimationType[] = ['deck', 'throw']

            const randomEntryTypes = animationTypes[Math.floor(Math.random() * animationTypes.length)]

            setShouldAnimate(false)
            setEntryAnimationType(randomEntryTypes)

            initGame({
                id: `${themeId}-${difficulty}`,
                title: selectedTheme?.title || '',
                cards: selectedTheme?.cards || [],
                difficulty,
                estimedTime: diffConfigs[difficulty].estimedTime,
                timeLimit: diffConfigs[difficulty].timeLimit,
            })

            createSequence().
                wait(500)
                .then(() => setVisibleCounting(true))
                .run()
        }

        return () => {
            clearGame() // limpa ao sair da tela
            setShouldAnimate(false)
        }
    }, [
        clearGame,
        setShouldAnimate,
        setEntryAnimationType,
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