// 重定向
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {redirectUrl: details.url.replace("oa.irootech.com", "workpro.irootech.com")};
    },
    {
        urls: ["*://oa.irootech.com/*"]
    },
    ["blocking"]
);

// 阻断访问
chrome.webRequest.onBeforeRequest.addListener(
    function(details){
        return {cancel: true};
    },
    {
        urls: [
            "*://www.italent.cn/*"
        ]
    },
    [
        "blocking"
    ]
);

// 删除请求头信息
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details){
        for(var i=0, headerLen=details.requestHeaders.length; i<headerLen; ++i){
            if(details.requestHeaders[i].name === 'User-Agent'){
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {
        urls: [
            "<all_urls>"
        ]
    },
    [
        "blocking",
        "requestHeaders"
    ]
);

/*
* 需要注意的是，header中的如下属性是不支持更改的：Authorization、Cache-Control、Connection、Content-
Length、Host、If-Modified-Since、If-None-Match、If-Range、Partial-Data、Pragma、Proxy-
Authorization、Proxy-Connection和Transfer-Encoding。
* */
