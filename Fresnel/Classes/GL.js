/**
 * Klasse repräsentiert den GL-Kontext.
 */
class GL {
    /**
     * Erstellt den GL-Kontext.
     * @param {HTMLElement} canvas Das Canvas-Element.
     */
    static loadGL(canvas) {
        return GL.instance = canvas.getContext('webgl2', {alpha: true, depth: true});
    }

    /**
     * Holt den GL-Kontext.
     */
    static getGL() {
        return GL.instance;
    }
}

export default GL;