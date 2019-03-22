import GL from "./GL.js";
import Shader from "./Shader.js";
import Color from "./Color.js";
import Cube from "./Cube.js";

// Den vsString für das Licht anlegen
const vsSourceString =
    `
    struct Material
    {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };
    uniform Material material;
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    varying vec3 vNormal;
    varying vec3 vAmbient;
    uniform mat4 uTransform;
    void main() { 
        vNormal = aNormal;
        vAmbient = material.ambient;
        gl_PointSize = 10.0;
        gl_Position = uTransform * vec4(aPosition, 1.0);
    }`;

// Den fsString für das Licht anlegen
const fsSourceString =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 uColor;
    void main() {
        gl_FragColor = vec4(uColor, 1.0);
    }`;

/**
 * Klasse repräsentiert ein Licht.
 */
class Light 
{
    /**
     * Konstruktor zum Erstellen eines Lichtes.
     * @param {string} lightUniform Der Uniformname des Lichts.
     * @param {float} ambient Der Ambientanteil.
     * @param {float} diffuse Der Diffuseanteil.
     * @param {float} specular Der Specularanteil.
     * @param {vec3} position Der Positionsanteil.
     * @param {vec3} color Die Farbe des Lichtes.
     */
    constructor(lightUniform, position, ambient= [1, 0.5, 0.31], diffuse = [1, 0.5, 0.31], specular = [0.5, 0.5, 0.5], color = [1.9, 1.0, 1.0])
    {
        this.gl = GL.getGL();
        this.lightUniform = lightUniform;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.isOn = 1;
        this.type = null;
        this.position = position;
        this.color = color;
    }

    /**
     * Methode zum Binden des Lichts.
     * @param {Shader} shader Der Shader.
     * @param {ViewCamera} camera Die Kamera.
     */
    bind(shader, camera)
    {
        // Die Uniforms setzen
        shader.setUniform3f(this.lightUniform + ".position", this.position[0], this.position[1], this.position[2]);
        shader.setUniform3f(this.lightUniform + ".ambient", this.ambient, this.ambient, this.ambient);
        shader.setUniform3f(this.lightUniform + ".diffuse", this.diffuse, this.diffuse, this.diffuse);
        shader.setUniform3f(this.lightUniform + ".specular", this.specular, this.specular, this.specular);
        shader.setUniform1i(this.lightUniform + ".isOn", this.isOn);
        shader.setUniform3f(this.lightUniform + ".color", this.color[0], this.color[1], this.color[2])
    }

    /**
     * Methode zum ermitteln der Viewmatrix des Lichtes.
     */
    getViewMatrix()
    {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, [0.001, 0.001, 0.001], [0, 1, 0]);
        return viewMatrix;
    }
    
    /**
     * Methode zum Erstellen eines Lightcubes an der Stelle des Lichtes.
     */
    getLightCube()
    {
        let program = this.gl.createProgram();
        let shader = new Shader(program, vsSourceString, fsSourceString);
        shader.bind();
        let color = new Color("uColor", shader, 1, 1, 1, 32, 1, 1, 1);
        let lightCube = new Cube(shader, false, color, null);
        return lightCube;
    }
}

export default Light