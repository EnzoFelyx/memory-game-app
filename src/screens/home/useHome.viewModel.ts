import { Difficulty } from "@/shared/interfaces/difficulty"
import { useAuthStore } from "@/shared/stores/auth.store"
import { useState } from "react"

export const useHomeViewModel = () => {

    const [selectedDiff, setSelectedDiff] = useState<Difficulty>("Fácil")

    const { logout } = useAuthStore()

    return {
        logout,
        selectedDiff,
        setSelectedDiff
    }
}