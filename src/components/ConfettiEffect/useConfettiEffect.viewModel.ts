import { ConfettiConfig, createConfettiPiece } from "@/shared/utils/confetti"
import { useCallback, useEffect, useRef, useState } from "react"
import { ConfettiEffectParams } from "."

export const useConfettiEffectViewModel = ({
    active,
    burstCount = 40,
    continuousCount = 2,
    continuousInterval = 500
}: ConfettiEffectParams) => {

    const [pieces, setPieces] = useState<ConfettiConfig[]>([])

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const cleanUpRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const idCounterRef = useRef(0)

    const cleanUp = useCallback(() => {
        const now = Date.now()
        const maxLifeTime = 6000
        setPieces((prev) => prev.filter((confetti) => now - confetti.createdAt < maxLifeTime))
    }, [])

    useEffect(() => {
        if (active) {

            idCounterRef.current = 0

            const burstPieces: ConfettiConfig[] = Array.from({ length: burstCount }, () => {
                idCounterRef.current += 1
                return createConfettiPiece(idCounterRef.current, true)
            })

            setPieces(burstPieces)

            intervalRef.current = setInterval(() => {
                const newPieces: ConfettiConfig[] = Array.from({ length: continuousCount },
                    () => {
                        idCounterRef.current += 1
                        return createConfettiPiece(idCounterRef.current, false)
                    }
                )
                setPieces((prev) => [...prev, ...newPieces])
            }, continuousInterval)
            cleanUpRef.current = setInterval(cleanUp, 2000)
        } else {
            setPieces([])
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            if (cleanUpRef.current) {
                clearInterval(cleanUpRef.current)
                cleanUpRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (cleanUpRef.current) clearInterval(cleanUpRef.current)
        }


    }, [active, cleanUp, continuousCount, continuousInterval, burstCount])

    return {
        pieces,
        active
    }
}