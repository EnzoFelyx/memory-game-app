import { CardEntryAnimationType } from "@/animations/config/animation.config";
import { useAnimationStore } from "@/animations/store/animation.store";
import { getEntryAnimationDuration, getFallAnimationDuration } from "@/animations/utils/animation.utils";
import { Difficulty } from "@/shared/interfaces/difficulty";
import { useGameStore } from "@/shared/stores/game.store";
import { useRankingStore } from "@/shared/stores/ranking.store";
import { challengeTheme, diffConfigs } from "@/shared/utils/challenger";
import { createSequence } from "@/shared/utils/sequence";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "expo-router/native-stack";
import { ParamListBase, usePreventRemove } from "expo-router/react-navigation";
import { useCallback, useEffect, useState } from "react";

export const useGameViewModel = () => {

    const [visibleModal, setVisibleModal] = useState(false)

    const { addScore } = useRankingStore()

    const { difficulty, themeId } = useLocalSearchParams<{
        themeId: string;
        difficulty: Difficulty
    }>()

    const [showExitModal, setShowExitModal] = useState(false)

    const [showVictory, setShowVictory] = useState(false)

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    const { entryAnimationType, setShouldAnimate, setEntryAnimationType, shouldAnimate } = useAnimationStore()

    const { initGame, clearGame, status, previewAllCards, hideAllCards, startGame, cards, resetGame, pauseGame, resumeGame, timeElapsed, challenge } = useGameStore()

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

    const handleTryAgain = useCallback(() => {
        setVisibleModal(false)
        setShowVictory(false)
        setShouldAnimate(false)
        resetGame()

        createSequence().wait(300).then(() => setVisibleCounting(true)).run()
    }, [resetGame, setVisibleCounting, shouldAnimate])

    useEffect(() => {
        if (status === "finished") {
            setShowVictory(true)
            if (challenge) {
                addScore({
                    category: challenge.title,
                    difficulty: challenge.difficulty,
                    time: timeElapsed
                })
            }
        }
        if (status === 'timeout') {
            createSequence().wait(getFallAnimationDuration()).then(() => setVisibleModal(true)).run()
        }
    }, [status, challenge, addScore, timeElapsed])

    const handleExit = () => {
        clearGame()
        setVisibleModal(false)
        createSequence().wait(200).then(() => router.replace("/(private)/home")).run()
    }

    const handleOpenExitModal = useCallback(() => {
        if (status === "playing") {
            pauseGame()
            setShowExitModal(true)
        }
    }, [pauseGame, status])

    const isGameActive = status === "playing" || status === "paused"

    // desliga o swipe nativo do iOS durante a partida (senão a tela sai e é puxada de volta);
    // o swipe passa a ser detectado pelo EdgeSwipeDetector
    useEffect(() => {
        navigation.setOptions({ gestureEnabled: !isGameActive })
    }, [navigation, isGameActive])

    // intercepta o botão/gesto de voltar do Android durante a partida
    usePreventRemove(status === "playing", handleOpenExitModal)

    const handleConfirm = useCallback(() => {
        setShowExitModal(false)
        resetGame()
        router.replace("/(private)/home")
    }, [resetGame])

    const handleCancelExit = useCallback(() => {
        resumeGame()
        setShowExitModal(false)
    }, [resumeGame])

    return {
        selectedTheme,
        visibleCounting,
        handleCountdown,
        visibleModal,
        handleTryAgain,
        handleExit,
        showExitModal,
        handleOpenExitModal,
        isPlaying: status === "playing",
        handleConfirm,
        handleCancelExit,
        showVictory
    }
}