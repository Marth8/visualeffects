import Material from './Material.js';

class DepthTexture extends Material{
    constructor(uniformName, shader, ambient, diffuse, specular, shininess, slot, texture)
    {
        super(uniformName, shader, ambient, diffuse, specular, shininess);
        this.slot = slot;
        this.texture = texture;
    }

    bind()
    {
        this.shader.bind();
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.shader.setUniform1i(this.uniformName, this.slot);
    }

}

export default DepthTexture