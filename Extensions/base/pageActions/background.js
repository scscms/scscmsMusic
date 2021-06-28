chrome.runtime.onInstalled.addListener(() => {
    // 当 url 变更的时候，首先移除所有的规则
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // 增加新规则
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // 规则的条件是 URL 中包含指定字符
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'https://oa.irootech.com/' }
                    })
                ],
                // 如果负责规则进行的动作
                actions: [
                    new chrome.declarativeContent.ShowPageAction()
                ]
            }
        ])
    })
});
