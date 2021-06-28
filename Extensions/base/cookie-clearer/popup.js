/*
*Chrome定义的Cookie对象包含如下属性：name（名称）、value（值）、domain（域）、path（路径）、secure（是否只允许安全连接调用）、httpOnly（是否禁止客户端调用）、session（是否是session cookie）、expirationDate（过期时间）和storeId（包含此cookie的cookie store的id）。
* */

const form = document.getElementById("control-row");
const input = document.getElementById("input");
const message = document.getElementById("message");
const add = document.getElementById("add");
(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        try {
            let url = new URL(tab.url);
            input.value = url.hostname;
        } catch {}
    }
    input.focus();
})();

add.addEventListener('click',async function(){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.cookies.set({
        url: tab.url,
        name:'name',
        value:'add new',
        secure:false,
        httpOnly:true
    }, function(cookie){
        console.log(cookie);
    });
}, false)

form.addEventListener("submit", handleFormSubmit);

async function handleFormSubmit(event) {
    event.preventDefault();

    clearMessage();

    let url = stringToUrl(input.value);
    if (!url) {
        setMessage("Invalid URL");
        return;
    }

    let message = await deleteDomainCookies(url.hostname);
    setMessage(message);
}

function stringToUrl(input) {
    try {
        return new URL(/^https?:/.test(input) ? input : `https://${input}`);
    } catch {
    }
    return null;
}

async function deleteDomainCookies(domain) {
    let cookiesDeleted = 0;
    try {
        const cookies = await chrome.cookies.getAll({ domain });
        alert(JSON.stringify(cookies))
        if (cookies.length === 0) {
            return "No cookies found";
        }

        let pending = cookies.map(deleteCookie);
        await Promise.all(pending);

        cookiesDeleted = pending.length;
    } catch (error) {
        return `Unexpected error: ${error.message}`;
    }

    return `Deleted ${cookiesDeleted} cookie(s).`;
}

function deleteCookie(cookie) {
    const protocol = cookie.secure ? "https:" : "http:";
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

    return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId,
    });
}

function setMessage(str) {
    message.textContent = str;
    message.hidden = false;
}

function clearMessage() {
    message.hidden = true;
    message.textContent = "";
}
