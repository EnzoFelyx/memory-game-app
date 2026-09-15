import { Text } from "@/components/Text"
import { Difficulty } from "@/shared/interfaces/difficulty"
import { getDiffColor } from "@/shared/utils/diff"
import { colors } from "@/styles/colors"
import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { DiffIcon } from "../DiffIcon"

interface Props {
    index: number
    difficulty: Difficulty
    setSelectedDiff: (Difficulty: Difficulty) => void
    SelectedDiff: Difficulty
}

export const DiffTab: FC<Props> = ({
    difficulty,
    index,
    setSelectedDiff,
    SelectedDiff
}) => {

    const isSelected = SelectedDiff === difficulty

    return (
        <Pressable
            onPress={() => setSelectedDiff(difficulty)}
            style={[styles.difficultyTab]}
            key={`diff-key${index}`}
        >
            <View style={styles.difficultyBadge}>
                <DiffIcon
                    diff={difficulty}
                    color={getDiffColor(difficulty)}
                    inactiveColor={colors.grayscale.gray200}
                    isSelected={isSelected}
                />
            </View>
            <Text
                style={{
                    ...styles.difficultyLabel,
                    fontFamily: isSelected ? "Baloo2_800ExtraBold" : "Baloo2_400Regular",
                    color: isSelected ? colors.grayscale.white : colors.grayscale.gray100
                }}>{difficulty}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    difficultyLabel: {
        fontSize: 16,
        color: colors.grayscale.gray200,
    },
    difficultyTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 100,
        gap: 12,
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