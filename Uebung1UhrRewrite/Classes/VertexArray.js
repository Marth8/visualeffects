import GL from "./GL.js";
import Renderer from "./Renderer";
const gl = GL.getGL();

class VertexArray {
    constructor(stride)
    {

    }

    addBuffer(vb, vbElements, stride)
    {
        vb.bind();

        let offset = 0;
        for(let i = 0; i < vbElements.length; i++)
        {
            let element = vbElements[i];

            // Tell WebGL how to take date from the buffer and supply it to
            // the attribute in the shader. For that, its necessary to turn
            // the attribute on.
            gl.enableVertexAttribArray(i);

            // Tell the attribute how to get data out of positionBuffer.
            gl.vertexAttribPointer(i, element.count, gl.FLOAT, element.normalized, stride * element.count, offset);

            // Nur floats
            offset += element.count * 4;
        }
    }
}

export default VertexArray