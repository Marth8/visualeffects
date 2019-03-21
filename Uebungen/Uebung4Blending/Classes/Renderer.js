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

        // Zeichnen der Elemente
        this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    drawGameObject(gameObject, shader, camera)
    {
        shader.bind();
        gameObject.draw();
        let matrix = camera.getViewProjectionMatrix();
        mat4.multiply(matrix, matrix, gameObject.transform.getWorldMatrix());
        shader.setUniformMatrix4fv("uTransform", false, matrix);
    }
    
    drawElement(element, camera)
    {
        element.shader.bind();
        element.gameObject.draw();
        let matrix = camera.getViewProjectionMatrix();
        mat4.multiply(matrix, matrix, element.gameObject.transform.getWorldMatrix());
        element.shader.setUniformMatrix4fv("uTransform", false, matrix);
    }

    drawElements(elements, camera, zSorting)
    {
        if (zSorting)
        {
            const sorting = [];
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    let zMatrix = mat4.create();
                    mat4.multiply(zMatrix, camera.getViewMatrix(), element.gameObject.transform.getWorldMatrix());
                    let zPos = zMatrix[14];
                    sorting.push({element: element, z: zPos});
                }
            }

            sorting.sort((a, b) => a.z - b.z);

            for(let zElement of sorting)
            {
                this.drawElement(zElement.element, camera);
            }
        }
        else
        {
            for(let element of elements)
            {
                if(element.canBeDrawn)
                {
                    this.drawElement(element, camera);
                }
            }
        }
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