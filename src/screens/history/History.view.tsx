import { colors } from "@/styles/colors"
import { FC } from "react"
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { useHistoryViewModel } from "./useHistory.viewModel"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { MatchCard } from "./components/MatchCard"

export const HistoryView: FC<ReturnType<typeof useHistoryViewModel>> = ({
    matches,
    avarageTime,
    totalGames
}) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.push('/home')}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" color={colors.grayscale.gray100} size={24} />
                </Pressable>
                <Text style={styles.title}>Histórico de partidat</Text>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={matches}
                    renderItem={({ item }) => (
                        <MatchCard match={item} />
                    )}
                    keyExtractor={({ id }) => `score-${id}`}
                    style={{ width: "100%" }}
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
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 30
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: colors.grayscale.gray400
    },
    title: {
        fontFamily: "Baloo2_700Bold",
        fontSize: 20,
        color: colors.grayscale.gray100,
        position: "absolute",
        width: "100%",
        right: 24,
        textAlign: "center",
        paddingTop: 30
    }

})