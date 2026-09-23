import { colors } from "@/styles/colors"
import { FC } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { useHistoryViewModel } from "./useHistory.viewModel"

import { SafeAreaView } from "react-native-safe-area-context"
import { ListHeader } from "./components/ListHeader"
import { MatchCard } from "./components/MatchCard"

export const HistoryView: FC<ReturnType<typeof useHistoryViewModel>> = ({
    matches,
    avarageTime,
    totalGames
}) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <FlatList
                    data={matches}
                    renderItem={({ item }) => (
                        <MatchCard match={item} />
                    )}
                    keyExtractor={({ id }) => `score-${id}`}
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24
                    }}
                    ListHeaderComponent={() => (
                        <ListHeader avarageTime={avarageTime} totalGames={totalGames} />
                    )}
                />
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
        alignItems: "center",
        justifyContent: "center"
    }
})