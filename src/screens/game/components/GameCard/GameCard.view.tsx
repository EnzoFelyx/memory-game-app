import { Text } from "@/components/Text"
import { colors, gradients } from "@/styles/colors"
import { LinearGradient } from "expo-linear-gradient"
import { FC } from "react"
import { Image, Pressable, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { useGameCardViewModel } from "./useGameCard.viewModel"

export const GameCardView: FC<ReturnType<typeof useGameCardViewModel>> = ({
    card,
    backAnimatedStyle,
    frontAnimatedStyle,
    selectCard
}) => {

    return (
        <Animated.View style={[styles.containerWrapper]}>
            <Pressable style={styles.container} onPress={() => selectCard(card.id)}>
                <Animated.View style={styles.innerContainer}>

                    <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
                        <LinearGradient
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={gradients.card}

                        >
                            <Image
                                source={require("@/assets/Logo-Transparent.png")}
                                style={styles.logo}
                            />
                        </LinearGradient>
                    </Animated.View>

                    <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
                        <LinearGradient
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={gradients.card}

                        >
                            <Image
                                source={card.image}
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardText}>{card.name}</Text>
                        </LinearGradient>
                    </Animated.View>

                </Animated.View>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    containerWrapper: {
        width: "32%",
        height: 120,
        marginBottom: 8,
        borderColor: colors.grayscale.gray400,
        borderWidth: 1,
        borderRadius: 16
    },
    container: {
        flex: 1
    },
    innerContainer: {
        flex: 1,
    },
    cardFace: {
        position: "absolute",
        height: "100%",
        width: "100%",
        backfaceVisibility: "hidden"
    },
    cardGradient: {
        flex: 1,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    logo: {
        width: "50%",
        height: "50%",
    },
    cardImage: {
        height: 36,
        width: 36,
        borderRadius: 8
    },
    cardText: {
        color: colors.grayscale.gray100,
        fontSize: 16,
    }
})