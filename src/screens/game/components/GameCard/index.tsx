import { StoreCard } from "@/shared/utils/challenger"
import { FC } from "react"
import { GameCardView } from "./GameCard.view"
import { useGameCardViewModel } from "./useGameCard.viewModel"

interface Props {
    card: StoreCard
    index: number
}

export const GameCard: FC<Props> = ({ card }) => {

    const viewModel = useGameCardViewModel({ card })

    return <GameCardView {...viewModel} />
}