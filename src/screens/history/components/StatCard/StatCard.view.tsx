import { Text } from "@/components/Text";
import { colors } from "@/styles/colors";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useStatCardViewModel } from "./useStatCard.viewModel";

export const StatCardView: FC<ReturnType<typeof useStatCardViewModel>> = ({
    icon,
    label,
    value,
    valueCalor
}) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.valueContainer, {}]}>{value}</Text>
                <View>{icon}</View>
            </View>
            <Text>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        alignItems: "flex-start",
        borderWidth: 1,
        height: 94,
        paddingTop: 16,
        paddingRight: 20,
        paddingBottom: 16,
        paddingLeft: 16,
        borderColor: colors.grayscale.gray400
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center"
    },
    iconContainer: {
        marginBottom: 16,
    },
    valueContainer: {
        fontSize: 28,
        fontFamily: "Baloo2_800ExtraBold",
    },
    label: {
        fontSize: 14,
        color: colors.grayscale.gray200
    }
})