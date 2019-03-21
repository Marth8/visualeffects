import GL from "./GL.js";
import Light from "./Light.js";

class HeadLight extends Light {
    constructor(colorUniform, ambient, diffuse, specular, position, direction, cutoff)
    {
        super(colorUniform, ambient, diffuse, specular)
        this.direction = direction;
        this.position = position;
        this.cutoff = Math.cos(cutoff * (Math.PI / 180));
        this.type = "h";
    }

    bind(shader)
    {
        super.bind(shader)
        shader.setUniform3f(this.colorUniform + ".direction", this.direction[0], this.direction[1], this.direction[2]);
        shader.setUniform3f(this.colorUniform + ".position", this.position[0], this.position[1], this.position[2]);
        shader.setUniform1f(this.colorUniform + ".cutOff", this.cutoff);
    }
}

export default HeadLight