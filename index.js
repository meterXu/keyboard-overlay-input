let page = document.querySelector('#app')
let currentInput = null // 当前聚焦的输入框
let lastInnerHeight = window.innerHeight

function calcScrollTop (visualHeight, scrollObj) {
    scrollObj = scrollObj || window
    let currentInputTop = currentInput.getBoundingClientRect().top
    // 已经偏移（滚动）的量
    let yOffset = window.pageYOffset
    if (scrollObj !== window) {
        yOffset = scrollObj.scrollTop
    }
    // 不在可视视口中
    // 被软键盘遮住
    if (currentInputTop > visualHeight) {
       console.log('在视口下')
        scrollObj.scrollTo(0, yOffset + currentInputTop - visualHeight / 2 + currentInput.offsetHeight / 2)
        // 滚上去了可视视口，被视口遮住
    } else if (currentInputTop < 0) {
        console.log('在视口上')
        scrollObj.scrollTo(0, yOffset - currentInputTop - visualHeight / 2 + currentInput.offsetHeight / 2)
    }
}

function handleClickPage (e) {
    let el = e || window.event
    if (/^input$/i.test(el.target.tagName)) {
        currentInput = el.target
    }
}

function handleAndroidResize () {
    let resizeHeight = lastInnerHeight - window.innerHeight // 本次变动量
    lastInnerHeight = window.innerHeight // 记录目前的可视窗口高度，以便下次计算resize变动量
    // 弹出软键盘
    if (resizeHeight > 200 && currentInput) {
        setTimeout(function () {
            // 第二个参数，如果当前布局结构是页面容器设置了高度和可视视口高度一样，滚动条是属于这个H5容器的而不是window，如例子中的div.page，
            // 则第二个参数要传滚动容器的dom对象，如 document.querySelector('.page')
            calcScrollTop(window.innerHeight, window)
        }, 150)
    }
}

function focusinPage (e) {
    currentInput = (e || window.event).target
    setTimeout(function () {
        // 第二个参数采用默认的window，在ios中不论页面布局怎样，只要软键盘出现前已经出现过可视视口的，那么软键盘出现后必然能通过webview平移看得到
        calcScrollTop(window.visualViewport.height)
    }, 300)
}

export default function (){
    // ios情况下
    if (/iphone|ipad|ipod|ios/i.test(navigator.userAgent)) {
        page.addEventListener('focusin', focusinPage)
    } else {
        page.addEventListener('click', handleClickPage, true)
        window.addEventListener('resize', handleAndroidResize)
    }
}