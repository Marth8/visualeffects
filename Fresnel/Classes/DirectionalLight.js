import Light from "./Light.js";

/**
 * Klasse repräsentiert ein direktionales Licht.
 */
class DirectionalLight extends Light 
{
    /**
     * Konstruktor zum Erstellen eines direktionalen Lichtes.
     * @param {string} lightUniform Das Uniform für das Licht.
     * @param {float} ambient Der Ambientanteil.
     * @param {float} diffuse Der Diffuseanteil.
     * @param {float} specular Der Specularanteil.
     * @param {vec3} position Die Position des Lichts.
     * @param {vec3} direction Die Richtung des Lichts.
     * @param {vec3} color Die Lichtfarbe.
     */
    constructor(lightUniform, position, direction, ambient = 0.3, diffuse = 0.6, specular = 0.7, color = [1.0, 1.0, 1.0])
    {
        super(lightUniform, position, ambient, diffuse, specular, color)
        this.direction = direction;
        this.type = "d";
    }

    /**
     * Methode zum Binden des Lichtes.
     * @param {Shader} shader Der Shader.
     * @param {ViewCamera} camera Die Kamera.
     */
    bind(shader, camera)
    {
        super.bind(shader)

        // Die Richtung setzen
        shader.setUniform3f(this.lightUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
    }

    /**
     * Methode zum ermitteln der Viewmatrix des Lichtes. [0.001, 0.001, 0.001]
     */
    getViewMatrix()
    {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, this.direction, [0, 1, 0]);
        return viewMatrix;
    }
}

export default DirectionalLight