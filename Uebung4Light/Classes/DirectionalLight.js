import GL from "./GL.js";
import Light from "./Light.js";

class DirectionalLight extends Light {
    constructor(colorUniform, ambient, diffuse, specular, shader, v0, v1, v2, direction)
    {
        super(colorUniform, ambient, diffuse, specular, shader, v0, v1, v2, direction)
        this.direction = direction;
    }

    bind()
    {
        super.bind()
        this.shader.setUniform3f(this.colorUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
    }
}

export default DirectionalLight