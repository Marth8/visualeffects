import GL from "./GL.js";

/**
 * Klasse repräsentiert das vertexArray.
 */
class VertexArray {
    /**
     * Methode zum Erstellen des VertexArrays.
     */
    constructor()
    {
        // Kontext holen und VertexArray erstellen
        const gl = this.gl = GL.getGL();
        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);
    }

    /**
     * Methode zum Binden des VertexArrays.
     */
    bind()
    {
        this.gl.bindVertexArray(this.vertexArray);
    }

    /**
     * Methode zum Hinzufügen des VertexArrays.
     * @param {VertexBuffer} vb Der Vertexbuffer
     * @param {array} vbElements Die Locationen des Attributes.
     * @param {int} stride Die Anzahl der Elemente pro Position.
     */
    addBuffer(vb, vbElements, stride)
    {
        // Sich selber und den Buffer binden
        this.bind();
        vb.bind();

        // Alle Attribute mit der übergebenen Stride dem VertexArray hinzufügen
        let offset = 0;
        for(let i = 0; i < vbElements.length; i++)
        {
            let element = vbElements[i];

            // Attribut aktivieren
            this.gl.enableVertexAttribArray(element);

            // Dem Attribut mitteilen, wie die Daten ermittelt werden
            this.gl.vertexAttribPointer(element, stride, this.gl.FLOAT, false, stride * i, offset);

            // Nur floats, Offset erhöhen
            offset += element.count * 4;
        }
        
    }
}

export default VertexArray