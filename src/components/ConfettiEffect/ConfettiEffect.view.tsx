import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { ConfettiPiece } from "../Confetti/ConfettiPiece"
import { useConfettiEffectViewModel } from "./useConfettiEffect.viewModel"

export const ConfettiEffectView: FC<ReturnType<typeof useConfettiEffectViewModel>> = ({
    pieces,
    active
}) => {

    if (!active && pieces.length === 0) return null

    return (
        <View style={styles.container} pointerEvents="none">
            {pieces.map((confetti) => (
                <ConfettiPiece
                    color={confetti.color}
                    delay={confetti.delay}
                    duration={confetti.duration}
                    rotationSpeed={confetti.rotationSpeed}
                    size={confetti.size}
                    shape={confetti.shape}
                    startX={confetti.startX}
                    swingAmount={confetti.swingAmount}
                    swingDuration={confetti.swingDirection}
                    key={confetti.id}
                />
            ))}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
        zIndex: 1000,
    }
})