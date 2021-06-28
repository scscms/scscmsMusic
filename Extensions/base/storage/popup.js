document.addEventListener('click', e => {
    switch (e.target.id) {
        case 'btn1':
            chrome.storage.sync.set({key: 'newKey'}, () => {
                console.log('set successed!')
            })
            break
        case 'btn2':
            chrome.storage.sync.get('key', (res) => {
                alert(JSON.stringify(res))
            })
            break
        case 'btn3':
            chrome.storage.sync.set({key: "value local"}, function () {
                chrome.storage.sync.get(['key'], function (res) {
                    alert(JSON.stringify(res))
                })
            })
            break
        case 'btn4':
            const text = document.querySelector('#textarea').value
            chrome.storage.local.set({textValue: text}, function () {
                console.log('Value is ' + text)
            })
            break
        case 'btn5':
            chrome.storage.local.get('textValue', (res) => {
                alert(JSON.stringify(res))
            })
            break
        case 'btn6':
            chrome.storage.local.remove('textValue', function () {
                console.log('remove ')
            })
            break
        case 'btn7':
            chrome.storage.local.clear(function () {
                console.log('remove all')
            })
            break
    }
}, false)
