import { Difficulty } from "@/shared/interfaces/difficulty"
import { useRankingStore } from "@/shared/stores/ranking.store"
import { format } from 'date-fns'

const formatTIme = (seconds: number): string => {
    const min = Math.floor(seconds / 60)
    const sec = Math.round(seconds % 60)
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export interface FormattedMatch {
    id: string
    category: string
    difficulty: Difficulty
    time: string
    position: number
    date: string
}

export const useHistoryViewModel = () => {

    const { scores, deleteScore } = useRankingStore()

    const matches: FormattedMatch[] = scores.map((score, index) => ({
        id: score.id,
        category: score.category,
        difficulty: score.difficulty,
        time: formatTIme(score.time),
        position: index + 1,
        date: format(score.date, "dd/MM/yy")
    }))

    const totalGames = scores.length

    const avarageTime = scores.length > 0 ? formatTIme(Math.round(scores.reduce((acc, score) => acc + score.time / scores.length, 0))) : "00:00"

    return {
        matches,
        avarageTime,
        totalGames,
        deleteScore
    }
}