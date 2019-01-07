import GL from './GL.js';
const gl = GL.getGL();
class Renderer
{
    vertexShaderStr = `
        uniform vec3 color;
        varying vec3 vColor;
        attribute vec3 position;
        uniform mat4 uRotate;
        void main () { 
            vColor = color;
            gl_PointSize = 10.0;
            gl_Position = vec4(position, 1.0);
    }`;

    fragmentShaderStr = `
        precision mediump float; 
        varying vec3 vColor; 
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
    }`;

    constructor()
    {
        this.shaderProgram = null;
        this.lastFrameTime = 0;
    }
}

export default Renderer;