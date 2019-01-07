import GL from "./GL.js";
const gl = GL.getGL();

class VertexBuffer {
    constructor(data)
    {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, data);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    bind()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, data);
    }

    cleanup()
    {
        gl.deleteBuffer(this.buffer);
    }
}

export default VertexBuffer