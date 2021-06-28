chrome.contextMenus.create({
    'type':'normal',
    'title':'使用谷歌翻译……',
    'contexts':['selection'],
    'id':'cn',
    'onclick':translate
});

function translate(info, tab){
    fetch("http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh&q="+info.selectionText).then(response => response.json()).then(json => {
        if(Array.isArray(json.sentences)){
            alert(json.sentences[0].trans)
        } else {
            alert('翻译失败1')
        }
    }).catch(()=>{
        alert('翻译失败0')
    })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    chrome.contextMenus.update('cn',{
        "title":`使用谷歌翻译"${message}"`
    });
});
