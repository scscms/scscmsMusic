chrome.omnibox.onInputChanged.addListener(function(text, suggest){
		text = text.replace(" ", "");
		var suggestions = [];
		suggestions.push({ content: "play", description: "播放" });
		suggestions.push({ content: "stop", description: "停止" });

		// Set first suggestion as the default suggestion
		chrome.omnibox.setDefaultSuggestion({description:'搜索歌曲'});

		// Remove the first suggestion from the array since we just suggested it
		// suggestions.shift();

		// Suggest the remaining suggestions
		suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(function(text){
	console.log(text)
})
