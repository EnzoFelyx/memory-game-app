import { useAuthStore } from "@/shared/stores/auth.store"

export const useHomeViewModel = () => {

    const { logout } = useAuthStore()

    return {
        logout
    }
}