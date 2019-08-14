---
title: '英網科技-林口大數據'
---

前端應用呼叫方法
===

###### 相關依賴: `bootstrap-grid v4.3.1` `ckeditor v4` `gsap v2.1.3` `jquery v3.4.1` `Swiper.js v4.5.0`

![beta](https://img.shields.io/appveyor/ci/:user/:repo.svg)
![license](https://img.shields.io/npm/l/express.svg)
![power](https://img.shields.io/static/v1.svg?label=Power%20By&message=Joey)

## 目錄

[TOC]

---

## 前台線上測試

測試網址 [http://surgestudio.net/document/test/index-logout.html](http://surgestudio.net/document/test/index-logout.html)

URL參數
- `?page=login` 開啟登入頁
- `?page=register` 開啟註冊頁(1)
- `?page=agreement` 開啟註冊頁(2) - 個資使用同意書
- `?page=complete` 開啟註冊完成頁
- `?page=email-confirm` 開啟email認證完成頁
- `?page=password` 開啟旺季密碼頁
- `?page=password-complete` 開啟忘記密碼完成頁
- `?page=reset-password` 開啟重設密碼頁
- `?page=reset-password-complete` 開啟重設密碼完成頁

範例 [http://surgestudio.net/document/test/index-logout.html?page=password-complete](http://surgestudio.net/document/test/index-logout.html?page=password-complete)

---

### JS 接口

###### js/main.js
```javascript
// 省略..
const headerBinding = () => {
    // 省略..

    // URL 呼叫方法
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

    // 直接呼叫
    // openLogin()
    // openRegister()
    // openEmailConfirm
    // openAgreement()
    // openComplete()
    // openPassword()
    // openPasswordComplete()
    // openResetPassword()
    // openResetPasswordComplete()
}
```

---

### 警示語
```html
<div class="input">
    <div class="input__warn">
        <i class="fas fa-exclamation-triangle"></i>&nbsp;警示語範例
    </div>
</div>
```
 [警告語效果參考](http://surgestudio.net/document/test/index-logout.html?page=login)

---

## 後台線上測試

測試網址 [http://surgestudio.net/document/test/backstage-logout.html](http://surgestudio.net/document/test/backstage-logout.html)

URL參數
- `?page=password` 開啟旺季密碼頁
- `?page=password-complete` 開啟忘記密碼完成頁
- `?page=reset-password` 開啟重設密碼頁
- `?page=reset-password-complete` 開啟重設密碼完成頁

範例 [http://surgestudio.net/document/test/backstage-logout.html?page=reset-password-complete](http://surgestudio.net/document/test/backstage-logout.html?page=reset-password-complete)