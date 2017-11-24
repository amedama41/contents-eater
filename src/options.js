"use strict";

window.addEventListener("DOMContentLoaded", (e) => {
    const setErrorMessage = (message) => {
        document.getElementById("message").innerText = message;
    };
    const input = document.getElementById("import");
    input.addEventListener("change", (e) => {
        setErrorMessage("");
        const files = e.target.files;
        if (files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                browser.storage.local.set({
                    config: JSON.parse(reader.result)
                }).then(() => {
                    setErrorMessage("Success import");
                }).catch((error) => {
                    setErrorMessage(error);
                });
            }
            catch (e) {
                setErrorMessage(e.message);
            }
        };
        reader.onerror = () => {
            setErrorMessage(reader.error.message);
        };
        reader.readAsText(files[0]);
    });
});

