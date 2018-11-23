import {
    $on,
    getJSON,
    getById,
    initi18n
} from './helpers';

const url = 'https://itunes.apple.com/hk/app/id1437365453?mt=8';

const accounts = [{
        account: 'biciyuan1@gmail.com',
        password: 'Biciyuan88'
    },
    {
        account: 'wenqing0719@gmail.com',
        password: 'Biciyuan88'
    }
];

export class IOSDownload {
    lang = 'cn';
    constructor(lang) {
        getById('ios').style.display = 'block';
        this.lang = lang;
    }

    init() {
        getJSON(`./i18n/${this.lang}.json`, (result) => {
            initi18n(result);

            accounts.forEach(item => {
                getById('account-block').innerHTML +=
                    `
                    <div class="text-block text-hint">
                        <p>${result.ios_account} <span>${accounts[0].account}<span></p>
                        <p>${result.ios_password} <span>${accounts[0].password}<span></p>
                    </div>
                `
            });

            $on(getById('button_ios'), 'click', () => {
                window.open(url, '_blank');
            })
        })
    }
}