'use strict';

var gConfig = undefined;
function getConfig() {
    if (gConfig) {
        return Promise.resolve({ config: gConfig });
    }
    else {
        return browser.storage.local.get({ config : {} }).then((data) => {
            Object.keys(data.config).forEach((host) => {
                if (typeof(data.config[host]) === "string") {
                    data.config[host] = { complete: data.config[host] };
                }
            });;
            return data;
        });
    }
}

function eatContents(type) {
    return getConfig().then(({ config }) => {
        const patterns = config[location.host];
        if (!patterns || !patterns[type]) return false;
        if (Array.isArray(patterns[type])) {
            patterns[type] = patterns[type].join(",");
        }
        document.querySelectorAll(patterns[type]).forEach(function(elem) {
            elem.remove();
        });
        return true;
    });
};

function eatContentsRepeatedly() {
    const isComplete = (document.readyState === "complete");
    eatContents("loading").then((result) => {
        if (result && !isComplete) {
            setTimeout(eatContentsRepeatedly, 1000);
        }
    });
}

function init() {
    eatContentsRepeatedly();
    const workAfterLoad = () => eatContents("complete");
    if (document.readyState === "loading") {
        window.addEventListener(
            "load", workAfterLoad, { capture: true, once: true });
    }
    else {
        workAfterLoad();
    }
}

init();

