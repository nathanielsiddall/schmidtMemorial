// src/utils/ImageLoader.js
class ImageLoader {
    static load(url) {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = err => reject(err);
        });
    }
}

export default ImageLoader;
