import { Text } from "@/components/Text"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"
import { DiffTab } from "./DiffTab"
import { useDiffSelectionsViewModel } from "./useDiffSelections.viewModel"

export const DiffSelectionsView: FC<ReturnType<typeof useDiffSelectionsViewModel>> = ({
    difficulties,
    selectedDiff,
    setSelectedDiff,
    animatedIndicatorStyle,
    diffConfig,
    diffColor,
    timeAnimatedStyle
}) => {

    return (
        <View style={styles.difficultySection}>
            <View style={styles.difficultyHeader}>
                <Text>Dificuldade</Text>
                <Animated.View style={[styles.timeIndicator, timeAnimatedStyle]}>
                    <MaterialCommunityIcons
                        name="clock-outline"
                        color={diffColor}
                        size={16}
                    />
                    <Text>{diffConfig.estimedTime}</Text>
                </Animated.View>
            </View>

            <View style={styles.difficultyTabs}>
                <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
                {difficulties.map((difficulty, index) => (
                    <DiffTab
                        key={`difficulty-key-${difficulty}`}
                        difficulty={difficulty}
                        index={index}
                        SelectedDiff={selectedDiff}
                        setSelectedDiff={setSelectedDiff}
                    />
                ))}
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    difficultySection: {
        marginBottom: 24,
    },
    difficultyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    difficultyLabel: {
        fontSize: 16,
        color: colors.grayscale.gray200,
    },
    timeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grayscale.gray500,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    difficultyTabs: {
        flexDirection: 'row',
        borderRadius: 100,
        padding: 4,
        position: 'relative',
        borderColor: colors.grayscale.gray400,
        borderWidth: 1,
    },
    indicator: {
        position: 'absolute',
        width: '33.33%',
        top: 4,
        zIndex: 0,
        borderRadius: 100,
        left: 0,
        bottom: 4,
        backgroundColor: colors.grayscale.gray500,
        borderColor: colors.grayscale.gray400,
        borderWidth: 1,
        marginLeft: 4,
    },
})