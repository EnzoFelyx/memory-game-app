import { Dimensions, LayoutChangeEvent } from "react-native"
import { Gesture } from "react-native-gesture-handler"
import { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface Props {
    onDelete: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("screen")
const DELETE_THRESHOLD = -100
const SPEED_THRESHOLD = -500

export const useSwipeToDelete = ({ onDelete }: Props) => {
    const translateX = useSharedValue(0)
    const itemHeight = useSharedValue(0)   // altura atual (animável)
    const maxHeight = useSharedValue(0)    // altura real medida
    const isDeleting = useSharedValue(false)

    // mede a altura real do card em vez de chutar 60
    const onLayout = (e: LayoutChangeEvent) => {
        if (isDeleting.value) return
        maxHeight.value = e.nativeEvent.layout.height
        itemHeight.value = e.nativeEvent.layout.height
    }

    const panGesture = Gesture.Pan()
        .activeOffsetX(-10)
        .onUpdate((e) => {
            if (isDeleting.value) return
            translateX.value = Math.min(0, e.translationX)
        })
        .onEnd((e) => {
            const shouldDelete =
                translateX.value < DELETE_THRESHOLD || e.velocityX < SPEED_THRESHOLD

            if (!shouldDelete) {
                translateX.value = withTiming(0, { duration: 200 })
                return
            }

            isDeleting.value = true

            // 1ª fase: o card sai da tela
            translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, (finished) => {
                if (!finished) return

                // 2ª fase: só agora a altura colapsa → o próximo card sobe
                itemHeight.value = withTiming(0, { duration: 250 }, (collapsed) => {
                    if (collapsed) runOnJS(onDelete)()
                })
            })
        })

    const containerAnimatedStyle = useAnimatedStyle(() => ({
        height: isDeleting.value ? itemHeight.value : undefined,
        opacity: isDeleting.value
            ? interpolate(itemHeight.value, [0, maxHeight.value], [0, 1], Extrapolation.CLAMP)
            : 1,
        overflow: "hidden"
    }))

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }))

    const deleteIconStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateX.value, [-80, -40, 0], [1, 0.5, 0])
    }))

    return { containerAnimatedStyle, cardAnimatedStyle, deleteIconStyle, panGesture, onLayout }
}
