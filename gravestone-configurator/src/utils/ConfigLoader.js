// src/utils/ConfigLoader.js
class ConfigLoader {
    static load(url) {
        return fetch(url).then(res => res.json());
    }
}

export default ConfigLoader;
