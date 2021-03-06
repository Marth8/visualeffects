import GL from "./GL.js";
import Light from "./Light.js";

class DirectionalLight extends Light {
    constructor(colorUniform, ambient, diffuse, specular, direction)
    {
        super(colorUniform, ambient, diffuse, specular)
        this.direction = direction;
    }

    bind(shader)
    {
        super.bind(shader)
        shader.setUniform3f(this.colorUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
    }
}

export default DirectionalLight