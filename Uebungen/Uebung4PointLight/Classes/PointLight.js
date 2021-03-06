import GL from "./GL.js";
import Light from "./Light.js";

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
}

export default PointLight