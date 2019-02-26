import GL from "./GL.js";
import Light from "./Light.js";
import Shader from "./Shader.js";
import Color from "./Color.js";
import Cube from "./Cube.js";

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

class PointLight extends Light {
    constructor(colorUniform, ambient, diffuse, specular, position, constant, linear, quadratic, color = [1.0, 1.0, 1.0])
    {
        super(colorUniform, ambient, diffuse, specular, color)
        this.position = position;
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.type = "p";
        this.gl = GL.getGL();
    }

    bind(shader)
    {
        super.bind(shader)
        shader.setUniform3f(this.colorUniform + ".position", this.position[0], this.position[1], this.position[2]);
        shader.setUniform1f(this.colorUniform + ".constant", this.constant);
        shader.setUniform1f(this.colorUniform + ".linear", this.linear);
        shader.setUniform1f(this.colorUniform + ".quadratic", this.quadratic);
    }

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

export default PointLight