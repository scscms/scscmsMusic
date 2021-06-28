chrome.tabs.onActiveChanged.addListener((tabId)=>{
	chrome.tabs.query({active: true}, function(tabs) {
		const url = tabs[0].url || ''
		if(url.includes('http://gitlab.irootech.com/')){
			chrome.browserAction.setBadgeText({text: '99+'});
			chrome.browserAction.setBadgeBackgroundColor({color: '#f00'});
			chrome.browserAction.setTitle({title:'您有99+封邮件！'});
			chrome.browserAction.getTitle({},details=>{
				console.log(details)
			})
		} else {
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setTitle({title:chrome.runtime.getManifest().name});
		}
	});
})

function chgIcon(index){
	index = index % 20;
	chrome.browserAction.setIcon({path: {'19': 'images/icon19_'+index+'.png'}});
	chrome.browserAction.setIcon({path: {'38': 'images/icon38_'+index+'.png'}});
	setTimeout(function(){chgIcon(index + 1)},50);
}

chgIcon(0);
