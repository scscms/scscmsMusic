const div = document.getElementById('login')
div.addEventListener('mouseenter',function(e){
    const el = this
    const width = window.innerWidth
    const height = window.innerHeight
    const leftRnd = (Math.random() - 0.5) * 50
    const topRnd = (Math.random() - 0.5) * 20
    let btnLeft = e.clientX + (leftRnd > 0 ? 100 : -100) + leftRnd
    let btnTop = e.clientY + (topRnd > 0 ? 30 : -30) + topRnd
    btnLeft = btnLeft < 200 ? (btnLeft + width - 400) : (btnLeft > width - 200 ? btnLeft - width + 400 : btnLeft)
    btnTop = btnTop < 100 ? (btnTop + height - 200) : (btnTop > height - 100 ? btnTop - height + 200 : btnTop)
    el.style.position = 'fixed'
    el.style.left = btnLeft + 'px'
    el.style.top = btnTop + 'px'
    div.innerText = '你不要过来！'
},false)
document.body.addEventListener('click',()=>{
    div.style.cssText = ''
    div.innerText = '登录'
}, false)
