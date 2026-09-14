import { useAuthStore } from "@/shared/stores/auth.store"
import { router } from "expo-router"
import { useState } from "react"

export const useAuthViewModel = () => {

    const [userName, setUserName] = useState("")

    const { setAuthenticated } = useAuthStore()

    const handleSubmmit = () => {
        setAuthenticated(userName)
        router.replace("/(private)/home")
    }

    return {
        userName,
        setUserName,
        handleSubmmit
    }
}