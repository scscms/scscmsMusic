// 向后台推送消息
function sendMsgToBackground(type,data) {
    chrome.runtime.sendMessage({type, data})
}
// 检查歌曲
let hasInform = false
let songArray = []
new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        let type = mutation.type
        let tag = mutation.addedNodes
        if ("childList" === type && tag) {
            for (let i = tag.length; i--;) {
                let _t = tag[i]
                if (_t.nodeType === 1 && (_t.tagName === 'AUDIO' || _t.tagName === 'VIDEO') && /\.(mp3|ogg|m4a)(\?.+)?/i.test(_t.src)) {
                    !songArray.includes(_t.src) && songArray.push(_t.src)
                    !hasInform && setTimeout(() => {
                        sendMsgToBackground('ajaxSong', songArray)
                    }, 1000)
                    hasInform = true
                }
            }
        }
    })
}).observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: false,
    attributesFilter: ["src"]
})
