
import { HomeView } from "@/screens/home/Home.view"
import { useHomeViewModel } from "@/screens/home/useHome.viewModel"

export default function Home() {

    const viewModel = useHomeViewModel()

    return <HomeView {...viewModel} />
}