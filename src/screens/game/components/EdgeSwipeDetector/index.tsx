import { FC, useRef } from "react"
import { PanResponder, Platform, StyleSheet, View } from "react-native"

interface EdgeSwipeDetectorParams {
    enabled: boolean
    onSwipe: () => void
}

const EDGE_WIDTH = 24
const SWIPE_THRESHOLD = 40

// substitui o swipe nativo de voltar do iOS enquanto ele está desativado
export const EdgeSwipeDetector: FC<EdgeSwipeDetectorParams> = ({ enabled, onSwipe }) => {

    const onSwipeRef = useRef(onSwipe)
    onSwipeRef.current = onSwipe

    const triggered = useRef(false)

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, { dx, dy }) => dx > 5 && Math.abs(dx) > Math.abs(dy),
            onPanResponderGrant: () => {
                triggered.current = false
            },
            onPanResponderMove: (_, { dx }) => {
                if (!triggered.current && dx > SWIPE_THRESHOLD) {
                    triggered.current = true
                    onSwipeRef.current()
                }
            },
        })
    ).current

    if (!enabled || Platform.OS !== "ios") return null

    return <View style={styles.edge} {...panResponder.panHandlers} />
}

const styles = StyleSheet.create({
    edge: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: EDGE_WIDTH,
    }
})
