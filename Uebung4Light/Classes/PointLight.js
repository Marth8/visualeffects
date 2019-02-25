import GL from "./GL.js";
import Light from "./Light.js";

class PointLight extends Light {
    constructor(colorUniform, ambient, diffuse, specular, v0, v1, v2, direction)
    {
        super(colorUniform, ambient, diffuse, specular, v0, v1, v2, direction)
        this.direction = direction;
    }

    bind(shader)
    {
        super.bind(shader)
        shader.setUniform3f(this.colorUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
    }
}

export default PointLight