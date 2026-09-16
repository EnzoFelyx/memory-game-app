import { Difficulty } from "@/shared/interfaces/difficulty";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Game() {

    const params = useLocalSearchParams<{ themeId: string; difficulty: Difficulty }>()

    console.log(params)

    return (
        <View>
            <Text>Tela de Game</Text>
        </View>
    )
}