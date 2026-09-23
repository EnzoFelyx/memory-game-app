import { StatCardView } from "./StatCard.view"
import { useStatCardViewModel } from "./useStatCard.viewModel"

export interface StatCardParams {
    icon: React.ReactNode
    value: string | null
    label: string
    variant?: "purple" | "cyan"
}

export const StatCard = (params: StatCardParams) => {

    const viewModel = useStatCardViewModel(params)

    return <StatCardView {...viewModel} />
}