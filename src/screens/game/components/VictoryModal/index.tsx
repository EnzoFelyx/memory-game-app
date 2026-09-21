import { useVictoryModalViewMode } from "./useVictoryModal.viewModal"
import { VictoryModalView } from "./VictoryModal.view"

export interface VictoryModalParams {
    visible: boolean
    onPlayAgain: () => void
    onGoHistory: () => void
}

export const VictoryModal = (params: VictoryModalParams) => {

    const viewMode = useVictoryModalViewMode(params)

    return <VictoryModalView {...viewMode} />
}