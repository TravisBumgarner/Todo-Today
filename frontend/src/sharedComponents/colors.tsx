import { darken, lighten } from 'polished'

const colorFactory = (color: string) => ({
    base: color,
    darkest: darken(0.25, color),
    darken: darken(0.10, color),
    lighten: lighten(0.1, color),
    lightest: lighten(0.25, color),
})

const PRIMARY = colorFactory('#00fbff')
const SECONDARY = colorFactory('#5203ff')
const TERTIARY = colorFactory('#00ff7b')
const ALERT = colorFactory('#ff3f85')
const DISABLED = colorFactory('#1e1e1e')
const DARKNESS = colorFactory('#242424')

export default {
    PRIMARY,
    SECONDARY,
    TERTIARY,
    ALERT,
    DARKNESS,
    DISABLED
}
