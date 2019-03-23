import Transform from './Transform.js';
import GL from "./GL.js";
import Shader from "./Shader.js";
import Texture from "./Texture.js";
import Cube from "./Cube.js";

/**
 * Klasse repräsentiert einen Baum mit drei Ästen.
 */
class Tree extends Transform
{
    constructor(vsSourceString, fsSourceString) {
        super();
        const gl = this.gl = GL.getGL();

        // Den Cube mit Textur erstellen
        this.shader = new Shader(vsSourceString, fsSourceString);
        this.shader.bind();
        let texture = new Texture("uTexture", this.shader, window.location.href + "res/woodWall.jpg", 0);
        this.root = new Cube(this.shader, true, null, texture);
        this.root.transform.setScale([1, 2, 1]);
        this.root.transform.move([0, -1, 0]);

        // Erster Ast
        this.shader2 = new Shader(vsSourceString, fsSourceString);
        this.shader2.bind();
        let texture2 = new Texture("uTexture", this.shader2, window.location.href + "res/woodWall.jpg", 0);
        this.branch1 = new Cube(this.shader2, true, null, texture2);
        this.branch1.transform.setScale([1, 2, 1]);
        this.branch1.transform.move([0, 2, 0]);

        // Den Rotator für den ersten Ast anlegen
        let branch1Rotator = new Transform();
        this.branch1.transform.setParent(branch1Rotator);
        branch1Rotator.rotateY(0);
        branch1Rotator.rotateZ(60);

        // Zweiter Ast
        this.shader3 = new Shader(vsSourceString, fsSourceString);
        this.shader3.bind();
        let texture3 = new Texture("uTexture", this.shader3, window.location.href + "res/woodWall.jpg", 0);
        this.branch2 = new Cube(this.shader3, true, null, texture3);
        this.branch2.transform.setScale([1, 2, 1]);
        this.branch2.transform.move([0, 2, 0]);

        // Den Rotator für den zweiten Ast anlegen
        let branch2Rotator = new Transform();
        this.branch2.transform.setParent(branch2Rotator);
        branch2Rotator.rotateY(120);
        branch2Rotator.rotateZ(60);

        // Dritter Ast
        this.shader4 = new Shader(vsSourceString, fsSourceString);
        this.shader4.bind();
        let texture4 = new Texture("uTexture", this.shader4, window.location.href + "res/woodWall.jpg", 0);
        this.branch3 = new Cube(this.shader4, true, null, texture4);
        this.branch3.transform.setScale([1, 2, 1]);
        this.branch3.transform.move([0, 2, 0]);

        // Den Rotator für den dritten Ast anlegen
        let branch3Rotator = new Transform();
        this.branch3.transform.setParent(branch3Rotator);
        branch3Rotator.rotateY(240);
        branch3Rotator.rotateZ(60);

        // Die Parents setzen
        this.root.transform.setParent(this);
        branch1Rotator.setParent(this);
        branch2Rotator.setParent(this);
        branch3Rotator.setParent(this);
    }

    /**
     * Methode zum Zeichnen des Baumes.
     * @param {Renderer} renderer Der Renderer.
     * @param {ViewCamera} camera Die Camera.
     */
    draw(renderer, camera)
    {
        // Die Elemente zeichnen
        renderer.drawElement(this.root, this.shader, camera);
        renderer.drawElement(this.branch1, this.shader2, camera);
        renderer.drawElement(this.branch2, this.shader3, camera);
        renderer.drawElement(this.branch3, this.shader4, camera);
    }
}

export default Tree