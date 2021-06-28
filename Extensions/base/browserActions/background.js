chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color: 'red' }, () => {
        console.log('color is red');
    });
    chrome.browserAction.setBadgeText({text: 'OK'});
    chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
    chrome.browserAction.setTitle({title:'提示文本'});
});
