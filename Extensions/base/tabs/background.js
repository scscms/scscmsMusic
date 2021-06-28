chrome.contextMenus.create({
    'type':'normal',
    'title':'截图',
    'contexts':['page'],
    'id': Math.random().toString().slice(-5)
});
// 截图
chrome.contextMenus.onClicked.addListener(
function(){
    chrome.tabs.query({active: true}, function(tabArray){
        const wId = tabArray[0].windowId
        const id = tabArray[0].id
        chrome.tabs.captureVisibleTab(wId, {
            format: 'png',
            //quality: 80
        }, function(dataUrl){
            chrome.tabs.executeScript(
                id,
                {code: `var p = document.createElement('img')
            p.src="${dataUrl}"
            document.body.appendChild(p)`}
            );
        });
    });
});
