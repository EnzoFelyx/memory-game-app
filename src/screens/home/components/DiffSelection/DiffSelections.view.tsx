import { Text } from "@/components/Text"
import { getDiffColor } from "@/shared/utils/diff"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { DiffIcon } from "./DiffIcon"
import { useDiffSelectionsViewModel } from "./useDiffSelections.viewModel"

export const DiffSelectionsView: FC<ReturnType<typeof useDiffSelectionsViewModel>> = ({
    difficulties,
    selectedDiff,
    setSelectedDiff
}) => {

    return (
        <View style={styles.difficultySection}>
            <View style={styles.difficultyHeader}>
                <Text>Dificuldade</Text>
                <View style={styles.timeIndicator}>
                    <MaterialCommunityIcons
                        name="clock-outline"
                        color={colors.accent.green}
                        size={16}
                    />
                    <Text>5 min</Text>
                </View>
            </View>

            <View style={styles.difficultyTabs}>
                {difficulties.map((diff, i) => (
                    <Pressable
                        onPress={() => setSelectedDiff(diff)}
                        style={[styles.difficultyTab]}
                        key={`diff-key${i}`}
                    >
                        <View style={styles.difficultyBadge}>
                            <DiffIcon
                                diff={diff}
                                color={getDiffColor(diff)}
                                inactiveColor={colors.grayscale.gray200}
                                isSelected={selectedDiff === diff}
                            />
                        </View>
                        <Text>{diff}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    difficultyTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 100,
        gap: 2,
        zIndex: 1,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 8,
        borderRadius: '50%',
    },
})