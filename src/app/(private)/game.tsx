import { GameView } from "@/screens/game/Game.view";
import { useGameViewModel } from "@/screens/game/useGame.viewModel";

export default function Game() {

    const viewModel = useGameViewModel()

    return <GameView {...viewModel} />
}