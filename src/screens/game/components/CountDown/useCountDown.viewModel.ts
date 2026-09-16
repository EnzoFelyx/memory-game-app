import { useGameStore } from "@/shared/stores/game.store"
import { useEffect, useState } from "react"

export const useCountDownViewModel = () => {

    const [count, setCount] = useState(3)

    const { status } = useGameStore()
    const visibleCounting = Boolean(status === 'countdown')

    useEffect(() => {
        if (visibleCounting) {
            setCount(3)
            let currentCount = 3
            const countDown = setInterval(() => {
                if (currentCount > 1) {
                    currentCount--
                    setCount(currentCount)
                } else {
                    clearInterval(countDown)
                }
            }, 1000);
            return () => clearInterval(countDown)
        }
    }, [setCount, visibleCounting])

    return {
        count
    }
}