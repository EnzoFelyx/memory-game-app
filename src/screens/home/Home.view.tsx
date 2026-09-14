import { router } from "expo-router"
import { FC } from "react"
import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useHomeViewModel } from "./useHome.viewModel"

export const HomeView: FC<ReturnType<typeof useHomeViewModel>> = ({
    logout
}) => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Tela de home</Text>

            <TouchableOpacity
                onPress={() => {
                    logout()
                    router.replace("/(public)/login")
                }}
                style={{ backgroundColor: "red" }}
            >
                <Text>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}