export default class Shader
{
    shaderString;
    shaderType;
    shader;

    constructor(shaderString, shaderType)
    {
        this.shaderString = shaderString;
        this.shadertype = shaderType;
    }

    initShader()
    {
        let shader = gl.createShader(this.shaderType);
        gl.shaderSource(shader, this.shaderString);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            let info = gl.getShaderInfoLog(shader);
            console.warn("could not compile web gl shader. \n\n" + info);
        }

        this.shader = shader;
        return this.shader;
    }
}