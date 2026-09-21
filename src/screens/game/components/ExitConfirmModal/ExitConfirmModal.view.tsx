import { Text } from "@/components/Text";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { FC } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useExitConfirmModalViewModel } from "./ExitConfirmModal.viewModel";

export const ExitConfirmModalView: FC<ReturnType<typeof useExitConfirmModalViewModel>> = ({
    animatedStyle,
    close,
    handleCancel,
    handleConfirm,
    visible
}) => {

    return (
        <Modal visible={visible} transparent>
            <BlurView style={style.overlay} intensity={10}>
                <Animated.View style={[animatedStyle, style.container]}>
                    <MaterialCommunityIcons name="alert-circle-check-outline" size={64} color={colors.semantic.warning} />
                    <Text style={style.title}>Sair do jogo?</Text>
                    <Text style={style.subtitle}>Seu progresso atual será perdido</Text>

                    <Pressable style={style.button} onPress={handleConfirm}>
                        <Text style={style.buttonText}>Sair</Text>
                    </Pressable>

                    <Pressable style={style.button} onPress={handleCancel}>
                        <Text style={style.buttonText}>Continuar jogando</Text>
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
})