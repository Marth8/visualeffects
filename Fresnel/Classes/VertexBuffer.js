import GL from "./GL.js";

/**
 * Klasse repräsentiert einen VertexBuffer.
 */
class VertexBuffer {
    /**
     * Konstruktor zum Erstellen des VertexBuffers.
     * @param {array} data Die Daten des VertexBuffers.
     */
    constructor(data)
    {
        // Kontext holen
        const gl = this.gl = GL.getGL();
        
        // Parameter merken        
        this.data = data;

        // Buffer erstellen
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    }

    /**
     * Methode zum Binden des Buffers.
     */
    bind()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
}

export default VertexBuffer