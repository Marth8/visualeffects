import GameObject from "./GameObject.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";

const planePositions = new Float32Array([
        // vordere Fläche
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0
]);

const textureCoordinates = new Float32Array([
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
]);

const indices = [0,  1,  2, 0,  2,  3];

class Plane
{
    constructor(shader, hasTexture, color, texture)
    {
        this.ib = new IndexBuffer(indices);
        this.shader = shader;
        this.color = color;
        this.texture = texture;
        this.canBeDrawn = true;
        let vertexArray = new VertexArray();
        const vb1 = new VertexBuffer(planePositions);
        let posAttribLocation = shader.getParameter("aPosition");
        vertexArray.addBuffer(vb1, [posAttribLocation], 3);

        if (hasTexture)
        {
            const vb2 = new VertexBuffer(textureCoordinates);
            let texCoordsAttribLocation = shader.getParameter("aTexCoord");
            vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);
            this.gameObject = new GameObject(vertexArray, this.ib, texture);
        }
        else
        {
            this.gameObject = new GameObject(vertexArray, this.ib, color);
        }
    }    
}

export default Plane
