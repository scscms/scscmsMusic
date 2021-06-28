const changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', (data) => {
    changeColor.style.backgroundColor = data.color;
    changeColor.innerText = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    console.log(color);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.body.style.backgroundColor = "' + color + '";'}
        );
    });
  };
