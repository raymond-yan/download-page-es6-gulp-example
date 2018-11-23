import {
    $on,
    getJSON,
    getById,
    initi18n,
    HttpGet
} from './helpers';

export class AndroidDownload {
    lang = 'cn';
    needExternalBrowser = false;
    externalDiv;
    url;
    constructor(lang) {
        getById('android').style.display = 'block';
        this.externalDiv = getById('download-external');
        this.lang = lang;
    }

    init() {
        this.getAndroidLink();
        this.checkBrowser();

        getJSON(`./i18n/${this.lang}.json`, (result) => {
            initi18n(result);
        })
        const imgFolder = (this.lang === 'cn' || this.lang === 'hk') ? 'cn' : 'en';
        getById('im-1-1').src = `./img/${imgFolder}/1-1.png`;
        getById('im-1-2').src = `./img/${imgFolder}/1-2.png`;
        getById('im-1-3').src = `./img/${imgFolder}/1-3.png`;
        getById('im-2-1').src = `./img/${imgFolder}/2-1.png`;
        getById('im-2-2').src = `./img/${imgFolder}/2-2.png`;

        $on(getById('button_android'), 'click', this.onDownload.bind(this));
        $on(this.externalDiv, 'click', ()=>{
            this.externalDiv.style.display = 'none';
        });
    }

    onDownload() {
        if (this.needExternalBrowser) {
            this.externalDiv.style.display = 'block';
        } else {
            window.open(this.url, '_blank');
        }
    }

    getAndroidLink() {
        getJSON(`${window.location.protocol}//${window.location.host}/android/version.json`, (result) => {
            this.url = `/android/${result.filename}`;
            console.log(result);
            console.log(this.url);
        });
    }

    checkBrowser() {
        const ua = navigator.userAgent;
        if (ua.indexOf('MicroMessenger') > -1 || ua.indexOf('WeiBo') > -1 || ua.indexOf('QQ') > -1) {
            this.needExternalBrowser = true;
            this.externalDiv.style.display = 'block';
        } else {
            this.needExternalBrowser = false;
            this.externalDiv.style.display = 'none';
        }
    }
}