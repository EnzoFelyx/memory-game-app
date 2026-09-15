import { DiffSelectionsView } from "./DiffSelections.view"
import { useDiffSelectionsViewModel } from "./useDiffSelections.viewModel"

export const DiffSelections = () => {

    const viewModel = useDiffSelectionsViewModel()

    return <DiffSelectionsView {...viewModel} />
}