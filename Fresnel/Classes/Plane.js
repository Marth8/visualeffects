import GameObject from "./GameObject.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";

// Anlegen der Positionen der Plane
const planePositions = new Float32Array([
        // vordere Fläche
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0
]);

// Anlegen der Texturkoordinaten der Plane
const textureCoordinates = new Float32Array([
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
]);

// Anlegen der Indizes der Plane
const indices = [0,  1,  2, 0,  2,  3];

// Anlegen der Normalen der Plane
const normals = new Float32Array([    
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
]);

/**
 * Klasse repäsentiert eine ebene Fläche.
 */
class Plane extends GameObject
{
    /**
     * Konstruktor zum Erstellen der Plane.
     * @param {Shader} shader Der Shader.
     * @param {boolean} hasTexture Ob die Plane eine Texture hat.
     * @param {Color} color Die Farbe.
     * @param {Texture} texture Die Texture.
     * @param {boolean} hasNormals Ob die Plane normalen hat.
     */
    constructor(shader, hasTexture, color, texture, hasNormals = true)
    {
        super();

        // Parameter merken
        this.indexBuffer = new IndexBuffer(indices);
        this.shader = shader;
        this.color = color;
        this.texture = texture;
        this.canBeDrawn = true;

        // Shader binden
        this.shader.bind();

        // Vertexarray erstellen und VertexBuffer mit Positionen hinzufügen
        this.vertexArray = new VertexArray();
        const vb1 = new VertexBuffer(planePositions);
        let posAttribLocation = shader.getParameter("aPosition");
        this.vertexArray.addBuffer(vb1, [posAttribLocation], 3);

        // Falls die Normalen gefordert sind, diesen VertexBuffer erstellen und hinzufügen
        if (hasNormals)
        {
            const vb2 = new VertexBuffer(normals);
            let normalAttribLocation = shader.getParameter("aNormal");
            this.vertexArray.addBuffer(vb2, [normalAttribLocation], 3);
        }
        
        // Falls eine Texture gefordert ist, den Vertexbuffer für die Texturkoordinaten erstellen und hinzufügen
        // Danach das GameObject erstellen
        if (hasTexture)
        {
            const vb2 = new VertexBuffer(textureCoordinates);
            let texCoordsAttribLocation = shader.getParameter("aTexCoord");
            this.vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);

            // Das Material setzen
            this.material = this.texture;
        }
        else
        {
            // Das Material setzen
            this.material = this.color;
        }
    }    
}

export default Plane
