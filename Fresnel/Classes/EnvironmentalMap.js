import FrameBuffer from './FrameBuffer.js';
import GL from './GL.js';
class EnvironmentalMap
{
    constructor(slot, renderFunction, width, height)
    {
        // Kontext erstellen
        const gl = this.gl = GL.getGL();

        // Parameter merken
        this.slot = slot;
        this.renderFunction = renderFunction;
        this.width = width;
        this.height = height;

        // Textur erstellen und binden
        this.envMap = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envMap);

        for (let i = 0; i < 6; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }

        this.rerender();

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envMap);
        
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    }

    /**
     * Methode bindet die EnvMap.
     */
    bind()
    {
        // Die Textur aktivieren
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.envMap);
    }

    /**
     * Methode zum erneuten rendern der envMap.
     */
    rerender()
    {
        // Die Szene 6 mal anhand der Renderfunction rendern und die verschiedenen Bilder des von Framebuffer auf Cubemap speichern
        let framebuffer = new FrameBuffer(this.height, this.width);
        for(let i = 0; i < 6; i++)
        {
            framebuffer.bind();
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.envMap, 0);
            this.renderFunction();
            framebuffer.unbind();
        }
    }
}

export default EnvironmentalMap