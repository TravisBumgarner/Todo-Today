import { EColorTheme, TColor } from 'sharedTypes'

const THEMES: Record<EColorTheme, TColor> = {
    RETRO_FUTURE: {
        FOREGROUND: '#7bc3ff',
        INTERACTION: '#7bff7f',
        WARNING: '#ff3f85',
        DISABLED: '#767676',
        BACKGROUND: '#1b1b1b',
    },
    NEWSPAPER: {
        FOREGROUND: '#ffffff',
        INTERACTION: '#ffffff',
        WARNING: '#aaaaaa',
        DISABLED: '#767676',
        BACKGROUND: '#1b1b1b',
    },
    BEACH: {
        FOREGROUND: '#EEB868',
        INTERACTION: '#49BEAA',
        WARNING: '#EF767A',
        DISABLED: '#d6d6d6',
        BACKGROUND: '#456990',
    },
    SUNSET: {
        FOREGROUND: '#FCBF49',
        INTERACTION: '#F77F00',
        WARNING: '#D62828',
        DISABLED: '#EAE2B7',
        BACKGROUND: '#003049',
    },
    UNDER_THE_SEA: {
        FOREGROUND: '#81ffff',
        INTERACTION: '#85FFC7',
        WARNING: '#ffd552',
        DISABLED: '#E6E6E6',
        BACKGROUND: '#39393A',
    },
    OUTERSPACE: {
        FOREGROUND: '#07BEB8',
        INTERACTION: '#98DFEA',
        WARNING: '#8F3985',
        DISABLED: '#a0a0a0',
        BACKGROUND: '#25283D',
    },
    SLATE: {
        FOREGROUND: '#84828F',
        INTERACTION: '#9491a7',
        WARNING: '#536271',
        DISABLED: '#3E4C5E',
        BACKGROUND: '#2C3D55',
    }
}

// const randomColor = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

// const shouldSurpriseMe = false

// const surpriseMe = () => {
//     return {
//         FOREGROUND: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
//         INTERACTION: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
//         WARNING: randomColor(['#793fff', '#3ff9ff', '#ff553f']),
//         DISABLED: randomColor(['#555555', '#23455a', '#632657']),
//         BACKGROUND: randomColor(['#1b1b1b', '#1b1b1b', '#1b1b1b']),
//     }

// }

export default THEMES
