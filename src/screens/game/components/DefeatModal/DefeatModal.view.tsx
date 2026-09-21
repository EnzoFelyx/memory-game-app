import { Text } from "@/components/Text"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { FC } from "react"
import { Modal, Pressable, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { useDefeatModalViewMode } from "./useDefeatModal.viewMode"

export const DefeatModalView: FC<ReturnType<typeof useDefeatModalViewMode>> = ({
    onGoHome,
    onTryAgain,
    visible,
    animatedStyle
}) => {

    return (
        <Modal transparent visible={visible}>
            <BlurView intensity={10} tint="dark" style={style.overlay}>
                <Animated.View style={[animatedStyle, style.container]}>

                    <Pressable style={style.closeButton}>
                        <MaterialCommunityIcons name="close" color={colors.grayscale.gray100} size={16} />
                    </Pressable>

                    <MaterialCommunityIcons name="clock-outline" color={colors.semantic.error} size={29} />
                    <Text style={style.title}>Opss... seu tempo acabou!</Text>
                    <Text style={style.subtitle}>O tempo para finalizar o desafio terminou. Tentar novamente?</Text>

                    <Pressable style={style.button}>
                        <Text style={style.buttonText}>Jogar novamente</Text>
                    </Pressable>

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
    button: {
        paddingVertical: 16,
        alignItems: "center",
        width: "100%",
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.grayscale.gray400,
        marginTop: 24
    },
    buttonText: {
        fontSize: 16,
        color: colors.grayscale.white,
        fontFamily: "Baloo2_800ExtraBold"
    },
    closeButton: {
        position: "absolute",
        right: 22,
        top: 22
    }
})