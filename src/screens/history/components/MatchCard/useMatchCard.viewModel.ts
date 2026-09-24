import { getDiffColor } from "@/shared/utils/diff"
import { colors } from "@/styles/colors"
import { MatchCardParams } from "."

export const useMatchCardViewModel = ({ match }: MatchCardParams) => {

    const positionColors = [
        colors.ranking.gold,
        colors.ranking.silver,
        colors.ranking.bronze
    ]

    const diffColor = getDiffColor(match.difficulty)

    return {
        match,
        positionColors,
        diffColor
    }
}