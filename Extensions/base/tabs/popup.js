/*
* 标签属性
{
    id: 标签id,
    index: 标签在窗口中的位置，以0开始,
    windowId: 标签所在窗口的id,
    openerTabId: 打开此标签的标签id,
    highlighted: 是否被高亮显示,
    active: 是否是活动的,
    pinned: 是否被固定,
    url: 标签的URL,
    title: 标签的标题,
    favIconUrl: 标签favicon的URL,
    status :标签状态，loading或complete,
    incognito: 是否在隐身窗口中,
    width: 宽度,
    height: 高度,
    sessionId: 用于sessions API的唯一id
}
* Chrome提供了三种获取标签信息的方法，分别是get、getCurrent和query
* */

// 获取标签
document.getElementById('query').addEventListener('click',()=>{
    /*
    * 参数：
    * {
        active: 是否是活动的,
        pinned: 是否被固定,
        highlighted: 是否正被高亮显示,
        currentWindow: 是否在当前窗口,
        lastFocusedWindow: 是否是上一次选中的窗口,
        status: 状态，loading或complete,
        title: 标题,
        url: 所打开的url,
        windowId: 所在窗口的id,
        windowType: 窗口类型，normal、popup、panel或app,
        index: 窗口中的位置
    }
* */
    chrome.tabs.query({
        active: true
    }, function(tabArray){
        console.log(tabArray);
    });
}, false)

// 添加标签
document.getElementById('create').addEventListener('click',()=>{
    chrome.tabs.create({
        index: 0,
        url: 'https://www.italent.cn/Login',
        active: true,
        pinned: false,
    }, function(tab){
        console.log(tab);
    });
}, false)

// 复制标签
document.getElementById('duplicate').addEventListener('click',()=>{
    chrome.tabs.query({
        active: true
    }, function(tabArray){
        chrome.tabs.duplicate(tabArray[0].id, function(tab){
            console.log(tab);
        });
    });
}, false)

// 移动标签
document.getElementById('move').addEventListener('click',()=>{
    chrome.tabs.query({
        active: true
    }, function(tabArray){
        if(tabArray.length > 1){
            chrome.tabs.move(tabArray[1].id,{
                windowId:tabArray[0].windowId,
                index:0
            }, function(tab){
                console.log(tab);
                chrome.tabs.update(tab.id, {
                    active: true
                }, function(tab){
                    console.log(tab);
                });
            });
        } else {
            alert('请打开2个窗口！')
        }
    });
}, false)

// 全部高亮
document.getElementById('highlighted').addEventListener('click',()=>{
    chrome.tabs.query({}, function(tabArray){
        tabArray.forEach(tab=>{
            chrome.tabs.update(tab.id, {
                highlighted: true
            });
        })
    });
}, false)

/*
移除
* chrome.tabs.remove(tabIds, function(){
console.log('The tabs has been closed.');
});
获取语言
* chrome.tabs.detectLanguage(tabId, function(lang){
console.log('The primary language of the tab is '+lang);
});
* */
