import GL from "./GL.js";

class Light {
    constructor(colorUniform, ambient, diffuse, specular, color = [1, 1, 1])
    {
        this.colorUniform = colorUniform;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.isOn = 1;
        this.type = null;
        this.color = color;
    }

    bind(shader)
    {
        shader.setUniform3f(this.colorUniform + ".ambient", this.ambient, this.ambient, this.ambient);
        shader.setUniform3f(this.colorUniform + ".diffuse", this.diffuse, this.diffuse, this.diffuse);
        shader.setUniform3f(this.colorUniform + ".specular", this.specular, this.specular, this.specular);
        shader.setUniform1i(this.colorUniform + ".isOn", this.isOn);
        shader.setUniform3f(this.colorUniform + ".color", this.color[0], this.color[1], this.color[2])
    }
}

export default Light