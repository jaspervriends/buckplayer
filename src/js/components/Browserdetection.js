'use strict';

class Browserdetection
{
    currentBrowser = null;

    // Check all browsers
    constructor()
    {
        this.isIE();
        this.isEdge();
        this.isFirefox();
        this.isOpera();
        this.isSafari();
        this.isChrome();
    }

    browser()
    {
        return this.currentBrowser;
    }

    // Chrome
    isChrome()
    {
        if(!!window.chrome && !!window.chrome.webstore)
        {
            this.currentBrowser = 'chrome';
            return true;
        }

        return false;
    }

    // Firefox
    isFirefox()
    {
        if(typeof InstallTrigger !== 'undefined')
        {
            ths.currentBrowser = 'firefox';
            return true;
        }

        return false;
    }

    // Safari
    isSafari()
    {
        if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)))
        {
            this.currentBrowser = 'safari';
            return true;
        }

        return false;
    }

    isOpera()
    {
        if((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
        {
            this.currentBrowser = 'opera';
            return true;
        }

        return false;
    }

    // Edge
    isEdge()
    {
        if(!this.isIE() && !!window.StyleMedia)
        {
            this.currentBrowser = "edge";
            return true;
        }

        return false;
    }

    // Internet Explorer
    isIE()
    {
        if(/*@cc_on!@*/false || !!document.documentMode)
        {
            this.currentBrowser = "ie";
            return true;
        }

        return false;
    }
}

export default Browserdetection;