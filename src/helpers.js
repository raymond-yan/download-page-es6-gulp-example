/**
 * querySelector wrapper
 *
 */
export function getById(id) {
	return document.getElementById(id);
}


export function $on(target, type, callback, capture) {
	target.addEventListener(type, callback, !!capture);
}

export function getJSON(url, callback) {
    HttpGet(url, (result) => {
        callback(JSON.parse(result));
    });
}

export function HttpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

export function resize() {
    var reCalc = function(){
        var deviceWidth = document.documentElement.clientWidth;
        // 最大分辨率为1280，大于1280访问PC页面
        if(deviceWidth > 640) deviceWidth = 640;
        var fontSize = deviceWidth / 23.4375;
        document.getElementsByTagName("html")[0].style.fontSize = fontSize + 'px';
    };
    reCalc();
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, reCalc, false);
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function initi18n(i18n) {
    Object.keys(i18n).forEach( key => {
        if (getById(key)) {
            getById(key).innerText = i18n[key];
        }
    })
}

export function getLang() {
    return localStorage.getItem('lang') || getBrowserLang();
}

export function setLang(lang) {
    return localStorage.setItem('lang', lang);
}

export function getBrowserLang() {
    const cn = ['zh-CN', 'zh', 'zh-CHS', ];
    const hk = ['zh-HK', 'zh-MO', 'zh-SG', 'zh-TW', 'zh-CHT']
    const language = navigator.languages && navigator.languages[0] ||
               navigator.language ||
               navigator.userLanguage;
    if (cn.indexOf(language) > -1) {
        return 'cn';
    } else if (hk.indexOf(language) > -1) {
        return 'hk';
    } else {
        return 'en';
    }
}

export function getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window['opera'];
    if (/android/i.test(userAgent)) {
        return 'android';
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window['MSStream']) {
        return 'ios';
    }
    return 'android';
  }