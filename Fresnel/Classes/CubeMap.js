import GL from "./GL.js";

/**
 * Klasse repräsentiert eine CubeMap.
 */
class CubeMap 
{
    /**
     * Konstruktor zum Erstellen der CubeMap.
     * @param {Shader} shader Der Shader.
     * @param {array(string)} paths Die Paths.
     * @param {int} slot Der Slot.
     */
    constructor(shader, paths, slot)
    {
        // Kontext erstellen
        const gl = this.gl = GL.getGL();

        // Parameter merken
        this.slot = slot;
        this.shader = shader;
        this.canBeDrawn = 0;

        // Textur erstellen und binden
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        // CubeMap erstmal mit roten Pixel füllen
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 1, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 2, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 3, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 4, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + 5, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255]));

        // Die Paths durchlaufen und den Faces das Image setzen, sobald geladen
        for (let i = 0; i < paths.length; i++)
        {
            let image = new Image();
            image.src = paths[i];
            image.crossOrigin = "";
            image.addEventListener("load", () => 
            {
                // Sobald geladen, das Bild auf die Textur setzen
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

                this.canBeDrawn++;
            });

            // Bei einem Fehler, den Fehler des Ladens anzeigen
            image.addEventListener('error', function(event)
            {
                console.error("Ein Fehler bei Laden der Textur '" + paths[i] + "' ist aufgetreten.")            
                console.log(event);
            });
        }
        
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    /**
     * Methode bindet die CubeMap.
     */
    bind()
    {
        // Den Shader binden
        this.shader.bind();

        // Die Textur aktivieren
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
    }
}
export default CubeMap