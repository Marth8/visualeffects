import GL from "./GL.js";
import Light from "./Light.js";

/**
 * Klasse repräsentiert ein Punktlicht.
 */
class PointLight extends Light {
    /**
     * Konstruktor zum Erstellen des Punktlichtes.
     * @param {string} lightUniform Der Uniformname des Lichtes.
     * @param {float} ambient Der Ambientanteil.
     * @param {float} diffuse Der Diffuseanteil.
     * @param {float} specular Der Specularanteil.
     * @param {float} constant Die Konstante des Punktlichtes.
     * @param {float} linear Der Linearanteil des Punktlichtes.
     * @param {float} quadratic Der quadratische Anteil des Punktlichtes.
     * @param {vec3} position Die Position des Punktlichtes.
     * @param {vec3} color Die Farbe des Punktlichtes.
     */
    constructor(lightUniform, position, constant = 1.0, linear = 0.07, quadratic = 0.017, ambient = 0.1, diffuse = 0.6, specular = 0.5, color = [1.0, 1.0, 1.0])
    {
        super(lightUniform, position, ambient, diffuse, specular, color)
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.type = "p";
        this.gl = GL.getGL();
    }

    /**
     * Methode zum Binden des Punktlichtes.
     * @param {Shader} shader Der Shader.
     * @param {ViewCamera} camera Die Kamera.
     */
    bind(shader, camera)
    {
        super.bind(shader)

        // Die Uniforms setzen
        shader.setUniform1f(this.lightUniform + ".constant", this.constant);
        shader.setUniform1f(this.lightUniform + ".linear", this.linear);
        shader.setUniform1f(this.lightUniform + ".quadratic", this.quadratic);
    }
}

export default PointLight