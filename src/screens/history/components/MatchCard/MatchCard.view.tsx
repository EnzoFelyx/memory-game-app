import { Text } from "@/components/Text"
import { DiffIcon } from "@/screens/home/components/DiffSelection/DiffIcon"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { useMatchCardViewModel } from "./useMatchCard.viewModel"

export const MatchCardView: FC<ReturnType<typeof useMatchCardViewModel>> = ({ match }) => {

    return (
        <View collapsable={false} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{match.category}</Text>
                <Text style={styles.position}>{match.position} °</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.infoBage}>
                    <MaterialCommunityIcons name="calendar-outline" size={16} color={colors.grayscale.gray300} />
                    <Text style={styles.infoText}>{match.date}</Text>
                </View>

                <View style={styles.infoBage}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={colors.grayscale.gray300} />
                    <Text style={styles.infoText}>{match.time}</Text>
                </View>

                <View style={styles.infoBage}>
                    <DiffIcon
                        diff={match.difficulty}
                        inactiveColor={colors.grayscale.gray200}
                        color={colors.feedback.info}
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
        marginBottom: 16
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: 18,
        fontFamily: "Baloo2_800ExtraBold",
        color: colors.grayscale.gray100,
        width: "60%"
    },
    position: {
        fontSize: 24,
        fontFamily: "Baloo2_800ExtraBold",
        color: colors.accent.cyan
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    infoBage: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.grayscale.gray400,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        height: 32,
        gap: 6
    },
    infoText: {
        lineHeight: 20,
        fontFamily: "Baloo2_500Medium",
        color: colors.grayscale.gray200
    }
})