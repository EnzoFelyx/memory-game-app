import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { useDiffIconsViewModel } from "./useDiffIcons.viewModel"

export const DiffIconView: FC<ReturnType<typeof useDiffIconsViewModel>> = ({
    getBarStyle
}) => {

    return (
        <View style={styles.container}>
            {[1, 2, 3].map((i) => (
                <View key={i} style={[styles.bar, getBarStyle(i)]}>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 2,
        height: 16
    },
    bar: {
        width: 3,
        borderRadius: 2,
    }
})