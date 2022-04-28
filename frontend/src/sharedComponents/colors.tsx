let FOREGROUND_PRIMARY = '#7bc3ff'
let FOREGROUND_ALERT = '#ff3f85'
let FOREGROUND_DISABLED = '#767676'
let BACKGROUND_PRIMARY = '#1b1b1b'

const randomColor = (colors: string[]) => colors[Math.floor(Math.random() * colors.length)];

const shouldSurpriseMe = true

const surpriseMe = () => {
    return {
        FOREGROUND_PRIMARY: randomColor(['#7bff7f', '#7bc3ff', '#ffcc7b']),
        FOREGROUND_ALERT: randomColor(['#793fff', '#3ff9ff', '#ff553f']),
        FOREGROUND_DISABLED: randomColor(['#555555', '#23455a', '#632657']),
        BACKGROUND_PRIMARY: randomColor(['#1b1b1b', '#1b1b1b', '#1b1b1b']),
    }

}

export default shouldSurpriseMe ? surpriseMe() : {
    FOREGROUND_PRIMARY,
    BACKGROUND_PRIMARY,
    FOREGROUND_ALERT,
    FOREGROUND_DISABLED,
    
}
