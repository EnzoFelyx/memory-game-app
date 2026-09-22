import { HistoryView } from "@/screens/history/History.view"
import { useHistoryViewModel } from "@/screens/history/useHistory.viewModel"

export default function History() {

    const viewModel = useHistoryViewModel()

    return <HistoryView {...viewModel} />
}