import {$on, resize, getParameterByName, getLang, setLang, getOperatingSystem} from './helpers';
import {IOSDownload} from './ios';
import {AndroidDownload} from './android';

$on(window, 'load', () => {
    resize();
    // 获取hash， 如 #/android?lang=cn
    const raw = document.location.hash;
    const route = raw.replace(/^#\//, '');
    // 获取类型 ios / android, 从路由获取或者
    const type = route.split('?')[0] || getOperatingSystem();
    // 获取
    const lang = getParameterByName('lang', route) || getLang();
    // setLang(lang);
    if (type === 'ios') {
        const ios = new IOSDownload(lang);
        ios.init();
    } else {
        const android = new AndroidDownload(lang);
        android.init();
    }
})