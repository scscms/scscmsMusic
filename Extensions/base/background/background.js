chrome.runtime.onInstalled.addListener(() => {
    let url = chrome.runtime.getURL("hello.html");
    //let url = self.origin + "/hello.html"
    chrome.tabs.create({ url })
    // chrome.tabs.create({ url:"https://www.italent.cn/" })
});
