import { FC } from "react"
import { CountDownOverlayView } from "./CountDown.view"
import { useCountDownViewModel } from "./useCountDown.viewModel"

export interface CountDownProps {
    visibleCounting: boolean
    handleCountdown: () => void
}

export const CountDown: FC<CountDownProps> = (params) => {

    const viewModel = useCountDownViewModel(params)

    return <CountDownOverlayView {...viewModel} />
}