import GameObject from "./GameObject.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";

const cubePositions = new Float32Array([
    // vordere Fläche
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // hintere Fläche
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,
    
    // obere Fläche
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
    
    // untere Fläche
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // rechte Fläche
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,
    
    // linke Fläche
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
]);

const textureCoordinates = new Float32Array([
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
]);

const indices = [
    0,  1,  2,      0,  2,  3,    // vorne
    4,  5,  6,      4,  6,  7,    // hinten
    8,  9,  10,     8,  10, 11,   // oben
    12, 13, 14,     12, 14, 15,   // unten
    16, 17, 18,     16, 18, 19,   // rechts
    20, 21, 22,     20, 22, 23    // links
];

class Cube
{
    constructor(shader, hasTexture, color, texture)
    {
        this.ib = new IndexBuffer(indices);
        this.shader = shader;
        this.color = color;
        this.texture = texture;
        this.canBeDrawn = true;
        let vertexArray = new VertexArray();
        const vb1 = new VertexBuffer(cubePositions);
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

export default Cube
