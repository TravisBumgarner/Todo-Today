import { EColorTheme, TColor } from 'sharedTypes'

const THEMES: Record<EColorTheme, TColor> = {
    FIRE_AND_ICE: {
        FOREGROUND_TEXT: '#7bc3ff',
        PRIMARY_BUTTON: '#7bff7f',
        ALERT_BUTTON: '#ff3f85',
        FOREGROUND_DISABLED: '#767676',
        BACKGROUND_PRIMARY: '#1b1b1b',
    },
    NEWSPAPER: {
        FOREGROUND_TEXT: '#ffffff',
        PRIMARY_BUTTON: '#ffffff',
        ALERT_BUTTON: '#aaaaaa',
        FOREGROUND_DISABLED: '#767676',
        BACKGROUND_PRIMARY: '#1b1b1b',
    },
    BEACH: {
        FOREGROUND_TEXT: '#EEB868',
        PRIMARY_BUTTON: '#49BEAA',
        ALERT_BUTTON: '#EF767A',
        FOREGROUND_DISABLED: '#d6d6d6',
        BACKGROUND_PRIMARY: '#456990',
    },
    SUNSET: {
        FOREGROUND_TEXT: '#FCBF49',
        PRIMARY_BUTTON: '#F77F00',
        ALERT_BUTTON: '#D62828',
        FOREGROUND_DISABLED: '#EAE2B7',
        BACKGROUND_PRIMARY: '#003049',
    }
}

// const randomColor = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

// const shouldSurpriseMe = false

// const surpriseMe = () => {
//     return {
//         FOREGROUND_TEXT: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
//         PRIMARY_BUTTON: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
//         ALERT_BUTTON: randomColor(['#793fff', '#3ff9ff', '#ff553f']),
//         FOREGROUND_DISABLED: randomColor(['#555555', '#23455a', '#632657']),
//         BACKGROUND_PRIMARY: randomColor(['#1b1b1b', '#1b1b1b', '#1b1b1b']),
//     }

// }

export default THEMES
