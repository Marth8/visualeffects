import GL from "./GL.js";

/**
 * Klasse repräsentiert einen Framebuffer.
 */
class FrameBuffer {
    /**
     * Konstruktor zum Erstellen des Framebuffers.
     * @param {float} height Die Höhe des gespeicherten Bildes.
     * @param {float} width Die Breite des gespeicherten Bildes.
     */
    constructor(height, width, slot = 0)
    {
        // GL holen und die Parameter merken
        const gl = this.gl = GL.getGL();
        this.width = width;
        this.height = height;

        // Die Tiefen- und Colormap erstellen
        this.depthMap = gl.createTexture();
        this.colorMap = gl.createTexture();

        // Den Framebuffer erstellen
        this.frameBuffer = gl.createFramebuffer();

        // Die Texture der Tiefenmap als Tiefenmap binden und die Parameter setzen
        gl.bindTexture(gl.TEXTURE_2D, this.depthMap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Die Texture der Colormap als Colorbild binden und die Parameter setzen
        gl.bindTexture(gl.TEXTURE_2D, this.colorMap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Den Framebuffer binden und die Colormap und Tiefenmap binden
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorMap, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthMap, 0);

        // Den Status des Framebuffers überprüfen
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status != gl.FRAMEBUFFER_COMPLETE) {
            console.warn("FBO status: " + status);
        }
        
        // Den Buffer entbinden
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * Methode zum Binden des Framebuffers.
     */
    bind()
    {
        // Den Viewport setzen
        this.gl.viewport(0, 0, this.width, this.height);

        // Den Framebuffer binden und das Bild clearen
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Methode zum Unbinden des Framebuffers.
     */
    unbind()
    {
        // Den Framebuffer unbinden
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
}

export default FrameBuffer