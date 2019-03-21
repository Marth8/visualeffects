import IndexBuffer from './IndexBuffer.js';
import VertexArray from './VertexArray.js';
import VertexBuffer from './VertexBuffer.js';
import GameObject from './GameObject.js';

/**
 * Klasse repräsentiert eine Kugel.
 */
class Sphere
{
    /**
     * Konstruktor zum Erstellen der Kugel.
     * @param {Shader} shader Der Shader.
     * @param {boolean} hasTexture Ob die Kugel eine Textur hat.
     * @param {Color} color Die Farbe der Kugel.
     * @param {Texture} texture Die Textur der Kugel.
     */
    constructor(shader, hasTexture, color, texture)
    {
        // Die Sphere initialisieren
        this.initSphere();

        // Parameter merken
        this.shader = shader;
        this.color = color;
        this.texture = texture;
        this.canBeDrawn = true;
        this.hasTexture = this.hasTexture;

        // Den Shader binden
        this.shader.bind();

        // Den Indexbuffer erstellen
        this.ib = new IndexBuffer(this.indices);
        let vertexArray = new VertexArray();

        // Die Vertexbuffer für die Normalen und Positionen erstellen
        const vb1 = new VertexBuffer(this.vertices);
        let posAttribLocation = shader.getParameter("aPosition");
        const vb2 = new VertexBuffer(this.vertices);
        let normalAttribLocation = shader.getParameter("aNormal");

        // Die Buffer hinzufügen
        vertexArray.addBuffer(vb1, [posAttribLocation], 3);
        vertexArray.addBuffer(vb2, [normalAttribLocation], 3);

        // Falls eine Textur vorliegt, noch den BUffer für die Texturkoordinaten hinzufügen
        if (hasTexture)
        {
            const vb2 = new VertexBuffer(textureCoordinates);
            let texCoordsAttribLocation = shader.getParameter("aTexCoord");
            vertexArray.addBuffer(vb2, [texCoordsAttribLocation], 2);

            // Das Element erstellen
            this.gameObject = new GameObject(vertexArray, this.ib, texture);
        }
        else
        {
            // Das Element erstellen
            this.gameObject = new GameObject(vertexArray, this.ib, color);
        }
    }

    /**
     * Methode zum Erstellen der Kugel.
     */
    initSphere()
    {
      let SPHERE_DIV = 12;
      let i, ai, si, ci;
      let j, aj, sj, cj;
      let p1, p2;

      // Vertices
      let vertices = [], indices = [];
      for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj);  // X
          vertices.push(cj);       // Y
          vertices.push(ci * sj);  // Z
        }
      }

      // Indices
      for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);

          indices.push(p1);
          indices.push(p2);
          indices.push(p1 + 1);

          indices.push(p1 + 1);
          indices.push(p2);
          indices.push(p2 + 1);
        }
      }

      this.indices = indices;
      this.vertices = vertices;
    }
}
export default Sphere