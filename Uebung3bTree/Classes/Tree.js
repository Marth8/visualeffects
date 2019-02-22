import Transform from './Transform.js';
import GL from "./GL.js";
import Shader from "./Shader.js";
import Texture from "./Texture.js";
import Cube from "./Cube.js";

class Tree extends Transform{

    constructor(vsSourceString, fsSourceString) {
        super();
        const gl = this.gl = GL.getGL();

        // Den Cube mit Textur erstellen
        let program = gl.createProgram();
        this.shader = new Shader(program, vsSourceString, fsSourceString);
        this.shader.bind();
        let texture = new Texture("uTexture", this.shader, window.location.href + "res/woodWall.jpg", 0);
        this.root = new Cube(this.shader, true, null, texture);
        this.root.gameObject.transform.setScale([0.8, 2, 0.8]);
        this.root.gameObject.transform.setPosition([0, -3, 0]);

        // Erster Ast
        let program2 = gl.createProgram();
        this.shader2 = new Shader(program2, vsSourceString, fsSourceString);
        this.shader2.bind();
        let texture2 = new Texture("uTexture", this.shader2, window.location.href + "res/woodWall.jpg", 0);
        this.branch1 = new Cube(this.shader2, true, null, texture2);
        this.branch1.gameObject.transform.setScale([0.8, 2, 0.8]);
        
        // Den Rotator für den ersten Ast anlegen
        let branch1Rotator = new Transform();
        this.branch1.gameObject.transform.setParent(branch1Rotator);
        branch1Rotator.rotateY(60);
        branch1Rotator.rotateZ(60);

        // Zweiter Ast
        let program3 = gl.createProgram();
        this.shader3 = new Shader(program3, vsSourceString, fsSourceString);
        this.shader3.bind();
        let texture3 = new Texture("uTexture", this.shader3, window.location.href + "res/woodWall.jpg", 0);
        this.branch2 = new Cube(this.shader3, true, null, texture3);
        this.branch2.gameObject.transform.setScale([0.8, 2, 0.8]);
        this.branch2.gameObject.transform.rotateY(120);
        this.branch2.gameObject.transform.rotateZ(60);

        // Den Rotator für den zweiten Ast anlegen
        let branch2Rotator = new Transform();
        this.branch2.gameObject.transform.parent = branch2Rotator;
        branch2Rotator.rotateY(120);
        branch2Rotator.rotateZ(60);

        // Dritter Ast
        let program4 = gl.createProgram();
        this.shader4 = new Shader(program4, vsSourceString, fsSourceString);
        this.shader4.bind();
        let texture4 = new Texture("uTexture", this.shader4, window.location.href + "res/woodWall.jpg", 0);
        this.branch3 = new Cube(this.shader4, true, null, texture4);
        this.branch3.gameObject.transform.setScale([0.8, 2, 0.8]);
        this.branch3.gameObject.transform.rotateY(120);
        this.branch3.gameObject.transform.rotateZ(60);

        // Den Rotator für den dritten Ast anlegen
        let branch3Rotator = new Transform();
        this.branch3.gameObject.transform.parent = branch3Rotator;
        branch3Rotator.rotateY(240);
        branch3Rotator.rotateZ(60);

        this.root.gameObject.transform.parent = this;
        branch1Rotator.parent = this;
        branch2Rotator.parent = this;
        branch3Rotator.parent = this;

        this.scene = null;
    }

    draw(renderer, camera)
    {
        renderer.drawElement(this.root, this.shader, camera);
        renderer.drawElement(this.branch1, this.shader2, camera);
        renderer.drawElement(this.branch2, this.shader3, camera);
        renderer.drawElement(this.branch3, this.shader4, camera);
    }
}

export default Tree