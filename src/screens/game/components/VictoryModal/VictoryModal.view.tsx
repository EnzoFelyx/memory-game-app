import { Text } from "@/components/Text"
import { colors, gradients } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { FC } from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"
import { useVictoryModalViewMode } from "./useVictoryModal.viewModal"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const VictoryModalView: FC<ReturnType<typeof useVictoryModalViewMode>> = ({
    visible,
    handleGoHistory,
    handlePlayAgain,
    animatedStyle,
    buttonAnimatedStylesHistory,
    buttonAnimatedStylesPlayAgain,
    onPressInHistory,
    onPressInPlayAgain,
    onPressOutHistory,
    onPressOutPlayAgain,
    timeString
}) => {

    return (
        <Modal
            transparent
            visible={visible}
        >
            <BlurView style={style.overlay}>
                <Animated.View style={[style.container, animatedStyle]}>
                    <MaterialCommunityIcons name="trophy-outline" color={colors.accent.lightPurple} size={64} />
                    <Text style={style.title}>Você concluiu o desafio em {timeString}</Text>

                    <View style={style.buttonGlow}>
                        <Animated.View style={[buttonAnimatedStylesPlayAgain]}>
                            <LinearGradient
                                style={style.buttonGradient}
                                colors={gradients.colorful}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Pressable
                                    onPressIn={onPressInPlayAgain}
                                    onPressOut={onPressOutPlayAgain}
                                    onPress={handlePlayAgain}

                                >
                                    <Text style={style.buttonText}>Jogar novamente</Text>
                                </Pressable>
                            </LinearGradient>
                        </Animated.View>
                    </View>
                    <AnimatedPressable
                        style={[buttonAnimatedStylesHistory, style.secundaryButton]}
                        onPressIn={onPressInHistory}
                        onPressOut={onPressOutHistory}
                        onPress={handleGoHistory}
                    >
                        <Text style={style.secundaryButtonText}>Ver histórico</Text>
                    </AnimatedPressable>


                </Animated.View>
            </BlurView>
        </Modal>
    )
}

const style = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: "rgba(0,0,0,0.50)"
    },
    container: {
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        padding: 24,
        borderRadius: 24,
        backgroundColor: colors.grayscale.gray450,
        borderWidth: 1,
        borderColor: colors.grayscale.gray400
    },
    title: {
        fontSize: 20,
        color: colors.grayscale.gray100,
        marginTop: 20,
        marginBottom: 12,
        paddingHorizontal: 24,
        textAlign: "center",
        fontFamily: "Baloo2_800ExtraBold"
    },
    subtitle: {
        fontSize: 16,
        color: colors.grayscale.gray200,
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 12
    },
    buttonGradient: {
        borderRadius: 100,
        width: "100%",
        marginBottom: 12,
        padding: 12,
        alignItems: "center"
    },
    buttonText: {
        fontSize: 16,
        color: colors.grayscale.white,
        fontFamily: "Baloo2_800ExtraBold"
    },
    closeButton: {
        position: "absolute",
        right: 22,
        top: 22,
        padding: 4,
    },
    secundaryButton: {
        padding: 12,
        width: "100%",
        alignItems: "center"
    },
    secundaryButtonText: {
        fontSize: 16,
        fontFamily: "Baloo2_800ExtraBold",
        color: colors.accent.lightPurple
    },
    buttonGlow: {
        shadowColor: colors.accent.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
        width: "100%"
    }
})