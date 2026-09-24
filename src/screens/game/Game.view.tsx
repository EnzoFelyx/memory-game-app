import { Text } from "@/components/Text"
import { colors } from "@/styles/colors"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CardGrid } from "./components/CardGrid"
import { CountDown } from "./components/CountDown"
import { DefeatModal } from "./components/DefeatModal"
import { EdgeSwipeDetector } from "./components/EdgeSwipeDetector"
import { ExitConfirmModal } from "./components/ExitConfirmModal"
import { GameHeader } from "./components/GameHeader"
import { VictoryModal } from "./components/VictoryModal"
import { useGameViewModel } from "./useGame.viewModel"

export const GameView: FC<ReturnType<typeof useGameViewModel>> = ({
    selectedTheme,
    visibleCounting,
    handleCountdown,
    visibleModal,
    handleExit,
    handleTryAgain,
    handleCancelExit,
    handleConfirm,
    handleOpenExitModal,
    isPlaying,
    showExitModal,
    showVictory,
    handleGoToHistory
}) => {

    return (
        <SafeAreaView style={styles.container}>
            <GameHeader handleGoBack={handleOpenExitModal} />
            <View style={styles.info}>
                <Text style={styles.title}>{selectedTheme?.title}</Text>
                <Text style={styles.subTitle}>Encontre todos os pares dentro do tempo!</Text>
                <CardGrid />
            </View>

            <EdgeSwipeDetector
                enabled={isPlaying}
                onSwipe={handleOpenExitModal}
            />

            <CountDown
                visibleCounting={visibleCounting}
                handleCountdown={handleCountdown}
            />

            <DefeatModal
                visible={visibleModal}
                onGoHome={handleExit}
                onTryAgain={handleTryAgain}
            />

            <ExitConfirmModal
                visible={showExitModal}
                onCancel={handleCancelExit}
                onConfirm={handleConfirm}
            />

            <VictoryModal
                visible={showVictory}
                onGoHistory={handleGoToHistory}
                onPlayAgain={handleTryAgain}
            />

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
        color: colors.grayscale.gray200,
        marginBottom: 24,
    }
})