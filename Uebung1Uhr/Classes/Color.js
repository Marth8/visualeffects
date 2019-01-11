class Color {
    constructor(uniformName, shader, v0, v1, v2, v3)
    {
        this.uniformName = uniformName;
        this.shader = shader;
        this.v0 = v0; 
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    bind()
    {
        if(!this.v3)
        {
            this.shader.setUniform3f(this.uniformName, this.v0, this.v1, this.v2);
        }
        else
        {
            this.shader.setUniform4f(this.uniformName, this.v0, this.v1, this.v2, this.v3);
        }

    }

}

export default Color