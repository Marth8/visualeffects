import GL from "./GL.js";
const gl = GL.getGL();

class VertexBuffer {
    constructor(data)
    {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    }

    bind()
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data);
    }

    cleanup()
    {
        gl.deleteBuffer(this.buffer);
    }
}

export default VertexBuffer