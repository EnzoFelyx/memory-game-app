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
    onPressOut
}) => {

    return (
        <View style={styles.container}>
            <AnimatedPressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.backButton, animatedStyles]}
            >
                <MaterialCommunityIcons name="chevron-left" size={32} color={colors.grayscale.gray100} />
            </AnimatedPressable>

            <Animated.View style={styles.timerContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={colors.semantic.warning} />
                <Text>1</Text>
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
        paddingTop: 60,
        paddingBottom: 16,
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.grayscale.gray500
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.grayscale.gray500,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8
    }
})