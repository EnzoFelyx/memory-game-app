import { useListEntryAnimation } from "@/animations/hooks/useListEntryAnimation"
import { useSwipeToDelete } from "@/animations/hooks/useSwipeToDelete"
import { FC } from "react"
import { GestureDetector } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { FormattedMatch } from "../../useHistory.viewModel"
import { MatchCard } from "../MatchCard"

interface Props {
    match: FormattedMatch
    index: number
    onDelete: () => void
}

export const AnimatedHistoryCard: FC<Props> = ({ match, index, onDelete }) => {

    const { animatedStyle } = useListEntryAnimation({ index })
    const { panGesture, containerAnimatedStyle, cardAnimatedStyle, deleteIconStyle, onLayout } = useSwipeToDelete({ onDelete })

    return (
        <Animated.View onLayout={onLayout} style={[animatedStyle, containerAnimatedStyle]}>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[cardAnimatedStyle]}>
                    <MatchCard match={match} />
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}