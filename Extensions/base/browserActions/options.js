const page = document.getElementById('buttonDiv');

const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
kButtonColors.forEach(color=>{
    let button = document.createElement('button');
    button.style.width = '70px';
    button.style.backgroundColor = color;
    button.innerText = color;
    button.addEventListener('click', function () {
        chrome.storage.sync.set({color: color}, function () {
            document.querySelector('p').innerText = 'color is ' + color
        })
    });
    page.appendChild(button);
})
