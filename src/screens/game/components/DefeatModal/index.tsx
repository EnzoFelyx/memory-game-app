import { DefeatModalView } from "./DefeatModal.view"
import { useDefeatModalViewMode } from "./useDefeatModal.viewMode"

export interface DefeatModalParams {
    visible: boolean,
    onTryAgain: () => void
    onGoHome: () => void
}

export const DefeatModal = (params: DefeatModalParams) => {

    const viewMode = useDefeatModalViewMode(params)

    return <DefeatModalView {...viewMode} />
}