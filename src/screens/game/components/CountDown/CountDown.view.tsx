import { Text } from "@/components/Text"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { useCountDownViewModel } from "./useCountDown.viewModel"

export const CountDownOverlayView: FC<ReturnType<typeof useCountDownViewModel>> = ({
    count,
    visibleCounting
}) => {

    if (!visibleCounting) return
    
    return (
        <View style={styles.overlay}>
            <View style={styles.contentWrapper}>
                <Text style={styles.countText}>{count}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        alignItems: "center",
        justifyContent: "center"
    },
    contentWrapper: {
        width: 160,
        height: 160,
        justifyContent: "center",
        alignItems: "center"
    },
    countText: {
        fontSize: 72,
        fontFamily: "Baloo2_800ExtraBold"
    }
})