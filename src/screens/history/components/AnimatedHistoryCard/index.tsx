import { useListEntryAnimation } from "@/animations/hooks/useListEntryAnimation"
import { useSwipeToDelete } from "@/animations/hooks/useSwipeToDelete"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FC } from "react"
import { StyleSheet } from "react-native"
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
            <Animated.View style={[deleteIconStyle, style.deleteBg]}>
                <MaterialCommunityIcons name="trash-can-outline" color={colors.semantic.error} size={32} />
            </Animated.View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[cardAnimatedStyle]}>
                    <MatchCard match={match} />
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}

const style = StyleSheet.create({
    deleteBg: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 24,
    }
})