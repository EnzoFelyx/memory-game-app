import { Difficulty } from "@/shared/interfaces/difficulty"
import { FC } from "react"
import { DiffIconView } from "./DiffIcon.view"
import { useDiffIconsViewModel } from "./useDiffIcons.viewModel"

export interface DiffIconsProps {
    diff: Difficulty
    color: string
    isSelected: boolean
    inactiveColor: string
}

export const DiffIcon: FC<DiffIconsProps> = (props) => {

    const viewModel = useDiffIconsViewModel(props)

    return <DiffIconView {...viewModel} />
}