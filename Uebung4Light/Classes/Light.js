import GL from "./GL.js";

class Light {
    constructor(colorUniform, ambient, diffuse, specular, shader, v0, v1, v2)
    {
        this.colorUniform = colorUniform;
        this.shader = shader;
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2; 
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }

    bind()
    {
        this.shader.bind();
        this.shader.setUniform3f(this.colorUniform + ".color", this.v0, this.v1, this.v2);
        this.shader.setUniform3f(this.colorUniform + ".ambient", this.ambient, this.ambient, this.ambient);
        this.shader.setUniform3f(this.colorUniform + ".diffuse", this.diffuse, this.diffuse, this.diffuse);
        this.shader.setUniform3f(this.colorUniform + ".specular", this.specular, this.specular, this.specular);
    }
}

export default Light