import { Easing, WithSpringConfig } from "react-native-reanimated";

export const SPRING_CONFIG = {
    press: {
        damping: 15,
        stiffness: 150,
    } satisfies WithSpringConfig,

    entryThrow: {
        damping: 27,
        stiffness: 180
    } satisfies WithSpringConfig,

    entryDeck: {
        damping: 22,
        stiffness: 140
    } satisfies WithSpringConfig,

    entryScale: {
        damping: 22,
        stiffness: 180
    } satisfies WithSpringConfig,

    selection: {
        damping: 15,
        stiffness: 300
    } satisfies WithSpringConfig,

    modal: {
        damping: 25,
        stiffness: 120,
        mass: 1
    } satisfies WithSpringConfig
}

export type CardEntryAnimationType = 'throw' | 'deck'

export const ENTRY_ANIMATION_START_POSITIONS = {
    throw: {
        x: 300,
        y: 600
    },
    deck: {
        x: 0,
        y: 400
    }
}

export const ANIMATION_TIMINGS = {
    entry: {
        throw: {
            duration: 400,
            delayBetweenCards: 50,
        },
        deck: {
            duration: 350,
            delayBetweenCards: 40,
        }
    },
    fall: {
        duration: 600,
        rotation: 300,
        opacityDuration: 200,
        opacityDelay: 400,
        maxRandomDelay: 200
    }
}

export const ANIMATION_EASING = {
    entry: Easing.out(Easing.cubic)
}

export const MISS_MATCH_TIMINGS = {
    // tempo que o par errado fica visível antes do shake começar
    peek: 300,
    // duração de cada passo do vai-e-vem do shake
    shakeStep: 50,
    // quantos ciclos de vai-e-vem depois do impulso inicial
    shakeCycles: 3,
}

// impulso inicial + (ida e volta * ciclos) + retorno ao centro
export const SHAKE_DURATION =
    MISS_MATCH_TIMINGS.shakeStep * (2 + MISS_MATCH_TIMINGS.shakeCycles * 2)