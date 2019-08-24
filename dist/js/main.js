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
    // 縣市區選取器
    const addressArray = [
        ['台北市', '100中正區', '103大同區', '104中山區', '105松山區', '106大安區', '108萬華區', '110信義區', '111士林區', '112北投區', '114內湖區', '115南港區', '116文山區'],
        ['台北縣', '207萬里鄉', '208金山鄉', '220板橋市', '221汐止市', '222深坑鄉', '223石碇鄉', '224瑞芳鎮', '226平溪鄉', '227雙溪鄉', '228貢寮鄉', '231新店市', '232坪林鄉', '233烏來鄉', '234永和市', '235中和市', '236土城市', '237三峽鎮', '238樹林市', '239鶯歌鎮', '241三重市', '242新莊市', '243泰山鄉', '244林口鄉', '247蘆洲市', '248五股鄉', '248新莊市', '249八里鄉', '251淡水鎮', '252三芝鄉', '253石門鄉'],
        ['台中市', '400中區', '401東區', '402南區', '403西區', '404北區', '406北屯區', '407西屯區', '408南屯區'],
        ['台中縣', '411太平市', '412大里市', '413霧峰鄉', '414烏日鄉', '420豐原市', '421后里鄉', '422石岡鄉', '423東勢鎮', '424和平鄉', '426新社鄉', '427潭子鄉', '428大雅鄉', '429神岡鄉', '432大肚鄉', '433沙鹿鎮', '434龍井鄉', '435梧棲鎮', '436清水鎮', '437大甲鎮', '438外埔鄉', '439大安鄉'],
        ['台東縣', '950台東市', '951綠島鄉', '952蘭嶼鄉', '953延平鄉', '954卑南鄉', '955鹿野鄉', '956關山鎮', '957海端鄉', '958池上鄉', '959東河鄉', '961成功鎮', '962長濱鄉', '963太麻里鄉', '964金峰鄉', '965大武鄉', '966達仁鄉'],
        ['台南市', '700中西區', '701東區', '702南區', '704北區', '708安平區', '709安南區'],
        ['台南縣', '710永康市', '711歸仁鄉', '712新化鎮', '713左鎮鄉', '714玉井鄉', '715楠西鄉', '716南化鄉', '717仁德鄉', '718關廟鄉', '719龍崎鄉', '720官田鄉', '721麻豆鎮', '722佳里鎮', '723西港鄉', '724七股鄉', '725將軍鄉', '726學甲鎮', '727北門鄉', '730新營市', '731後壁鄉', '732白河鎮', '733東山鄉', '734六甲鄉', '735下營鄉', '736柳營鄉', '737鹽水鎮', '741善化鎮', '741新市鄉', '742大內鄉', '743山上鄉', '744新市鄉', '745安定鄉'],
        ['宜蘭縣', '260宜蘭市', '261頭城鎮', '262礁溪鄉', '263壯圍鄉', '264員山鄉', '265羅東鎮', '266三星鄉', '267大同鄉', '268五結鄉', '269冬山鄉', '270蘇澳鎮', '272南澳鄉', '290釣魚台'],
        ['花蓮縣', '970花蓮市', '971新城鄉', '972秀林鄉', '973吉安鄉', '974壽豐鄉', '975鳳林鎮', '976光復鄉', '977豐濱鄉', '978瑞穗鄉', '979萬榮鄉', '981玉里鎮', '982卓溪鄉', '983富里鄉'],
        ['金門縣', '890金沙鎮', '891金湖鎮', '892金寧鄉', '893金城鎮', '894烈嶼鄉', '896烏坵鄉'],
        ['南投縣', '540南投市', '541中寮鄉', '542草屯鎮', '544國姓鄉', '545埔里鎮', '546仁愛鄉', '551名間鄉', '552集集鎮', '553水里鄉', '555魚池鄉', '556信義鄉', '557竹山鎮', '558鹿谷鄉'],
        ['南海島', '817東沙群島', '819南沙群島'],
        ['屏東縣', '900屏東市', '901三地門鄉', '902霧台鄉', '903瑪家鄉', '904九如鄉', '905里港鄉', '906高樹鄉', '907鹽埔鄉', '908長治鄉', '909麟洛鄉', '911竹田鄉', '912內埔鄉', '913萬丹鄉', '920潮州鎮', '921泰武鄉', '922來義鄉', '923萬巒鄉', '924崁頂鄉', '925新埤鄉', '926南州鄉', '927林邊鄉', '928東港鎮', '929琉球鄉', '931佳冬鄉', '932新園鄉', '940枋寮鄉', '941枋山鄉', '942春日鄉', '943獅子鄉', '944車城鄉', '945牡丹鄉', '946恆春鎮', '947滿州鄉'],
        ['苗栗縣', '350竹南鎮', '351頭份鎮', '352三灣鄉', '353南庄鄉', '354獅潭鄉', '356後龍鎮', '357通霄鎮', '358苑裡鎮', '360苗栗市', '361造橋鄉', '362頭屋鄉', '363公館鄉', '364大湖鄉', '365泰安鄉', '366銅鑼鄉', '367三義鄉', '368西湖鄉', '369卓蘭鎮'],
        ['桃園縣', '320中壢市', '324平鎮市', '325龍潭鄉', '326楊梅鎮', '327新屋鄉', '328觀音鄉', '330桃園市', '333龜山鄉', '334八德市', '335大溪鎮', '336復興鄉', '337大園鄉', '338蘆竹鄉'],
        ['高雄市', '800新興區', '801前金區', '802苓雅區', '803鹽埕區', '804鼓山區', '805旗津區', '806前鎮區', '807三民區', '811楠梓區', '812小港區', '813左營區', '817東沙群島', '819南沙群島'],
        ['高雄縣', '814仁武鄉', '815大社鄉', '820岡山鎮', '821路竹鄉', '822阿蓮鄉', '823田寮鄉', '824燕巢鄉', '825橋頭鄉', '826梓官鄉', '827彌陀鄉', '828永安鄉', '829湖內鄉', '830鳳山市', '831大寮鄉', '832林園鄉', '833鳥松鄉', '840大樹鄉', '842旗山鎮', '843美濃鎮', '844六龜鄉', '845內門鄉', '846杉林鄉', '847甲仙鄉', '848桃源鄉', '849那瑪夏鄉', '851茂林鄉', '852茄萣鄉'],
        ['基隆市', '200仁愛區', '201信義區', '202中正區', '203中山區', '204安樂區', '205暖暖區', '206七堵區'],
        ['連江縣', '209南竿鄉', '210北竿鄉', '211莒光鄉', '212東引鄉'],
        ['釣魚台', '290釣魚台'],
        ['雲林縣', '630斗南鎮', '631大埤鄉', '632虎尾鎮', '633土庫鎮', '634褒忠鄉', '635東勢鄉', '636台西鄉', '637崙背鄉', '638麥寮鄉', '640斗六市', '643林內鄉', '646古坑鄉', '647莿桐鄉', '648西螺鎮', '649二崙鄉', '651北港鎮', '652水林鄉', '653口湖鄉', '654四湖鄉', '655元長鄉'],
        ['新竹市', '300北區', '300東區', '300香山區'],
        ['新竹縣', '300寶山鄉', '302竹北市', '303湖口鄉', '304新豐鄉', '305新埔鎮', '306關西鎮', '307芎林鄉', '308寶山鄉', '310竹東鎮', '311五峰鄉', '312橫山鄉', '313尖石鄉', '314北埔鄉', '315峨眉鄉'],
        ['嘉義市', '600西區', '600東區'],
        ['嘉義縣', '602番路鄉', '603梅山鄉', '604竹崎鄉', '605阿里山鄉', '606中埔鄉', '607大埔鄉', '608水上鄉', '611鹿草鄉', '612太保市', '613朴子市', '614東石鄉', '615六腳鄉', '616新港鄉', '621民雄鄉', '622大林鎮', '623溪口鄉', '624義竹鄉', '625布袋鎮'],
        ['彰化縣', '500彰化市', '502芬園鄉', '503花壇鄉', '504秀水鄉', '505鹿港鎮', '506福興鄉', '507線西鄉', '508和美鎮', '509伸港鄉', '510員林鎮', '511社頭鄉', '512永靖鄉', '513埔心鄉', '514溪湖鎮', '515大村鄉', '516埔鹽鄉', '520田中鎮', '521北斗鎮', '522田尾鄉', '523埤頭鄉', '524溪州鄉', '525竹塘鄉', '526二林鎮', '527大城鄉', '528芳苑鄉', '530二水鄉'],
        ['澎湖縣', '880馬公市', '881西嶼鄉', '882望安鄉', '883七美鄉', '884白沙鄉', '885湖西鄉']
    ];
    const addressBinding = () => {
        const citySelect = $('.select-city')
        const regionSelect = $('.select-region')
        if (citySelect.length !== 0) {
            let citySelectHtml = '<option value="" disabled selected>--請選擇縣市--</option>'
            addressArray.forEach((cityArray, idx) => {
                citySelectHtml += `<option value="${idx}">${cityArray[0]}</option>`
            })
            citySelect.html(citySelectHtml)
            citySelect.on('change', (e) => {
                const cityIdx = citySelect.val()
                const regionArray = addressArray[cityIdx]
                let regionSelectHtml = '<option value="" disabled selected>--請選擇區域--</option>'
                for (let i = 1; i < regionArray.length; i += 1) {
                    regionSelectHtml += `<option value="${regionArray[i].substring(0, 3)}">${regionArray[i]}</option>`
                }
                regionSelect.html(regionSelectHtml)
            })
        }
    }

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
            for (let i = 1900; i < 2019; i++) {
                optionsHtml += `<option value="${i}">${i}年</option>`
            }

            [...yearSelections].forEach((select) => {
                $(select).html(optionsHtml)
            })
        }

        // 時間選項批次塞入
        const hourSelections = $('.hour-select')
        let optionsHtml
        if (hourSelections.length) {
            for (let i = 0; i < 24; i++) {
                optionsHtml += `<option value="${i}">${paddingLeft(i.toString(), 2)}</option>`
            }
        }
        [...hourSelections].forEach((select) => {
            $(select).html(optionsHtml)
        })

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
            for (let i = 0; i <= companyTypes.length - 1; i += 1) {
                optionsHtml += `<option value="${companyTypes[i].id}">${companyTypes[i].name}</option>`
            }
            [...companyTypeSelections].forEach((select) => {
                $(select).html(optionsHtml)
            })
        }

        // 必填欄位綁定
        const requiredInputs = $('input[required]');
        [...requiredInputs].forEach((input) => {
            const _input = $(input)
            const inputWrap = $('<div/>', { class: 'input-wrap' })
            const requiredWarn = $('<div/>', { class: 'input-wrap__required-warn', text: '必填' })
            inputWrap.insertAfter(_input)
            inputWrap.append(_input, requiredWarn)
        })

        // 登入按鈕事件綁定
        const wrapper = $('#wrapper')
        const login = $('#login')
        const register = $('#register')
        const forgotPassword = $('#forgot_password')
        const header = $('#header')
        header.on('click', '#login_button, #login_button_m', () => {
            login.fadeIn()
            wrapper.addClass('fixed')
        })

        // 手機板選單綁定
        const wrapperMask = $('.wrapper__mask')
        const wrapperMaskOpen = () => {
            wrapperMask.show()
            TweenMax.fromTo(wrapperMask, 0.5, { opacity: 0 }, { opacity: 1 });
        }
        const wrapperMaskClose = () => {
            TweenMax.to(wrapperMask, 0.5, {
                opacity: 0, onComplete: () => {
                    wrapperMask.hide()
                }
            })
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

        // 登入畫面事件綁定
        login
            .on('click', '#login_cancel_button', () => {
                login.fadeOut()
                wrapper.removeClass('fixed')
            })
            // .on('click', '#login_confirm_button', () => {
            //     login.fadeOut()
            //     wrapper.removeClass('fixed')
            // })
            .on('click', '#register_button', () => {
                login.fadeOut()
                register.fadeIn()
            })
            .on('click', '#forgot_password_button', () => {
                login.fadeOut()
                forgotPassword.fadeIn()
            })

        // 註冊畫面事件綁定
        const registerTerm = $('#register_term')
        const registerPrivacy = $('#register_privacy')
        const registerList = $('#register_list')
        const registerAgreement = $('#register_agreement')
        const registerComplete = $('#register_complete')
        register
            .on('click', '#register_cancel_button', () => {
                login.fadeIn()
                register.fadeOut()
            })
            .on('click', '#term_button', () => {
                registerList.hide()
                registerTerm.show()
            })
            .on('click', '#term_close_button', () => {
                registerList.show()
                registerTerm.hide()
            })
            .on('click', '#privacy_button', () => {
                registerList.hide()
                registerPrivacy.show()
            })
            .on('click', '#privacy_close_button', () => {
                registerList.show()
                registerPrivacy.hide()
            })
            .on('click', '#register_next_button', () => {
                registerList.hide()
                registerAgreement.show()
            })
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

        // 忘記密碼事件綁定
        const forgotPasswordEmail = $('#forgot_password_email')
        const forgotPasswordComplete = $('#forgot_password_complete')
        forgotPassword
            .on('click', '#forgot_password_cancel_button', () => {
                login.fadeIn()
                forgotPassword.fadeOut(300, () => {
                    forgotPasswordEmail.show()
                    forgotPasswordComplete.hide()
                })
            })
            .on('click', '#forgot_password_next_button', () => {
                forgotPasswordEmail.hide()
                forgotPasswordComplete.show()
            })
            .on('click', '#forgot_password_complete_button', () => {
                login.fadeIn()
                forgotPassword.fadeOut(300, () => {
                    forgotPasswordEmail.show()
                    forgotPasswordComplete.hide()
                })
            })

        // 重設密碼事件綁定
        const resetPassword = $('#reset_password')
        const resetPasswordInput = $('#reset_password_input')
        const resetPasswordComplete = $('#reset_password_complete')
        resetPassword
            .on('click', '#reset_password_cancel_button', () => {
                resetPassword.fadeOut()
                wrapper.addClass('fixed')
            })
            .on('click', '#reset_password_next_button', () => {
                resetPasswordInput.hide()
                resetPasswordComplete.show()
            })
            .on('click', '#reset_password_complete_button', () => {
                resetPassword.fadeOut(300, () => {
                    resetPasswordInput.show()
                    resetPasswordComplete.hide()
                })
                wrapper.addClass('fixed')
            })

        // EMAIL 認證完成事件綁定
        const emailConfirm = $('#register_email_confirm')
        emailConfirm
            .on('click', '#register_email_confirm_button', () => {
                emailConfirm.hide()
                wrapper.removeClass('fixed')
            })

        // 主動事件
        // 開啟登入畫面
        const openLogin = () => {
            login.fadeIn()
            wrapper.addClass('fixed')
        }
        // 開啟註冊畫面(1)
        const openRegister = () => {
            register.fadeIn()
            wrapper.addClass('fixed')
        }
        // 開啟註冊畫面(2) - 個資使用同意書
        const openAgreement = () => {
            register.fadeIn()
            registerList.hide()
            registerAgreement.show()
            wrapper.addClass('fixed')
        }
        // 開啟註冊完成畫面
        const openComplete = () => {
            register.fadeIn()
            registerList.hide()
            registerComplete.show()
            wrapper.addClass('fixed')
        }
        // EMAIL認證完成
        const openEmailConfirm = () => {
            emailConfirm.show()
            wrapper.addClass('fixed')
        }
        // 開啟忘記密碼
        const openPassword = () => {
            forgotPassword.fadeIn()
            wrapper.addClass('fixed')
        }
        // 開啟忘記密碼完成
        const openPasswordComplete = () => {
            forgotPassword.fadeIn()
            wrapper.addClass('fixed')
            forgotPasswordEmail.hide()
            forgotPasswordComplete.show()
        }
        // 開啟重設密碼
        const openResetPassword = () => {
            resetPassword.fadeIn()
            wrapper.addClass('fixed')
        }
        // 開啟重設密碼完成
        const openResetPasswordComplete = () => {
            resetPasswordInput.hide()
            resetPasswordComplete.show()
            resetPassword.fadeIn()
            wrapper.addClass('fixed')
        }

        const page = getParameterByName('page')
        if (page === 'login') openLogin()
        else if (page === 'register') openRegister()
        else if (page === 'email-confirm') openEmailConfirm()
        else if (page === 'agreement') openAgreement()
        else if (page === 'complete') openComplete()
        else if (page === 'password') openPassword()
        else if (page === 'password-complete') openPasswordComplete()
        else if (page === 'reset-password') openResetPassword()
        else if (page === 'reset-password-complete') openResetPasswordComplete()
    }

    // swiper輪播綁定
    const swiperBinding = () => {
        const bannerSwiperElement = document.getElementsByClassName('swiper-container-banner')
        if (bannerSwiperElement) {
            const mySwiper = new Swiper('.swiper-container-banner', {
                autoplay: {
                    delay: 5000,
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

        const simpleSwiperElement = document.getElementsByClassName('swiper-container-simple')
        if (simpleSwiperElement) {
            const mySwiper = new Swiper('.swiper-container-simple', {
                autoplay: false
            })

            const mySwiperController = $('#swiper_container_simple_controller')
            if (mySwiperController.length > 0) {
                mySwiperController
                    .on('click', '.page1', () => {
                        mySwiper.slideTo(0)
                    })
                    .on('click', '.page2', () => {
                        mySwiper.slideTo(1)
                    })
                    .on('click', '.page3', () => {
                        mySwiper.slideTo(2)
                    })
            }
        }
    }

    // datatable綁定
    const datatableBinding = () => {
        const table = $('#table')
        if (table.length) {
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
    addressBinding()
    if (window.Swiper) swiperBinding()
    if (window.CKEDITOR) ckeditBinding()
    if (jQuery().DataTable) datatableBinding()

})(document, window, jQuery, TimelineMax, TweenMax)
