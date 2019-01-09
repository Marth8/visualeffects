import GL from './GL.js'
const gl = GL.getGL();
class Shader
{
    constructor(program, vsShaderString, fsShaderString)
    {
        const gl = this.gl = GL.getGL();
        this.program = program;
        this.locations = [];
        this.vertexshader = Shader.getShader(vsShaderString, "vertex");
        this.fragmentShader = Shader.getShader(fsShaderString, "fragment");
        this.gl.attachShader(this.program, this.vertexshader);
        this.gl.attachShader(this.program, this.fragmentShader);
    }

    bind()
    {
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.warn("Could not link program: " + this.gl.getProgramInfoLog(this.program));
            return null;
        }
        this.gl.useProgram(this.program);
    }

    unbind()
    {
        this.gl.detachShader(this.program, this.vertexshader);
        this.gl.detachShader(this.program, this.fragmentShader);
        this.gl.deleteShader(this.vertexshader);
        this.gl.deleteShader(this.fragmentShader);
    }

    getParameter(name)
    {
        let attribLocation = this.gl.getAttribLocation(this.program, name);
        if(!attribLocation == undefined)
        {
            console.error("Der Parameter '" + name + "' konnte nicht gefunden werden");
        }

        return attribLocation;
    }

    setUniform3f(name, v0, v1, v2)
    {
        this.gl.uniform3f(this.getUniformLocation(name), v0, v1, v2);
    }

    setUniform4f(name, v0, v1, v2, v3)
    {
        this.gl.uniform4f(this.getUniformLocation(name), v0, v1, v2, v3);
    }

    getUniformLocation(name)
    {
        let uniformlocation = this.locations.find(location => location.name == name);
        if(!uniformlocation)
        {
            let location = this.gl.getUniformLocation(this.program, name);

            if(!location)
            {
                console.error("Uniform not found.", name);
            }

            this.locations.push({name: name, value: location})

            return location;
        }

        return uniformlocation.value;
        
    }

    static getShader(source, type) {
        const gl = this.gl = GL.getGL();
        var shader = null;

        switch (type) {
            case "vertex":
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;
            case "fragment":
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default:
                return null;
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.warn(type + "Shader: " + this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
}
export default Shader