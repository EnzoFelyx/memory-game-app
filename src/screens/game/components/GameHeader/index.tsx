import { FC } from "react"
import { GameHeaderView } from "./GameHeader.view"
import { useGameHeaderViewModel } from "./useGameHeader.viewModel"

interface Props {
    handleGoBack: () => void
}

export const GameHeader: FC<Props> = ({ handleGoBack }) => {

    const viewModel = useGameHeaderViewModel({ handleGoBack })

    return <GameHeaderView {...viewModel} />
}