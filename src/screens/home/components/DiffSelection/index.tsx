import { DiffSelectionsView } from "./DiffSelections.view"
import { DiffSelectionsViewModelProps, useDiffSelectionsViewModel } from "./useDiffSelections.viewModel"

export const DiffSelections = ({ selectedDiff, setSelectedDiff }: DiffSelectionsViewModelProps) => {

    const viewModel = useDiffSelectionsViewModel({ selectedDiff, setSelectedDiff })

    return <DiffSelectionsView {...viewModel} />
}