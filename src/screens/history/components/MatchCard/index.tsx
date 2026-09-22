import { FormattedMatch } from "../../useHistory.viewModel"
import { MatchCardView } from "./MatchCard.view"
import { useMatchCardViewModel } from "./useMatchCard.viewModel"

export interface MatchCardParams {
    match: FormattedMatch
}

export const MatchCard = ({ match }: MatchCardParams) => {

    const viewModel = useMatchCardViewModel({ match })

    return <MatchCardView {...viewModel} />
}