import Material from './Material.js';

/**
 * Klasse repräsentiert die Farbe eines Objektes.
 */
class Color extends Material
{
    /**
     * Konstruktor zum Erstellen einer Farbe.
     * @param {Shader} shader Der Shader.
     * @param {vec3} ambient Der Ambientanteil.
     * @param {vec3} diffuse Der Diffuseanteil.
     * @param {vec3} specular Der Specularanteil.
     * @param {float} shininess Das Glänzen. 
     * @param {float} v0 Der erste Farbwert.
     * @param {float} v1 Der zweite Farbwert.
     * @param {float} v2 Der dritte Farbwert.
     * @param {float} v3 Der vierte Farbwert.
     */
    constructor(shader, ambient, diffuse, specular, shininess, v0, v1, v2, v3)
    {
        super(shader, ambient, diffuse, specular, shininess);
        this.v0 = v0; 
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    /**
     * Bindet die Farbe auf den aktuellen Shader und setzt die Uniforms.
     */
    bind()
    {
        super.bind();
        
        // Je nach Anzahl der Parameter die Farbe setzen.
        if(!this.v3)
        {
            this.shader.setUniform3f("uColor", this.v0, this.v1, this.v2);
        }
        else
        {
            this.shader.setUniform4f("uColor", this.v0, this.v1, this.v2, this.v3);
        }
    }

}

export default Color