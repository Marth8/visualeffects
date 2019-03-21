import GL from './GL.js'

/**
 * Klasse repräsentiert einen Shader.
 */
class Shader
{
    /**
     * Methode zum Erstellen des Shaders anhand der vsStrings und fsStrings.
     * @param {*} vsShaderString Der String des VertexShaders.
     * @param {*} fsShaderString Der String des FragmentShaders.
     */
    constructor(vsShaderString, fsShaderString)
    {
        // GL-Kontext holen und Programm erstellen
        const gl = this.gl = GL.getGL();
        this.program = gl.createProgram();

        // Felder für die Positionen und Lichter erstellen
        this.locations = [];
        this.lights = [];

        // Die Shader erstellen
        this.vertexshader = Shader.getShader(vsShaderString, "vertex");
        this.fragmentShader = Shader.getShader(fsShaderString, "fragment");

        // Die Shader zum Programm heften und das Programm erlinken
        gl.attachShader(this.program, this.vertexshader);
        gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
    }

    /**
     * Methode zum Binden des Shaders.
     */
    bind()
    {
        // Bei Fehler diesen melden
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.warn("Could not link program: " + this.gl.getProgramInfoLog(this.program));
            return null;
        }

        // Das Programm nutzen
        this.gl.useProgram(this.program);

        // Die Lichter binden
        for(let light of this.lights) light.bind();
    }

    /**
     * Metode um die Position anhand des Namens eines Attributes zu holen.
     * @param {string} name Der Name des Attributes.
     */
    getParameter(name)
    {
        // Das Attribut holen und bei Fehler diesen melden
        let attribLocation = this.gl.getAttribLocation(this.program, name);
        if(!attribLocation == undefined)
        {
            console.error("Der Parameter '" + name + "' konnte nicht gefunden werden");
        }

        return attribLocation;
    }

    /**
     * Methode zum Setzen eines int-Uniforms.
     * @param {string} name Der Name des Uniforms. 
     * @param {int} value Der Wert.
     */
    setUniform1i(name, value)
    {
        this.gl.uniform1i(this.getUniformLocation(name), value);
    }

    /**
     * Methode zum Setzen eines float-Uniforms.
     * @param {string} name Der Name des Uniforms. 
     * @param {float} value Der Wert.
     */
    setUniform1f(name, value)
    {
        this.gl.uniform1f(this.getUniformLocation(name), value);
    }

    /**
     * Methode zum Setzen eines vec3(float)-Uniforms.
     * @param {string} name Der Name des Uniforms.
     * @param {float} v0 Der erste Wert.
     * @param {float} v1 Der zweite Wert.
     * @param {float} v2 Der dritte Wert.
     */
    setUniform3f(name, v0, v1, v2)
    {
        this.gl.uniform3f(this.getUniformLocation(name), v0, v1, v2);
    }

    /**
     * Methode zum Setzen eines vec4(float)-Uniforms.
     * @param {string} name Der Name des Uniforms.
     * @param {float} v0 Der erste Wert.
     * @param {float} v1 Der zweite Wert.
     * @param {float} v2 Der dritte Wert.
     * @param {float} v3 Der vierte Wert.
     */
    setUniform4f(name, v0, v1, v2, v3)
    {
        this.gl.uniform4f(this.getUniformLocation(name), v0, v1, v2, v3);
    }

    /**
     * Methode zum Setzen eines mat4-Uniforms.
     * @param {string} name Der Name des Uniforms.
     * @param {boolean} transpose Ob die Matrix transponiert werden soll.
     * @param {float} v1 Der float-Wert der Matrix.
     */
    setUniformMatrix4fv(name, transpose, matrix)
    {
        this.gl.uniformMatrix4fv(this.getUniformLocation(name), transpose, matrix);
    }
    
    /**
     * Methode zum ermitteln der UniformLocation.
     * @param {*} name Der Name des Uniforms
     */
    getUniformLocation(name)
    {
        // Falls die Position schon im Zwischenspeicher liegt, diesen ermitteln
        let uniformlocation = this.locations.find(location => location.name == name);

        // Wenn noch nicht im Zwischenspeicher, dann ermitteln
        if(!uniformlocation)
        {
            // Die Position holen
            let location = this.gl.getUniformLocation(this.program, name);

            // Melden, wenn das Uniform nicht gefunden wurde
            if(!location)
            {
                console.error("Uniform not found.", name);
            }

            // Position zwischenspeichern
            this.locations.push({name: name, value: location})

            return location;
        }

        return uniformlocation.value;
        
    }

    /**
     * Funktion zum Erstellen eines Shaders.
     * @param {string} source Der Shaderstring.
     * @param {string} type Der Shadertyp.
     */
    static getShader(source, type) {
        const gl = this.gl = GL.getGL();
        var shader = null;

        // Je nach Typ den Shader erstellen
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

        // Den Shaderstring setzen und kompilieren
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Bei Fehler beim compilieren, diesen melden
        if (!gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.warn(type + "Shader: " + this.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
}
export default Shader