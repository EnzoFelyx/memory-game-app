import { useInputAnimation } from "@/animations/hooks/useInputAnimation"
import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { colors, gradients } from "@/styles/colors"
import { LinearGradient } from "expo-linear-gradient"
import { FC } from "react"
import { Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import Animated from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuthViewModel } from "./useAuth.viewModel"

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export const LoginView: FC<ReturnType<typeof useAuthViewModel>> = ({
    handleSubmmit,
    setUserName,
    userName
}) => {

    const handleSubmitPressAnimation = usePressAnimation()
    const animatedTextInputAnimation = useInputAnimation()

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <View style={styles.contant}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("@/assets/Logo.png")}
                                resizeMode="contain"
                                style={styles.logo}
                            />
                        </View>

                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                memory game
                            </Text>

                            <Text style={styles.subtitle}>
                                Teste a sua memória enquanto aprende!
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            <AnimatedTextInput
                                style={[styles.input, animatedTextInputAnimation.animatedStyle]}
                                placeholder="Digite seu nome"
                                autoCapitalize="words"
                                returnKeyType="done"
                                onChangeText={setUserName}
                                textAlign={"center"}
                                placeholderTextColor={colors.grayscale.gray300}
                                onFocus={animatedTextInputAnimation.onFocus}
                                onBlur={animatedTextInputAnimation.onBlur}
                                value={userName}
                            />

                            <View style={styles.buttonGlow}>
                                <Animated.View
                                    style={handleSubmitPressAnimation.animatedStyles}
                                >
                                    <LinearGradient
                                        colors={gradients.colorful}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 2 }}
                                        style={styles.buttonGradient}
                                    >
                                        <TouchableOpacity
                                            onPressIn={handleSubmitPressAnimation.onPressIn}
                                            onPressOut={handleSubmitPressAnimation.onPressOut}
                                            onPress={handleSubmmit}
                                            style={styles.button}
                                        >
                                            <Text style={styles.buttonText}>Entrar</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                </Animated.View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView >
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayscale.gray700
    },
    contant: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    logoContainer: {
        marginBottom: 32
    },
    logo: {
        width: 71,
        height: 71
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 48,
    },
    title: {
        fontSize: 28,
        color: colors.grayscale.gray100,
        fontWeight: "bold",
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: colors.grayscale.gray200
    },
    formContainer: {
        width: "100%",
        gap: 16,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.grayscale.white
    },
    buttonGradient: {
        borderRadius: 50,
    },
    button: {
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonGlow: {
        shadowColor: colors.accent.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    input: {
        width: "100%",
        backgroundColor: colors.grayscale.gray500,
        borderRadius: 50,
        paddingHorizontal: 24,
        paddingVertical: 16,
        fontSize: 16,
        color: colors.grayscale.white,
        borderWidth: 1,
        borderColor: colors.grayscale.gray400
    }
})