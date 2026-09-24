import { colors } from "@/styles/colors"
import { MatchCardParams } from "."

export const useMatchCardViewModel = ({ match }: MatchCardParams) => {

    const positionColors = [
        colors.ranking.gold,
        colors.ranking.silver,
        colors.ranking.bronze
    ]
    return {
        match,
        positionColors
    }
}