import GL from "./GL.js";
import Transform from "./Transform.js";
import VertexArray from "./VertexArray.js";
import IndexBuffer from "./IndexBuffer.js";

/**
 * Die Klasse repräsentiert ein GameObject.
 */
class GameObject
{
    /**
     * Konstruktor zum Erstellen des GameObjektes.
     */
    constructor()
    {
        this.gl = GL.getGL();
        this.vertexArray = new VertexArray();
        this.indexBuffer = new IndexBuffer([]);
        this.material = null;
        this.transform  = new Transform();
    }

    /**
     * Methode zum Zeichnen des GameObjektes.
     * @param {boolean} withMaterial Ob das Material mitbenutzt werden soll.
     */
    draw(withMaterial = true)
    {
        // Den Vertexarray und den Indexbuffer binden
        this.vertexArray.bind();
        this.indexBuffer.bind();

        // Falls gewünscht, das Material binden
        if (withMaterial)
        {
            this.material.bind();
        }

        // Das Objekt zeichnen
        this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }
}
export default GameObject