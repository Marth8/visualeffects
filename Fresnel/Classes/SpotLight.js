import Light from "./Light.js";
import ViewCamera from "./ViewCamera.js";

/**
 * Klasse repräsentiert ein Spotlight.
 */
class SpotLight extends Light {
    /**
     * Konstruktor zum Erstellen eines Spotlights.
     * @param {string} lightUniform Der Name des Uniforms.
     * @param {float} ambient Der Ambientanteil.
     * @param {float} diffuse Der Diffuseanteil.
     * @param {float} specular Der Specularanteil.
     * @param {vec3} position Die Position des Spotlights.
     * @param {vec3} direction Die Richtung des Spotlights.
     * @param {float} cutoff Der Cutoff-Angle.
     * @param {Color} color Die Farbe des Lichts.
     */
    constructor(lightUniform, ambient, diffuse, specular, position, direction, cutoff, color = [1, 1, 1])
    {
        super(lightUniform, ambient, diffuse, specular, position, color)
        this.direction = direction;
        this.cutoff = Math.cos(cutoff * (Math.PI / 180));
        this.type = "s";
    }

    /**
     * Methode zum Binden des Lichtes.
     * @param {Shader} shader Der Shader.
     * @param {ViewCamera} camera Die Kamera.
     */
    bind(shader, camera)
    {
        super.bind(shader)

        // Die Uniforms setzen
        shader.setUniform3f(this.lightUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
        shader.setUniform1f(this.lightUniform + ".cutOff", this.cutoff);
    }
}

export default SpotLight