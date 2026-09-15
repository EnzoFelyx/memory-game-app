import { Difficulty } from "@/shared/interfaces/difficulty"
import { useEffect, useState } from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export const useDiffSelectionsViewModel = () => {

    const difficulties: Difficulty[] = ["Fácil", "Médio", "Difícil"]

    const [selectedDiff, setSelectedDiff] = useState<Difficulty>("Fácil")

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
        animatedIndicatorStyle
    }
}