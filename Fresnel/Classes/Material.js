import GL from "./GL.js";
/**
 * Klasse repräsentiert das Material eines Objektes.
 */
class Material
{
    /**
     * Klasse zum Erstellen eines Materials
     * @param {Shader} shader Der Shader.
     * @param {vec3} ambient Der Ambientanteil.
     * @param {vec3} diffuse Der Diffuseanteil.
     * @param {vec3} specular Der Specularanteil.
     * @param {float} shininess Das Glänzen.
     */
    constructor(shader, ambient= [1.0, 0.5, 0.31], diffuse = [1.0, 0.5, 0.31], specular = [0.5, 0.5, 0.5], shininess = 32.0, metalness = 0.0)
    {
        this.gl = GL.getGL();
        this.shader = shader;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.metalness = metalness;
    }

    /**
     * Methode zum Binden des Materials.
     */
    bind()
    {
        // Shader binden und die Uniforms setzen.
        this.shader.bind();
        this.shader.setUniform3f("material.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        this.shader.setUniform3f("material.diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        this.shader.setUniform3f("material.specular", this.specular[0], this.specular[1], this.specular[2]);
        this.shader.setUniform1f("material.shininess", this.shininess);
        this.shader.setUniform1f("material.metalness", this.metalness);
    }
}
export default Material