import Material from './Material.js';

/**
 * Klasse repräsentiert eine Tiefenbildtexture.
 */
class DepthTexture extends Material
{
    /**
     * Konstruktor zum Erstellen der Tiefenbildtexture.
     * @param {Shader} shader Der Shader.
     * @param {vec3} ambient Der Ambientanteil.
     * @param {vec3} diffuse Der Diffuseanteil.
     * @param {vec3} specular Der Specularanteil.
     * @param {float} shininess Der Glanzanteil.
     * @param {int} slot Der Slot.
     * @param {Texture} texture Die Texture des Tiefenbildes.
     */
    constructor(shader, ambient, diffuse, specular, shininess, slot, texture)
    {
        super(shader, ambient, diffuse, specular, shininess);
        this.slot = slot;
        this.texture = texture;
    }

    /**
     * Methode zum Binden der Tiefentexture.
     */
    bind()
    {
        // Den Shader binden und die Texture aktivieren/binden
        this.shader.bind();
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.shader.setUniform1i("uTexture", this.slot);
    }
}

export default DepthTexture