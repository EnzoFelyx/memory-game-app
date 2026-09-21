import { ANIMATION_TIMINGS, CardEntryAnimationType } from "../config/animation.config";

export const getEntryAnimationDuration = (
    cardCount: number,
    animationType: CardEntryAnimationType
) => {
    const config = ANIMATION_TIMINGS.entry[animationType]
    const lastCardDelay = (cardCount - 1) * config.delayBetweenCards
    const springSettaleTime = animationType === 'throw' ? 800 : config.duration

    return lastCardDelay + springSettaleTime + 200
}

export const getFallAnimationDuration = () => {
    const config = ANIMATION_TIMINGS.fall
    return config.maxRandomDelay + config.duration + config.opacityDelay + config.opacityDuration + 200
}