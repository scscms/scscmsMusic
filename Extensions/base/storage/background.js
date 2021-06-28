chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log('=====onChanged=========', changes, namespace);
})
