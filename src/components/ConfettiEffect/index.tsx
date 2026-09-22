import { ConfettiEffectView } from "./ConfettiEffect.view"
import { useConfettiEffectViewModel } from "./useConfettiEffect.viewModel"

export interface ConfettiEffectParams {
    active?: boolean
    burstCount?: number
    continuousCount?: number
    continuousInterval?: number
}

export const ConfettiEffect = (params: ConfettiEffectParams) => {

    const viewModel = useConfettiEffectViewModel(params)

    return <ConfettiEffectView {...viewModel} />
}