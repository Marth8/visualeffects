import GL from "./GL.js";

/**
 * Klasse repräsentiert einen Indexbuffer.
 */
class IndexBuffer {
    /**
     * Konstruktor zum Erstellen des Indexbuffers.
     * @param {array} data Die Daten des Indexbuffers.
     */
    constructor(data)
    {
        // GL-Kontext holen
        const gl = this.gl = GL.getGL();

        // Parameter merken
        this.data = data;
        this.count = data.length;

        // Den Buffer erstellen
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    }

    /**
     * Methode zum Binden des Buffers.
     */
    bind()
    {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}

export default IndexBuffer