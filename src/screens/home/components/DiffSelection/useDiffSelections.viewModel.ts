import { useNumberAnimation } from "@/animations/hooks/useNumberAnimations"
import { Difficulty } from "@/shared/interfaces/difficulty"
import { diffConfigs } from "@/shared/utils/challenger"
import { useEffect } from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

const difficulties: Difficulty[] = ["Fácil", "Médio", "Difícil"]

export interface DiffSelectionsViewModelProps {
    setSelectedDiff: (difficulty: Difficulty) => void
    selectedDiff: Difficulty
}

export const useDiffSelectionsViewModel = ({ selectedDiff, setSelectedDiff }: DiffSelectionsViewModelProps) => {

    const diffConfig = diffConfigs[selectedDiff]

    const { animatedStyle: timeAnimatedStyle } = useNumberAnimation(diffConfig.estimedTime)

    const selectedIndex = difficulties.indexOf(selectedDiff)

    const translateX = useSharedValue(selectedIndex * 100)

    useEffect(() => {
        const newIndex = difficulties.indexOf(selectedDiff)
        translateX.value = withSpring(newIndex * 100, {
            damping: 65,
            stiffness: 400,
        })
    }, [selectedDiff, difficulties, translateX])

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: `${translateX.value}%` }]
    }))



    return {
        difficulties,
        selectedDiff,
        setSelectedDiff,
        animatedIndicatorStyle,
        diffConfig,
        timeAnimatedStyle
    }
}