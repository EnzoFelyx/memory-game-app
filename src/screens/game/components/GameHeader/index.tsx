import { GameHeaderView } from "./GameHeader.view"
import { useGameHeaderViewModel } from "./useGameHeader.viewModel"

export const GameHeader = () => {

    const viewModel = useGameHeaderViewModel()

    return <GameHeaderView {...viewModel} />
}