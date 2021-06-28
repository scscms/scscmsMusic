chrome.runtime.onInstalled.addListener(function(){
  chrome.contextMenus.create({
    id:'saveAll',
    type:'normal',
    title:'保存所有图片',
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  if(info.menuItemId === 'saveAll'){
    chrome.tabs.executeScript(tab.id, {
      // file:'main.js',
      code: `[].map.call(document.getElementsByTagName('img'), function (img) {return img.src})`
    }, function(results){
      if (results && results[0] && results[0].length){
        new Set(results[0]).forEach(function(url) {
          chrome.downloads.download({
            url: url,
            conflictAction: 'uniquify',
            saveAs: false
          });
        });
      }
    });
  }
});
