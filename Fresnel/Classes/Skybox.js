import GL from './GL.js';
import GameObject from './GameObject.js';
import CubeMap from './CubeMap.js';
import fragmentShaderSkyboxString from './../Shaders/FragmentShaderSkybox.js';
import vertexShaderSkyboxString from './../Shaders/VertexShaderSkybox.js';
import Shader from './Shader.js';
import VertexArray from './VertexArray.js';
import VertexBuffer from './VertexBuffer.js';
import IndexBuffer from './IndexBuffer.js';

const skyboxVertices = new Float32Array([
    // positions          
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,

    -1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,

     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0
]);

class Skybox extends GameObject {
    constructor(paths, slot)
    {
        super();
        
        // Den Shader erstellen
        this.shader = new Shader(vertexShaderSkyboxString, fragmentShaderSkyboxString);

        // Die CubeMap erstellen
        this.cubeMap = new CubeMap(this.shader, paths, slot);

        let data = new Array(36);
        for (let i = 0; i < data.length; i++)
        {
            data[i] = i;
        }
        // Den IndexBuffer erstellen
        this.indexBuffer = new IndexBuffer(data);

        // Das VertexArray erstellen
        this.vertexArray = new VertexArray();
        
        // Erstellen des Buffers für die Position und den Normalen
        const vb1 = new VertexBuffer(skyboxVertices);
        let posAttribLocation = this.shader.getParameter("aPosition");

        // Hinzufügen der Buffer zum VertexArray.
        this.vertexArray.addBuffer(vb1, [posAttribLocation], 3);
    }

    canBeDrawn()
    {
        return (this.cubeMap.canBeDrawn == 6);
    }

    draw()
    {
        this.gl.depthFunc(this.gl.LEQUAL);

        // Die Elemente binden
        this.shader.bind();
        this.vertexArray.bind();
        this.indexBuffer.bind();
        this.cubeMap.bind();

        // Zeichnen
        this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);

        //this.gl.depthMask(this.gl.TRUE);
        this.gl.depthFunc(this.gl.LESS);
    }
}

export default Skybox