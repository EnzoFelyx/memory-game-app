import { useListEntryAnimation } from "@/animations/hooks/useListEntryAnimation"
import { FC } from "react"
import Animated from "react-native-reanimated"
import { FormattedMatch } from "../../useHistory.viewModel"
import { MatchCard } from "../MatchCard"

interface Props {
    match: FormattedMatch
    index: number
}

export const AnimatedHistoryCard: FC<Props> = ({ match, index }) => {

    const { animatedStyle } = useListEntryAnimation({ index })

    return (
        <Animated.View style={[animatedStyle]}>
            <MatchCard match={match} />
        </Animated.View>
    )
}