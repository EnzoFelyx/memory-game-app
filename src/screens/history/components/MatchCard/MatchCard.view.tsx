import { Text } from "@/components/Text"
import { DiffIcon } from "@/screens/home/components/DiffSelection/DiffIcon"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { useMatchCardViewModel } from "./useMatchCard.viewModel"

export const MatchCardView: FC<ReturnType<typeof useMatchCardViewModel>> = ({ match }) => {

    return (
        <View style={styles.container}>
            <View>
                <Text>{match.category}</Text>
                <Text>{match.position}</Text>
            </View>

            <View>
                <View>
                    <Text>{match.time}</Text>
                </View>

                <View>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={colors.grayscale.gray300} />
                    <Text>{match.time}</Text>
                </View>

                <View>
                    <DiffIcon
                        diff={match.difficulty}
                        inactiveColor={colors.grayscale.gray200}
                        color={colors.grayscale.gray200}
                        isSelected
                    />
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.grayscale.gray450,
        gap: 20,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.grayscale.gray400,
        marginBottom: 8
    }
})