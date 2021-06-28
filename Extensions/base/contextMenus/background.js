chrome.contextMenus.create({
    'type':'normal',
    'title':'获取图片URL',
    'contexts':['image'],
    'id': 'abc'
});

chrome.contextMenus.onClicked.addListener(function(arg){
    console.log(arg)
    if(arg.srcUrl){
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'images/get_started48.png',
            title: '图片地址',
            message: arg.srcUrl,
        })
    }
});
