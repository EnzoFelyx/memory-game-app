import { Text } from "@/components/Text"
import { challengeTheme } from "@/shared/utils/challenger"
import { colors } from "@/styles/colors"
import { StyleSheet, View } from "react-native"
import { ChallengerCard } from "./components/ChallengerCard"

export const ChallengerList = () => {

    return (
        <View>
            <Text style={styles.section}>Desafios disponíveis</Text>
            {
                challengeTheme.map((challenge) => (
                    <ChallengerCard {...challenge} key={`challenger-id-${challenge.id}`} />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        fontSize: 16,
        color: colors.grayscale.gray200,
        marginBottom: 16
    }
})