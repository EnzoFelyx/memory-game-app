import { Stack } from "expo-router";

import { colors } from "@/styles/colors";

export default function PublicLayout() {

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.grayscale.gray700 },
            }}
        >
            <Stack.Screen name="login" />
        </Stack>
    )
}
