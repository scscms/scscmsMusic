const arr = [
    '我想靠脸吃饭',
    '不行我就试着学一下',
    '我快学不动了',
    '扶我起来，我还可以学',
    '阿姨，我不想努力了...',
]
const list = arr.map((t, i) => `<label class="options__label">
        <input class="options__checkbox" name="radio" checked="${i === 0 ? 'checked' : ''}" type="radio">
        <span data-i18n="optionTracking">${t}</span>
    </label>`)
list.push('<button data-i18n="clearCache" class="options__cache">确定提交</button><span id="info"></span>')
document.querySelector('.options').innerHTML = list.join('')
document.body.addEventListener('click', e => {
    if (e.target.tagName === "BUTTON") {
        document.querySelector('#info').textContent = '阿姨收到了'
    }
}, false)
