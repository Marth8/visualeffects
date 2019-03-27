import Transform from "./Transform.js";
import VertexArray from "./VertexArray.js";
import VertexBuffer from "./VertexBuffer.js";
import IndexBuffer from "./IndexBuffer.js";
import GameObject from "./Gameobject.js";

/**
 * Klasse repräsentiert ein Objekt einer .obj-Datei.
 */
class Object extends GameObject
{
    /**
     * Konstruktor zum Erstellen des Objektes.
     * @param {Shader} shader Der Shader.
     * @param {string} file Der Dateipfad..
     * @param {float} scaleFac Der Skalierungsfaktor.
     * @param {Color} color Die Farbe.
     * @param {Texture} texture Die Texture.
     * @param {int} type Der Typ des Objektes. (n = "normal", fr = "full reflective", r = "reflective", s = "simple").
     * @param {Transform} transform Die Transformierung.
     */
    constructor(shader, file, scaleFac, color = null, texture = null, type = "n", transform = new Transform())
    {
        super(type);
        
        // Parameter merken
        this.transform  = transform;
        this.canBeDrawn = false;
        this.texture = texture;
        this.color = color;
        this.shader = shader;

        // Shader binden
        this.shader.bind();

        // Das Material erstellen
        if(!this.texture)
        {
            this.material = this.color;
        }
        else
        {
            this.material = this.texture;
        }

        // XMLHttpRequest für das Objekt erstellen
        var request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.send();
        request.onload = () => {
            var objDoc = new OBJDoc(file);

            // parse parameters: fileString, scale, reverse
            if (!objDoc.parse(request.responseText, scaleFac, true)) {
                console.error("OBJ file parsing error: " + file);
                return;
            }

            var geo = objDoc.getDrawingInfo();

            // Vertexarray erstellen
            this.vertexArray = new VertexArray();

            // Die Vertexbuffer für die Position und den Normalen aus den Informationen erstellen
            this.vb1 = new VertexBuffer(geo.positions);
            this.posAttribLocation = shader.getParameter("aPosition");
            this.vb2 = new VertexBuffer(geo.normals);

            // Den Indexbuffer erstellen
            this.normalsAttribLocation = shader.getParameter("aNormal");
            this.indexBuffer = new IndexBuffer(geo.indices);

            // Die Veertexbuffer hinzufügen
            this.vertexArray.addBuffer(this.vb1, [this.posAttribLocation], 3);
            this.vertexArray.addBuffer(this.vb2, [this.normalsAttribLocation], 3);
 
            // Falls es eine Texture gibt, die Texturkoordinaten als VertexBuffer hinzufügen
            if (texture)
            {
                this.vb2 = new VertexBuffer(geo.texCoords);
                this.texCoordsAttribLocation = shader.getParameter("aTexCoord");
                this.vertexArray.addBuffer(this.vb2, [this.texCoordsAttribLocation], 2);
            }

            // Die Sachen dem GameObject setzen und signalisieren, dass das Objekt gezeichnet werden kann
            this.canBeDrawn = true;
        };
    }
}
export default Object