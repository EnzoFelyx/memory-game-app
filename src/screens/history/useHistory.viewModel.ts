import { useRankingStore } from "@/shared/stores/ranking.store"

export const useHistoryViewModel = () => {

    const { scores } = useRankingStore()

    return {
        scores
    }
}