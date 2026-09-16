import { Difficulty } from "@/shared/interfaces/difficulty";
import { challengeTheme } from "@/shared/utils/challenger";
import { useLocalSearchParams } from "expo-router";

export const useGameViewModel = () => {

    const { difficulty, themeId } = useLocalSearchParams<{
        themeId: string;
        difficulty: Difficulty
    }>()

    const selectedTheme = challengeTheme.find(({ id }) => id === themeId)

    return {
        difficulty,
        selectedTheme
    }
}