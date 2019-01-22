import GL from "./GL.js";
class Material
{
    constructor(uniformName, shader)
    {
        this.gl = GL.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
    }

    bind()
    {
        this.shader.bind();
    }
}
export default Material