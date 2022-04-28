let FOREGROUND_TEXT = '#7bc3ff'
let PRIMARY_BUTTON = '#7bff7f'
let ALERT_BUTTON = '#ff3f85'
let FOREGROUND_DISABLED = '#767676'
let BACKGROUND_PRIMARY = '#1b1b1b'

const randomColor = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

const shouldSurpriseMe = false

const surpriseMe = () => {
    return {
        FOREGROUND_TEXT: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
        PRIMARY_BUTTON: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
        ALERT_BUTTON: randomColor(['#793fff', '#3ff9ff', '#ff553f']),
        FOREGROUND_DISABLED: randomColor(['#555555', '#23455a', '#632657']),
        BACKGROUND_PRIMARY: randomColor(['#1b1b1b', '#1b1b1b', '#1b1b1b']),
    }

}

export default shouldSurpriseMe ? surpriseMe() : {
    FOREGROUND_TEXT,
    PRIMARY_BUTTON,
    BACKGROUND_PRIMARY,
    ALERT_BUTTON,
    FOREGROUND_DISABLED,
    
}
