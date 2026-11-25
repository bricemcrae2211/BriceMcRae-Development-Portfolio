"use strict";

window.ProjectImageReader = (() => {
    function readImageFile(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith("image/")) {
                reject(new Error("Please select a valid image."));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result !== "string" || !reader.result.startsWith("data:image/")) {
                    reject(new Error("Could not convert the image."));
                    return;
                }
                resolve(reader.result);
            };
            reader.onerror = () => reject(new Error("Could not read the image file."));
            reader.readAsDataURL(file);
        });
    }

    function verifyImageData(imageData) {
        return new Promise((resolve, reject) => {
            if (typeof imageData !== "string" || !imageData.startsWith("data:image/")) {
                reject(new Error("The image data is missing or invalid."));
                return;
            }

            const image = new Image();
            image.onload = () => {
                if (image.naturalWidth && image.naturalHeight) resolve(true);
                else reject(new Error("The image could not be decoded."));
            };
            image.onerror = () => reject(new Error("The image is unreadable or damaged."));
            image.src = imageData;
        });
    }

    return { readImageFile, verifyImageData };
})();
