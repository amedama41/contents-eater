'use strict';

var gConfig = undefined;
function getConfig() {
    if (gConfig) {
        return Promise.resolve({ config: gConfig });
    }
    else {
        return browser.storage.local.get({ config : {} });
    }
}

function eatContents() {
    getConfig().then(({ config }) => {
        const patterns = config[location.host];
        if (!patterns) return;
        document.querySelectorAll(patterns).forEach(function(elem) {
            elem.parentNode.removeChild(elem);
        });
    });
};

function init() {
    const workAfterLoad = () => {
        eatContents();
        setTimeout(eatContents, 1500);
    };
    if (document.readyState === "loading") {
        window.addEventListener(
            "DOMContentLoaded", workAfterLoad, { capture: true, once: true });
    }
    else {
        workAfterLoad();
    }
}

init();

