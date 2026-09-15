import { DiffIconsProps } from "."



export const useDiffIconsViewModel = ({
    color,
    diff,
    inactiveColor,
    isSelected
}: DiffIconsProps) => {

    const barHeights = [6, 10, 14]

    const barCount = diff === "Fácil" ? 1 : diff === "Médio" ? 2 : 3

    const getBarStyle = (index: number) => ({
        height: barHeights[index - 1],
        backgroundColor: index <= barCount && isSelected ? color : inactiveColor
    })

    return {
        getBarStyle
    }
}