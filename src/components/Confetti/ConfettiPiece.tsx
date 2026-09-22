import { ConfettiShapeType } from "@/shared/utils/confetti"
import { FC, useEffect } from "react"
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from "react-native"
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated"


interface Props {
    color: string
    startX: number
    delay: number
    duration: number
    size: number
    shape: ConfettiShapeType
    swingDuration: number
    swingAmount: number
    rotationSpeed: number
}

const confettiShapesType: (size: number, shape: ConfettiShapeType) => StyleProp<ViewStyle | undefined> = (size, shape) => {
    const shapeStyles = {
        circle: {
            borderRadius: size / 2
        },
        rectangle: {
            width: size * 0.4,
            height: size
        },
        square: {
            width: size,
            height: size
        }
    }
    return shapeStyles[shape]
}

const { height: screenHeight } = Dimensions.get("window")

export const ConfettiPiece: FC<Props> = ({
    color,
    delay,
    duration,
    rotationSpeed,
    shape,
    size,
    startX,
    swingAmount,
    swingDuration,
}) => {

    const progress = useSharedValue(0)

    const rotateZ = useSharedValue(0)

    useEffect(() => {
        progress.value = withDelay(delay, withTiming(1, { duration, easing: Easing.linear }))
    }, [])

    rotateZ.value = withDelay(delay, withTiming(360 * rotationSpeed * swingDuration, { duration, easing: Easing.linear }))

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(progress.value, [0, 1], [-50, screenHeight + 100])

        const swingPhase = progress.value * Math.PI * 6
        const translateX = Math.sin(swingPhase) * swingAmount * swingDuration

        return {
            transform: [
                { translateX },
                { translateY },
                { rotateZ: `${rotateZ.value}deg` }
            ],
            opacity: interpolate(progress.value, [0, 0.05, 0.9, 1], [0, 1, 1, 0])
        }
    })

    return (
        <Animated.View style={[styles.piece, animatedStyle, confettiShapesType(size, shape)]} />
    )
}

const styles = StyleSheet.create({
    piece: {
        position: "absolute",
        top: 0
    }
})