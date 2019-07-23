import { headerBinding } from './headerBinding'
import { swiperBinding } from './swiperBinding'
import { ckeditBinding } from './ckeditBinding'

const init = () => {
    headerBinding()
    swiperBinding()
    ckeditBinding()
}

window.onload = init