import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { Text } from "@/components/Text"
import { useAuthStore } from "@/shared/stores/auth.store"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const HomeHeader = () => {

    const { user } = useAuthStore()

    const animatedStyles = usePressAnimation({
        scaleActive: 0.8
    })

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                    <View>
                        <Text style={styles.greeting}>Bem vindo, {user?.name}!</Text>
                        <Text style={styles.subTitle}>Comece a jogar selecionando os desafios abaixo</Text>
                    </View>
                </View>

                <View style={{ width: 40 }}>
                    <AnimatedPressable
                        style={[styles.trophyContainer, animatedStyles.animatedStyles]}
                        onPress={() => router.push("/(private)/history")}
                        onPressIn={animatedStyles.onPressIn}
                        onPressOut={animatedStyles.onPressOut}
                    >
                        <MaterialCommunityIcons
                            name="trophy-outline"
                            size={18}
                            color={colors.accent.lightPurple}
                        />
                    </AnimatedPressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    headerLeft: {
        flex: 1,
        maxWidth: "60%",
    },
    greeting: {
        fontSize: 20,
        fontFamily: "Baloo2_700Bold",
        marginBottom: 8
    },
    subTitle: {
        fontSize: 16,
        color: colors.grayscale.gray200,
        lineHeight: 20,
    },
    trophyContainer: {
        width: 40,
        height: 40,
        borderColor: colors.grayscale.gray400,
        borderRadius: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.grayscale.gray450
    }
})