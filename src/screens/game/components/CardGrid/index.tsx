import { useGameStore } from "@/shared/stores/game.store"
import { StyleSheet, View } from "react-native"
import { GameCard } from "../GameCard"

export const CardGrid = () => {

    const { cards } = useGameStore()

    console.log(cards)

    return (
        <View style={styles.grid}>
            {cards.map((card, index) => (
                <GameCard key={`card-${card.id}`} card={card} index={index} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    }
})