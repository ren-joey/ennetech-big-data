import Swiper from 'swiper'

const swiperBinding = () => {
    const swiperElement = document.getElementsByClassName('swiper-container')
    if (swiperElement) {
        const mySwiper = new Swiper('.swiper-container', {
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        })
    }
}

export { swiperBinding as default }
export { swiperBinding }