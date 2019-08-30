/**
 * 左側補零工具
 * @param {string|number} str 原始字串或數字
 * @param {number} length 目標總長度
 * @returns {string} 補完零後的字串，其長度等於指定總長
 */
const paddingLeft = (str, length) => {
    if (str.length >= length) { return str; }
    return paddingLeft(`0${str}`, length);
};

/**
 * 右側補零工具
 * @param {string|number} str 原始字串或數字
 * @param {number} length 目標總長度
 * @returns {string} 補完零後的字串，其長度等於指定總長
 */
const paddingRight = (str, length) => {
    if (str.length >= length) { return str; }
    return paddingRight(`${str}0`, length);
};


/**
 * 網址參數取得器
 * @param {string} name 參數名稱
 * @param {string} [url] 目標url(選填，預設值為當前網址)
 * @returns {string} 結果參數值
 */
const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * 網址參數清除器
 * @param {string} [url] 目標url(選填，預設值為當前網址)
 * @returns {string} 清除後的完整網址
 */
const clearParameters = (url) => {
    if (!url) url = window.location.href;

    const urlparts = url.split('?');
    return urlparts[0];
};

/**
 * 網址參數移除器
 * @param {string} parameter 參數名稱
 * @param {string} [url] 目標url(選填，預設值為當前網址)
 * @returns {string} 清除指定餐數後的網址
 */
const removeParameterByName = (parameter, url) => {
    if (!url) url = window.location.href;
    // prefer to use l.search if you have a location/link object
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
        const prefix = `${encodeURIComponent(parameter)}=`;
        const pars = urlparts[1].split(/[&]/g);

        // reverse iteration as may be destructive
        for (let i = pars.length; i-- > 0;) {
            // idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '');
    }
    return url;
};

((document, window, $, TimelineMax, TweenMax) => {

    // 選單列事件綁定
    const headerBinding = () => {
        // 上方選單開合綁定
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

        // 年選項批次塞入
        const yearSelections = $('.select-year')
        if (yearSelections) {
            let optionsHtml = '<option disabled selected>西元出生年</option>'
            for(let i = 1900; i < 2019; i++) {
                optionsHtml += `<option value="${i}">${i}年</option>`
            }

            [...yearSelections].forEach((select) => {
                $(select).html(optionsHtml)
            })
        }

        // 時間選項批次塞入
        const hourSelections = $('.hour-select')
        if (hourSelections.length) {
            let optionsHtml
            for (let i = 0; i <= 24; i++) {
                optionsHtml += `<option value="${i}">${paddingLeft(i.toString(), 2)}</option>`
            }
            [...hourSelections].forEach((select) => {
                $(select).html(optionsHtml)
            })
        }

        // 公司選項批次塞入
        const companyTypeSelections = $('.company-type')
        if (companyTypeSelections) {
            let optionsHtml = '<option value="-1" disabled selected>公司類型</option>'
            const companyTypes = [
                { id: 'A', name: '農、林、漁、牧業' },
                { id: 'B', name: '礦業及土石採取業' },
                { id: 'C', name: '製造業' },
                { id: 'D', name: '電力及燃氣供應業' },
                { id: 'E', name: '用水供應及污染整治業' },
                { id: 'F', name: '營建工程業' },
                { id: 'G', name: '批發及零售業' },
                { id: 'H', name: '運輸及倉儲業' },
                { id: 'I', name: '住宿及餐飲業' },
                { id: 'J', name: '出版、影音製作、傳播及資通訊服務業' },
                { id: 'K', name: '金融及保險業' },
                { id: 'L', name: '不動產業' },
                { id: 'M', name: '專業、科學及技術服務業' },
                { id: 'N', name: '支援服務業' },
                { id: 'O', name: '公共行政及國防；強制性社會安全' },
                { id: 'P', name: '教育業' },
                { id: 'Q', name: '醫療保健及社會工作服務業' },
                { id: 'R', name: '藝術、娛樂及休閒服務業' },
                { id: 'S', name: '其他服務業' }
            ]
            for (let i = 0; i <= companyTypes.length - 1; i += 1){
                optionsHtml += `<option value="${companyTypes[i].id}">${companyTypes[i].name}</option>`
            }
            [...companyTypeSelections].forEach((input) => {
                $(input).html(optionsHtml)
            })
        }

        // 必填欄位綁定
        const requiredInputs = $('[required]');
        [...requiredInputs].forEach((input) => {
            const _input = $(input)
            const inputWrap = $('<div/>', { class: 'input-wrap' })
            const requiredWarn = $('<div/>', { class: 'input-wrap__required-warn', text: '必填' })

            if($(input).prop('tagName').toLowerCase() === 'select') requiredWarn.css('right', '20px')
            inputWrap.insertAfter(_input)
            inputWrap.append(_input, requiredWarn)
        })

        // 登入按鈕事件綁定
        const wrapper = $('#wrapper')
        const member = $('#member')
        const login = $('#login')
        const forgotPassword = $('#forgot_password')
        const header = $('#header')
        const forgotPasswordEmail = $('#forgot_password_email')
        const forgotPasswordComplete = $('#forgot_password_complete')
        const resetPassword = $('#reset_password')
        const resetPasswordInput = $('#reset_password_input')
        const resetPasswordComplete = $('#reset_password_complete')
        header.on('click', '#login_button, #login_button_m', () => {
            login.fadeIn()
            wrapper.addClass('fixed')
        })

        // 後台忘記密碼按鈕
        member
            .on('click', '#forgot_password_button', () => {
                login.hide()
                forgotPassword.show()
            })
            .on('click', '#forgot_password_cancel_button', () => {
                login.show()
                forgotPassword.hide()
            })
            .on('click', '#forgot_password_next_button', () => {
                forgotPasswordEmail.hide()
                forgotPasswordComplete.show()
            })
            .on('click', '#forgot_password_complete_button', () => {
                login.show()
                forgotPassword.hide()
                forgotPasswordEmail.show()
                forgotPasswordComplete.hide()
            })
            .on('click', '#reset_password_next_button', () => {
                resetPasswordInput.hide()
                resetPasswordComplete.show()
            })
            .on('click', '#reset_password_complete_button', () => {
                login.show()
                resetPassword.hide()
                resetPasswordInput.show()
                resetPasswordComplete.hide()
            })

        // 手機板選單綁定
        const wrapperMask = $('.wrapper__mask')
        const wrapperMaskOpen = () => {
            wrapperMask.show()
            TweenMax.fromTo(wrapperMask, 0.5, { opacity: 0 }, { opacity: 1 });
        }
        const wrapperMaskClose = () => {
            TweenMax.to(wrapperMask, 0.5, { opacity: 0, onComplete: () => {
                wrapperMask.hide()
            } })
        }
        const header_menu_btn_m = $('#header_menu_btn_m')
        header_menu_btn_m.on('click', () => {
            wrapper.addClass('fixed-push')
            wrapperMaskOpen()
        })
        const header_menu_close_btn_m = $('#header_menu_close_btn_m')
        header_menu_close_btn_m.on('click', () => {
            wrapper.removeClass('fixed-push')
            wrapperMaskClose()
        })

        // 主動事件
        // 開啟忘記密碼
        const openPassword = () => {
            login.hide()
            forgotPassword.show()
        }
        // 開啟忘記密碼完成
        const openPasswordComplete = () => {
            login.hide()
            forgotPassword.show()
            forgotPasswordEmail.hide()
            forgotPasswordComplete.show()
        }
        // 開啟重設密碼
        const openResetPassword = () => {
            login.hide()
            resetPassword.show()
        }
        // 開啟重設密碼完成
        const openResetPasswordComplete = () => {
            login.hide()
            resetPassword.show()
            resetPasswordInput.hide()
            resetPasswordComplete.show()
        }

        const page = getParameterByName('page')
        if (page === 'password') openPassword()
        else if (page === 'password-complete') openPasswordComplete()
        else if (page === 'reset-password') openResetPassword()
        else if (page === 'reset-password-complete') openResetPasswordComplete()
    }

    // swiper輪播綁定
    const swiperBinding = () => {
        const swiperElement = document.getElementsByClassName('swiper-container-banner')
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

    // datatable綁定
    const datatableBinding = () => {
        const table = $('#table')
        if(table.length) {
            const filter = $('#filter')
            const wrapper = $('#wrapper')

            table.DataTable({
                language: {
                    lengthMenu: '每頁 _MENU_ 筆',
                    zeroRecords: '<i class="fas fa-box-open"></i> 很抱歉，沒有符合的結果',
                    info: '第 _PAGE_ 頁，共 _PAGES_ 頁',
                    infoEmpty: '',
                    search: '<i class="fas fa-search"></i>',
                    infoFiltered: '',
                    paginate: {
                        first: '第一頁',
                        last: '最後一頁',
                        next: '下一頁',
                        previous: '上一頁'
                    }
                }
            })

            const filterInsert = () => {
                setTimeout(() => {
                    const tableFilter = $('#table_filter')
                    if (tableFilter.length === 0) {
                        filterInsert()
                    } else {
                        if (filter.length === 0) return
                        $('<i id="table_filter_icon" class="table-filter mobile fas fa-filter"/>').prependTo(tableFilter)
                    }
                }, 10)
            };
            filterInsert()

            // 篩選器手機板事件綁定
            wrapper
                .on('click', '#table_filter_icon', () => {
                    filter.fadeIn()
                    filter.css('display', 'flex')
                    wrapper.addClass('fixed')
                })
                .on('click', '#filter_confirm_button', () => {
                    filter.fadeOut()
                    wrapper.removeClass('fixed')
                })
        }
    }

    // ckeditor綁定
    const ckeditBinding = () => {
        const CKEDITOR = window.CKEDITOR
        CKEDITOR.config.height = 500
        const editor = document.getElementById('ckeditor')
        if (editor) CKEDITOR.replace('ckeditor')
    }

    // page-href綁定
    const pageHrefBinding = () => {
        $('body').on('click', '[page-href]', (e) => {
            location.href = e.currentTarget.getAttribute('page-href')
        })
    }

    headerBinding()
    pageHrefBinding()
    if (window.Swiper) swiperBinding()
    if (window.CKEDITOR) ckeditBinding()
    if (jQuery().DataTable) datatableBinding()

})(document, window, jQuery, TimelineMax, TweenMax)
