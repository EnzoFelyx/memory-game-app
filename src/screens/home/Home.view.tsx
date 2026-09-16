import { colors } from "@/styles/colors"
import { FC } from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChallengerList } from "./components/ChallengerList"
import { DiffSelections } from "./components/DiffSelection"
import { HomeHeader } from "./components/HomeHeader"
import { useHomeViewModel } from "./useHome.viewModel"

export const HomeView: FC<ReturnType<typeof useHomeViewModel>> = ({
    logout,
    selectedDiff,
    setSelectedDiff
}) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <HomeHeader />
                <DiffSelections selectedDiff={selectedDiff} setSelectedDiff={setSelectedDiff} />
                <ChallengerList />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.grayscale.gray700
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    }
})