import { ExitConfirmModalView } from "./ExitConfirmModal.view"
import { useExitConfirmModalViewModel } from "./ExitConfirmModal.viewModel"

export interface ExitConfirmModalParams {
    visible: boolean
    onConfirm: () => void
    onCancel: () => void
}

export const ExitConfirmModal = (params: ExitConfirmModalParams) => {

    const viewModel = useExitConfirmModalViewModel(params)

    return <ExitConfirmModalView {...viewModel} />
}