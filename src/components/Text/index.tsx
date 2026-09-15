import { colors } from "@/styles/colors"
import { FC } from "react"
import { Text as RNText, TextProps } from "react-native"

export const Text: FC<TextProps> = (params) => {

    return (
        <RNText {...params} style={[{ fontFamily: "Baloo2_400Regular", color: colors.grayscale.gray100 }, params.style]} />
    )
}