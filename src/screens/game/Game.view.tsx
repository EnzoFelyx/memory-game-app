import { Text } from "@/components/Text"
import { colors } from "@/styles/colors"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CardGrid } from "./components/CardGrid"
import { CountDown } from "./components/CountDown"
import { GameHeader } from "./components/GameHeader"
import { useGameViewModel } from "./useGame.viewModel"

export const GameView: FC<ReturnType<typeof useGameViewModel>> = ({
    difficulty,
    selectedTheme,
    visibleCounting,
    handleCountdown
}) => {

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader />
            <View style={styles.info}>
                <Text style={styles.title}>{selectedTheme?.title}</Text>
                <Text style={styles.subTitle}>Encontre todos os pares dentro do tempo!</Text>
                <CardGrid />
            </View>
            <CountDown visibleCounting={visibleCounting} handleCountdown={handleCountdown} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayscale.gray700
    },
    title: {
        fontSize: 20,
        color: colors.grayscale.gray100,
        fontFamily: "Baloo2_800ExtraBold"
    },
    info: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24
    },
    subTitle: {
        fontSize: 16,
        color: colors.grayscale.gray200
    }
})