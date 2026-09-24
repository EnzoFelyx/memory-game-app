import { Text } from "@/components/Text";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useGameHeaderViewModel } from "./useGameHeader.viewModel";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const GameHeaderView: FC<ReturnType<typeof useGameHeaderViewModel>> = ({
    animatedStyles,
    onPressIn,
    onPressOut,
    timeLimit,
    isCriticalTime,
    isLowTime,
    timerColor,
    animatedTimerStyles,
    handleGoBack
}) => {

    return (
        <View style={styles.container}>
            <AnimatedPressable
                onPress={handleGoBack}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.backButton, animatedStyles]}
            >
                <MaterialCommunityIcons
                    name="chevron-left"
                    size={32}
                    color={colors.grayscale.gray100} />
            </AnimatedPressable>

            <Animated.View style={[styles.timerContainer, animatedTimerStyles]}>
                <MaterialCommunityIcons
                    name="clock-outline"
                    size={20}
                    color={timerColor}
                />
                <Text style={[
                    styles.timerText,
                    isCriticalTime && styles.timerTextCritical,
                    !isCriticalTime && isLowTime && styles.timerTextLow
                ]}>{timeLimit}</Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.grayscale.gray600,
        borderWidth: 1,
        borderColor: colors.grayscale.gray500
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.grayscale.gray600,
        borderWidth: 1,
        borderColor: colors.grayscale.gray500,
        width: 100,
        paddingLeft: 12,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8
    },
    timerText: {
        fontSize: 18,
        fontFamily: "Baloo2_700Bold",
        color: colors.feedback.info
    },
    timerTextLow: {
        color: colors.semantic.warning
    },
    timerTextCritical: {
        color: colors.feedback.danger
    }
})