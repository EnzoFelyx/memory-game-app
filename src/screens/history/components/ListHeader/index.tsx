import { Text } from "@/components/Text"
import { colors } from "@/styles/colors"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { StatCard } from "../StatCard"

interface Props {
    totalGames: number
    avarageTime: string
    onLogout: () => void
}

export const ListHeader: FC<Props> = ({ avarageTime, totalGames, onLogout }) => {
    return (
        <>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.push('/home')}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="arrow-left" color={colors.grayscale.gray100} size={24} />
                </Pressable>
                <Text style={styles.title}>Histórico de partida</Text>
                <Pressable
                    onPress={onLogout}
                    style={styles.backButton}
                >
                    <MaterialCommunityIcons name="logout" color={colors.accent.red} size={20} style={{marginLeft: 4}} />
                </Pressable>
            </View>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
                <StatCard
                    icon={<MaterialCommunityIcons name="gamepad-variant" size={28} color={colors.accent.lightPurple} />}
                    label="Total de jogos"
                    value={totalGames.toString()}
                    variant="purple"
                />
                <StatCard
                    icon={<MaterialCommunityIcons name="clock-outline" size={28} color={colors.accent.cyan} />}
                    label="Tempo médio"
                    value={avarageTime}
                    variant="cyan"
                />
            </View>

            <Text style={styles.rankingTitle}>Ranking</Text>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 30,
        justifyContent: "space-between"
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",

        borderWidth: 1,
        borderColor: colors.grayscale.gray400,
        zIndex: 2,
    },
    title: {
        fontFamily: "Baloo2_700Bold",
        fontSize: 20,
        color: colors.grayscale.gray100,
        position: "absolute",
        width: "100%",
        textAlign: "center",
        top: 21,
        zIndex: 1
    },
    rankingTitle: {
        color: colors.grayscale.gray300,
        fontSize: 16,
        marginBottom: 16,
        marginLeft: 4,
    }
})