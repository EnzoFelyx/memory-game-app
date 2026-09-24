import { Stack } from "expo-router";

import { colors } from "@/styles/colors";

export default function PrivateLayout() {

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.grayscale.gray700 },
            }}
        >
            <Stack.Screen name="home" />
            <Stack.Screen name="game" />
            <Stack.Screen name="history" />
        </Stack>
    )
}
