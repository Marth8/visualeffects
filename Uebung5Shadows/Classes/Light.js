import GL from "./GL.js";

class Light {
    constructor(colorUniform, ambient, diffuse, specular, position)
    {
        this.colorUniform = colorUniform;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.isOn = 1;
        this.type = null;
        this.position = position;
    }

    bind(shader)
    {
        shader.setUniform3f(this.colorUniform + ".position", this.position[0], this.position[1], this.position[2]);
        shader.setUniform3f(this.colorUniform + ".ambient", this.ambient, this.ambient, this.ambient);
        shader.setUniform3f(this.colorUniform + ".diffuse", this.diffuse, this.diffuse, this.diffuse);
        shader.setUniform3f(this.colorUniform + ".specular", this.specular, this.specular, this.specular);
        shader.setUniform1i(this.colorUniform + ".isOn", this.isOn);
    }

    getViewMatrix()
    {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, [0.001, 0.001, 0.001], [0, 1, 0]);
        return viewMatrix;
    }
}

export default Light