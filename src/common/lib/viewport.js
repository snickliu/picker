const win = window
const rootEl = document.documentElement
const isAndroidDevice = win.navigator.appVersion.match(/android/gi)
const isIPhoneDevice = win.navigator.appVersion.match(/iphone/gi)

const init = (absDpr) => {
  let tid = null
  rootEl.setAttribute('data-dpr', absDpr || win.devicePixelRatio)
  rootEl.setAttribute('data-device-type', isIPhoneDevice ? 'iphone' : (isAndroidDevice ? 'android' : 'other'))

  const refreshRem = () => {
    let deviceWidth = rootEl.clientWidth
    if (deviceWidth > 750) deviceWidth = 750
    rootEl.style.fontSize = deviceWidth / 7.5 + 'px'
  }

  win.addEventListener('resize', () => {
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 300)
  }, false)
  win.addEventListener('pageshow', (e) => {
    if (e.persisted) { // 页面从浏览器缓存中读取时
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    }
  }, false)

  refreshRem()
}

const rem = function () {
  return parseFloat(win.getComputedStyle(rootEl, null).fontSize, 10)
}

const px2rem = function (px) {
  return px / rem()
}

const rem2px = function (rem) {
  return rem * rem()
}

const currentDpr = function () {
  return rootEl.hasAttribute('data-dpr') ? parseInt(rootEl.hasAttribute('data-dpr'), 10) : devicePixelRatio
}

const isAndroid = function () {
  return !!isAndroidDevice
}

const isIPhone = function () {
  return !!isIPhoneDevice
}

const getDeviceType = function () {
  return isIPhoneDevice ? 'iphone' : (isAndroidDevice ? 'android' : 'other')
}

export default {
  init,
  px2rem,
  rem2px,
  rem,
  currentDpr,
  isAndroid,
  isIPhone,
  getDeviceType
}
