import GL from "./GL.js";
import Material from './Material.js';

class Texture extends Material{
    /**
     * Konstruktor zum Erstellen der Textur.
     * @param {Shader} shader Der Shader.
     * @param {vec3} ambient Der Ambientanteil.
     * @param {vec3} diffuse Der Diffuseanteil.
     * @param {vec3} specular Der Specularanteil.
     * @param {float} shininess Das Glänzen.
     * @param {string} path Der Pfad zur Textur.
     * @param {int} slot Der Texturslot.
     */
    constructor(shader, path, slot = 0, ambient= [1.0, 0.5, 0.31], diffuse = [1.0, 0.5, 0.31], specular = [0.5, 0.5, 0.5], shininess = 32.0)
    {
        super(shader, ambient, diffuse, specular, shininess);

        // Kontext erstellen
        const gl = this.gl = GL.getGL();

        // Parameter merken
        this.path = path;
        this.slot = slot;
        this.buffer = 0;

        // Textur erstellen und binden
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Textur erstmal mit roten Pixel füllen
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255])); // red

        // Das Bild asynchron laden
        this.image = new Image();
        this.image.src = path;
        this.image.crossOrigin = "";
        this.image.addEventListener('load', () => 
        {
            // Sobald geladen, das Bild auf die Textur setzen
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        // Bei einem Fehler, den Fehler des Ladens anzeigen
        this.image.addEventListener('error', function(event)
        {
            console.error("Ein Fehler bei Laden der Textur '" + path + "' ist aufgetreten.")            
            console.log(event);
        });
    }

    /**
     * Methode zum Binden einer Textur.
     */
    bind()
    {
        // Den Shader binden
        this.shader.bind();

        // Die Textur aktivieren
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // Die Uniforms setzen
        this.shader.setUniform3f("material.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        this.shader.setUniform1i("material.diffuse", this.slot);
        this.shader.setUniform1f("material.shininess", this.shininess);
    }

}

export default Texture