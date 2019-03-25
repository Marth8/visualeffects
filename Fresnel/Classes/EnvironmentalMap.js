class EnvironmentalMap
{
    constructor(shader, slot, renderFunction)
    {
        // Kontext erstellen
        const gl = this.gl = GL.getGL();

        // Parameter merken
        this.slot = slot;
        this.shader = shader;

        // Textur erstellen und binden
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        // CubeMap erstmal mit roten Pixel füllen
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 1, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 2, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 3, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 4, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 5, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));

        // Die Szene 6 mal anhand der Renderfunction rendern und die verschiedenen Bilder des von Framebuffer auf Cubemap speichern
        /*
        // Sobald geladen, das Bild auf die Textur setzen
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        */

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
}

export default EnvironmentalMap