import GameObject from "./GameObject.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";

// Die Vertices anlegen
const vertices = new Float32Array([   
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
   -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
   -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
 ]);

 //  Die Texturkoordinaten anlegen
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

// Die Indizes anlegen
const indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
]);

// Die Normalen anlegen
const normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
]);

/**
 * Klasse repräsentiert einen Cube.
 */
class Cube extends GameObject
{
    /**
     * Konstruktor zum Erstellen eines Cubes.
     * @param {Shader} shader Der Shader.
     * @param {boolean} hasTexture Ob der Cube eine Texture hat.
     * @param {Color} color Die Farbe des Cubes.
     * @param {Texture} texture Die Texture des Cubes.
     * @param {int} type Der Typ des Objektes. (n = "normal", r = "full reflective").
     */
    constructor(shader, hasTexture, color, texture, type = "n")
    {
        super(type);
        
        // Den Indexbuffer erstellen
        this.indexBuffer = new IndexBuffer(indices);

        // Die Parameter merken
        this.shader = shader;
        this.color = color;
        this.texture = texture;
        this.hasTexture = hasTexture;
        this.canBeDrawn = true;

        // Den Shader binden
        this.shader.bind();
        
        // Das VertexArray erstellen
        this.vertexArray = new VertexArray();

        // Erstellen des Buffers für die Position und den Normalen
        const vb1 = new VertexBuffer(vertices);
        let posAttribLocation = shader.getParameter("aPosition");
        const vb2 = new VertexBuffer(normals);
        let normalAttribLocation = shader.getParameter("aNormal");

        // Hinzufügen der Buffer zum VertexArray.
        this.vertexArray.addBuffer(vb1, [posAttribLocation], 3);
        this.vertexArray.addBuffer(vb2, [normalAttribLocation], 3);

        if (hasTexture)
        {
            // Einen weiteren Vertexbuffer für die Texturkoordinaten ergänzen
            const vb2 = new VertexBuffer(textureCoordinates);
            let texCoordsAttribLocation = shader.getParameter("aTexCoord");
            this.vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);

            // Die Textur als Material setzen
            this.material = texture;
        }
        else
        {
            // Die Farbe setzen
            this.material = color;
        }
    }    
}

export default Cube
