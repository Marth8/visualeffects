import GL from './GL.js';
import Shader from "./Shader.js";
import GameObject from "./Gameobject.js"
class Renderer
{
    constructor()
    {
       this.gl = GL.getGL();
    }

    draw(vertexArray, indexBuffer, shader)
    {
        shader.bind();
        vertexArray.bind();
        indexBuffer.bind();

        this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);

        // offset is 0, with 1 element
        //gl.drawArrays(gl.TRIANGLES, 0, ib.getCount());
    }

    drawGameObject(gameObject, shader)
    {
        shader.bind();
        gameObject.draw();
    }
    
    clear()
    {
        // Clear the canvas (setting the background color)
        this.gl.clearColor(0.47, 0.66, 0.25, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Clear the depth buffer. Saves the depth for each pixel.
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        // Tiefentest einschalten.
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

export default Renderer;