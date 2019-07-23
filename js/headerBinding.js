import $ from 'jquery'

const headerBinding = () => {
    const navSelects = $('.nav-select')
    navSelects.slideUp(0);
    [...navSelects].forEach((node) => {
        const navSelect = $(node)
        navSelect.parent()
            .on('mouseenter', () => {
                navSelect.stop(true, false).slideDown(200)
            })
            .on('mouseleave', () => {
                navSelect.stop(true, false).slideUp(200)
            })
    })

    const yearSelections = $('.select-year')
    if (yearSelections) {
        let optionsHtml = '<option disabled selected>請選擇西元出生年</option>'
        for(let i = 1900; i < 2019; i++) {
            optionsHtml += `<option>${i}年</option>`
        }

        [...yearSelections].forEach((select) => {
            $(select).html(optionsHtml)
        })
    }

    const wrapper = $('#wrapper')
    const login = $('#login')
    const register = $('#register')
    const loginButton = $('#login_button')
    loginButton.on('click', () => {
        login.fadeIn()
        wrapper.addClass('fixed')
    })

    const loginCancelButton = $('#login_cancel_button')
    loginCancelButton.on('click', () => {
        login.fadeOut()
        wrapper.removeClass('fixed')
    })

    const loginConfirmButton = $('#login_confirm_button')
    loginConfirmButton.on('click', () => {
        login.fadeOut()
    })

    const registerButton = $('#register_button')
    registerButton.on('click', () => {
        login.fadeOut()
        register.fadeIn()
    })

    const registerCancelButton = $('#register_cancel_button')
    registerCancelButton.on('click', () => {
        login.fadeIn()
        register.fadeOut()
    })

    const termButton = $('#term_button')
    const termCloseButton = $('#term_close_button')
    const privacyButton = $('#privacy_button')
    const privacyCloseButton = $('#privacy_close_button')
    const registerTerm = $('#register_term')
    const registerPrivacy = $('#register_privacy')
    const registerList = $('#register_list')
    const registerNextButton = $('#register_next_button')
    const registerAgreement = $('#register_agreement')
    const registerComplete = $('#register_complete')
    termButton.on('click', () => {
        registerList.hide()
        registerTerm.show()
    })
    termCloseButton.on('click', () => {
        registerList.show()
        registerTerm.hide()
    })
    privacyButton.on('click', () => {
        registerList.hide()
        registerPrivacy.show()
    })
    privacyCloseButton.on('click', () => {
        registerList.show()
        registerPrivacy.hide()
    })
    registerNextButton.on('click', () => {
        registerList.hide()
        registerAgreement.show()
    })
    register
        .on('click', '#agreement_disagree_button', () => {
            registerList.show()
            registerAgreement.hide()
        })
        .on('click', '#agreement_agree_button', () => {
            registerAgreement.hide()
            registerComplete.show()
        })
        .on('click', '#register_complete_button', () => {
            register.fadeOut(300, () => {
                registerComplete.hide()
                registerList.show()
                wrapper.removeClass('fixed')
            })
        })
}

export { headerBinding as default }
export { headerBinding }