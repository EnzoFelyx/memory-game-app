import { usePressAnimation } from "@/animations/hooks/usePressAnimation"
import { Text } from "@/components/Text"
import { ChallengeTheme } from "@/shared/utils/challenger"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"

export const ChallengerCard: FC<ChallengeTheme> = ({
    cards,
    id,
    title,
    arrowColor,
    gradient
}) => {

    const pressAnimation = usePressAnimation()

    return (
        <LinearGradient
            colors={gradient as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <Animated.View style={pressAnimation.animatedStyles}>
                <Pressable
                    style={styles.content}
                    onPressIn={pressAnimation.onPressIn}
                    onPressOut={pressAnimation.onPressOut}
                >
                    <Text style={styles.title}>{title}</Text>
                    <View style={[styles.icon, { backgroundColor: arrowColor }]}>
                        <MaterialCommunityIcons name="arrow-right" size={24} />
                    </View>
                </Pressable>
            </Animated.View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden"
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
    },
    title: {
        fontSize: 18,
        color: colors.grayscale.gray100,
        fontFamily: "Baloo2_800ExtraBold",
        maxWidth: "50%"
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 16
    }
})