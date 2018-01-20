'use strict';

var gPatterns = undefined;
function getPatterns(host) {
    if (gPatterns) {
        return Promise.resolve(gPatterns);
    }
    else {
        return browser.storage.local.get({ config : {} }).then((data) => {
            let patterns = data.config[host];
            if (patterns && typeof(patterns) === "string") {
                patterns = { complete: patterns };
            }
            gPatterns = patterns;
            return patterns;
        });
    }
}

function eatContents(type) {
    return getPatterns(location.host).then((patterns) => {
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
    const options = { capture: true, once: true };
    if (document.readyState === "loading") {
        window.addEventListener(
            "DOMContentLoaded", () => eatContents("interactive"), options);
    }
    else {
        eatContents("interactive");
    }
    if (document.readyState !== "complete") {
        window.addEventListener(
            "load", () => eatContents("complete"), options);
    }
    else {
        eatContents("complete");
    }
}

init();

