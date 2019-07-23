const ckeditBinding = () => {
    const CKEDITOR = window.CKEDITOR;
    const editor = document.getElementById('ckeditor')
    if (editor) CKEDITOR.replace('ckeditor')
}

export { ckeditBinding as default }
export { ckeditBinding }