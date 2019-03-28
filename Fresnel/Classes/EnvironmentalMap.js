import FrameBuffer from './FrameBuffer.js';
import GL from './GL.js';
import ViewCamera from './ViewCamera.js';

/**
 * Klasse repräsentiert eine Umgebungsmap.
 */
class EnvironmentalMap
{
    /**
     * Konstruktor zum Erstellen einer Umgebungsmap.
     * @param {int} slot Der Slot der Umgebungsmap.
     * @param {*} renderFunction Die Renderer-Funktion.
     * @param {*} width Die Breite.
     * @param {*} height Die Höhe.
     */
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

        // Die Textur erstmal rot füllen
        for (let i = 0; i < 6; i++)
        {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }

        // Die Umgebungsmap rendern
        this.rerender();

        // Die Map binden
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envMap);
        
        // Mipmap generieren und die Filter setzen
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
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

        // Die ViewCamera für die 6 Sichten (-x, x, -y, y, -z und z) erstellen
        let projection = mat4.create();
        mat4.perspective(projection, Math.PI/2, 1, 1, 100);
        let viewCamera = new ViewCamera(projection);
        const gl = this.gl;

        // Die sechs Sichten rendern
        framebuffer.bind();
        viewCamera.setScale([-1, -1, 1]);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, this.envMap, 0);
        this.renderFunction(viewCamera);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, this.envMap, 0);
        viewCamera.reset();
        viewCamera.setScale([-1, -1, 1]);
        viewCamera.rotateY(-90);
        framebuffer.unbind();
        framebuffer.bind();
        this.renderFunction(viewCamera);

        viewCamera.reset();
        viewCamera.setScale([-1, -1, 1]);
        viewCamera.rotateY(180);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, this.envMap, 0);
        framebuffer.unbind();
        framebuffer.bind();
        this.renderFunction(viewCamera);

        viewCamera.reset();
        viewCamera.setScale([-1, -1, 1]);
        viewCamera.rotateY(90);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, this.envMap, 0);
        framebuffer.unbind();
        framebuffer.bind();
        this.renderFunction(viewCamera);

        viewCamera.reset();
        viewCamera.rotateX(90);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, this.envMap, 0);
        framebuffer.unbind();
        framebuffer.bind();
        this.renderFunction(viewCamera);
        
        viewCamera.reset();
        viewCamera.rotateX(-90);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, this.envMap, 0);
        this.renderFunction(viewCamera);
        framebuffer.unbind();
    }
}

export default EnvironmentalMap