import { CountDownOverlayView } from "./CountDown.view"
import { useCountDownViewModel } from "./useCountDown.viewModel"

export const CountDown = () => {

    const viewModel = useCountDownViewModel()

    return <CountDownOverlayView {...viewModel} />
}