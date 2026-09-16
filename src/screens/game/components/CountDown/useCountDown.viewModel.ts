import { useEffect, useState } from "react"
import { CountDownProps } from "."

export const useCountDownViewModel = ({ handleCountdown, visibleCounting }: CountDownProps) => {

    const [count, setCount] = useState(3)

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
                    handleCountdown()
                }
            }, 1000);
            return () => clearInterval(countDown)
        }
    }, [setCount, visibleCounting, handleCountdown])

    return {
        count,
        visibleCounting
    }
}